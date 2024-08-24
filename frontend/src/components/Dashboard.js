import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Dashboard({ onLogout }) {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategories();
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

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={onLogout}>Logout</button>
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
        </div>
    );
}

export default Dashboard;
