import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Dashboard({ onLogout }) {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', categoryIds: [] });
    const [editingProduct, setEditingProduct] = useState(null);
    const [showCategories, setShowCategories] = useState(true);

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
            setShowCategories(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateProduct = async () => {
        try {
            const { data } = await api.put(`/products/${editingProduct.id}`, editingProduct);
            setProducts(products.map(prod => prod.id === data.id ? data : prod));
            setEditingProduct(null);
            setShowCategories(true);
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
        setShowCategories(false);
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={onLogout}>Logout</button>

            {showCategories && (
                <div>
                    <h2>Add Category</h2>
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New Category"
                    />
                    <button onClick={handleAddCategory}>Add</button>
                </div>
            )}

            {showCategories && (
                <div>
                    <h2>Categories</h2>
                    <ul>
                        {categories.map((category) => (
                            <li key={category.id}>
                                {editingCategory && editingCategory.id === category.id ? (
                                    <div>
                                        <input
                                            type="text"
                                            value={editingCategory.name}
                                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                        />
                                        <button onClick={handleUpdateCategory}>Update</button>
                                    </div>
                                ) : (
                                    <div>
                                        {category.name}
                                        <button onClick={() => setEditingCategory(category)}>Edit</button>
                                        <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div>
                <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Product Name"
                />
                <input
                    type="text"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Description"
                />
                <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="Price"
                />
                <select
                    multiple
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
                    <button onClick={handleUpdateProduct}>Update Product</button>
                ) : (
                    <button onClick={handleAddProduct}>Add Product</button>
                )}
            </div>

            <div>
                <h2>Products</h2>
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            {product.name} - ${product.price}
                            <button onClick={() => handleProductClick(product)}>Edit</button>
                            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;
