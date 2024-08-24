

import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchCategories } from '../services/productApi';
import api from '../services/api';

function ProductDashboard({ onLogout }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', categories: [] });
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: productsData } = await fetchProducts();
                setProducts(productsData);

                const { data: categoriesData } = await fetchCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleAddProduct = async () => {
        try {
            const { data } = await createProduct(newProduct);
            setProducts([...products, data]);
            setNewProduct({ name: '', description: '', price: '', categories: [] });
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateProduct = async () => {
        try {
            const { data } = await updateProduct(editingProduct.id, editingProduct);
            setProducts(products.map(prod => prod.id === data.id ? data : prod));
            setEditingProduct(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await deleteProduct(id);
            setProducts(products.filter(prod => prod.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Product Dashboard</h1>
            <button onClick={onLogout}>Logout</button>
            <div>
                <h2>Add Product</h2>
                <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Name"
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
                    value={newProduct.categories}
                    onChange={(e) => setNewProduct({ ...newProduct, categories: Array.from(e.target.selectedOptions, option => option.value) })}
                >
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button onClick={handleAddProduct}>Add</button>
            </div>
            <div>
                <h2>Products</h2>
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            {editingProduct && editingProduct.id === product.id ? (
                                <div>
                                    <input
                                        type="text"
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        value={editingProduct.description}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        value={editingProduct.price}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                    />
                                    <select
                                        multiple
                                        value={editingProduct.categories}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, categories: Array.from(e.target.selectedOptions, option => option.value) })}
                                    >
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button onClick={handleUpdateProduct}>Update</button>
                                </div>
                            ) : (
                                <div>
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <p>${product.price}</p>
                                    <p>Categories: {product.categories.map(cat => cat.name).join(', ')}</p>
                                    <button onClick={() => setEditingProduct(product)}>Edit</button>
                                    <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ProductDashboard;
