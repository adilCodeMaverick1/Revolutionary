import React, { useEffect, useState } from 'react';
import api from '../services/api';
import  '../css/login.css';
import '../css/dash.css'
function Dashboard({ onLogout }) {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);

    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', categoryIds: [] });
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategories();
        fetchProducts();
    }, []);

  
    const handleAddCategory = async () => {
        try {
            const { data } = await api.post('/categories', { name: newCategory });
            setCategories([...categories, data]);
            setNewCategory('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateCategory = async () => {
        try {
            const { data } = await api.put(`/categories/${editingCategory.id}`, { name: editingCategory.name });
            setCategories(categories.map(cat => cat.id === data.id ? data : cat));
            setEditingCategory(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await api.delete(`/categories/${id}`);
            setCategories(categories.filter(cat => cat.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    
    const handleAddProduct = async () => {
        try {
            const { data } = await api.post('/products', newProduct);
            setProducts([...products, data]);
            setNewProduct({ name: '', description: '', price: '', categoryIds: [] });
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateProduct = async () => {
        try {
            const { data } = await api.put(`/products/${editingProduct.id}`, editingProduct);
            setProducts(products.map(prod => prod.id === data.id ? data : prod));
            setEditingProduct(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(prod => prod.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleProductClick = (product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name,
            description: product.description,
            price: product.price,
            categoryIds: product.categories.map(cat => cat.id)
        });
    };

    return (
        <div className="container mt-5">
            <h1>Dashboard</h1>
            <button className="btn btn-danger mb-4" onClick={onLogout}>Logout</button>

          
            <div className="mb-4">
                <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
                <input
                    type="text"
                    className="input"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Category Name"
                />
                {editingCategory ? (
                    <button className="btn btn-success mt-2" onClick={handleUpdateCategory}>Update Category</button>
                ) : (
                    <button className="btn btn-primary mt-2" onClick={handleAddCategory}>Add Category</button>
                )}
            </div>

            <div>
                <h2>Categories</h2>
                <ul className="list-group">
                    {categories.map((category) => (
                        <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {editingCategory && editingCategory.id === category.id ? (
                                <div>
                                    <input
                                        type="text"
                                        className="input"
                                        value={editingCategory.name}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                    />
                                    <button className="btn btn-success mt-2" onClick={handleUpdateCategory}>Update</button>
                                </div>
                            ) : (
                                <div>
                                    {category.name}
                                    <button className="btn btn-warning btn-sm mr-2" onClick={() => setEditingCategory(category)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Product CRUD */}
            <div className="mb-4 mt-5">
                <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                <input
                    type="text"
                    className="input"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Product Name"
                />
                <input
                    type="text"
                    className="input mt-2"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Description"
                />
                <input
                    type="number"
                    className="input mt-2"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="Price"
                />
                <select
                    multiple
                    className="input mt-2"
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
                    <button className="btn btn-success mt-2" onClick={handleUpdateProduct}>Update Product</button>
                ) : (
                    <button className="btn btn-primary mt-2" onClick={handleAddProduct}>Add Product</button>
                )}
            </div>

            <div>
                <h2>Products</h2>
                <ul className="list-group">
                    {products.map((product) => (
                        <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {product.name} - ${product.price} - Categories: {product.categories.map(cat => cat.name).join(', ')}
                            <div>
                                <button className="btn btn-warning btn-sm mr-2" onClick={() => handleProductClick(product)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;
