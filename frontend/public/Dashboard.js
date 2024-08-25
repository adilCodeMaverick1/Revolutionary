import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../css/dash.css';

function Dashboard({ onLogout }) {
    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
    };

    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);

    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', categoryIds: [] });
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleAddCategory = async () => {
        try {
            const { data } = await api.post('/categories', { name: newCategory });
            setCategories([...categories, data]);
            setNewCategory('');
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    const handleUpdateCategory = async () => {
        try {
            const { data } = await api.put(`/categories/${editingCategory.id}`, { name: editingCategory.name });
            setCategories(categories.map(cat => cat.id === data.id ? data : cat));
            setEditingCategory(null);
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await api.delete(`/categories/${id}`);
            setCategories(categories.filter(cat => cat.id !== id));
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const handleAddProduct = async () => {
        try {
            const productToAdd = {
                ...newProduct,
                categoryIds: newProduct.categoryIds.map(id => parseInt(id, 10)),
                price: parseFloat(newProduct.price)
            };
            const { data } = await api.post('/products', productToAdd);
            setProducts([...products, data]);
            setNewProduct({ name: '', description: '', price: '', categoryIds: [] });
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const handleUpdateProduct = async () => {
        if (!editingProduct) return;

        try {
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('name', newProduct.name);
            formData.append('description', newProduct.description);
            formData.append('price', newProduct.price);
            newProduct.categoryIds.forEach(id => formData.append('categoryIds[]', id));

            const { data } = await api.post(`/products/${editingProduct.id}`, formData);
            
            console.log("Updated Product:", data);
            
            setProducts(products.map(prod => prod.id === data.id ? data : prod));
            setEditingProduct(null);
            setNewProduct({ name: '', description: '', price: '', categoryIds: [] });
            
            fetchProducts();
        } catch (error) {
            console.error("Error updating product:", error.response ? error.response.data : error.message);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(prod => prod.id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleProductClick = (product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            categoryIds: product.categories.map(cat => cat.id.toString())
        });
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Dashboard</h1>
                <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
            </header>

            <div className="dashboard-content">
                <section className="category-section">
                    <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
                    <div className="input-group">
                        <input
                            type="text"
                            className="input"
                            value={editingCategory ? editingCategory.name : newCategory}
                            onChange={(e) => editingCategory ? setEditingCategory({ ...editingCategory, name: e.target.value }) : setNewCategory(e.target.value)}
                            placeholder="Category Name"
                        />
                        {editingCategory ? (
                            <button className="btn btn-update" onClick={handleUpdateCategory}>Update Category</button>
                        ) : (
                            <button className="btn btn-add" onClick={handleAddCategory}>Add Category</button>
                        )}
                    </div>

                    <h2>Categories</h2>
                    <ul className="item-list">
                        {categories.map((category) => (
                            <li key={category.id} className="item">
                                <div className="item-content">
                                    <span>{category.name}</span>
                                    <div className="item-actions">
                                        <button className="btn btn-edit" onClick={() => setEditingCategory(category)}>Edit</button>
                                        <button className="btn btn-delete" onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="product-section">
                    <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                    <div className="input-group">
                        <input
                            type="text"
                            className="input"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="Product Name"
                        />
                        <input
                            type="text"
                            className="input"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            placeholder="Description"
                        />
                        <input
                            type="number"
                            className="input"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            placeholder="Price"
                            step="0.01"
                        />
                        <select
                            multiple
                            className="input"
                            value={newProduct.categoryIds}
                            onChange={(e) => setNewProduct({ ...newProduct, categoryIds: Array.from(e.target.selectedOptions, option => option.value) })}
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {editingProduct ? (
                            <button className="btn btn-update" onClick={handleUpdateProduct}>Update Product</button>
                        ) : (
                            <button className="btn btn-add" onClick={handleAddProduct}>Add Product</button>
                        )}
                    </div>

                    <h2>Products</h2>
                    <ul className="item-list">
                        {products.map((product) => (
                            <li key={product.id} className="item">
                                <div className="item-content">
                                    <span>{product.name} - ${product.price}</span>
                                    <small>Categories: {product.categories ? product.categories.map(cat => cat.name).join(', ') : 'No categories'}</small>
                                    <div className="item-actions">
                                        <button className="btn btn-edit" onClick={() => handleProductClick(product)}>Edit</button>
                                        <button className="btn btn-delete" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;