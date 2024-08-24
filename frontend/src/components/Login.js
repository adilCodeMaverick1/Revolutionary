import React, { useState } from 'react';
import api from '../services/api';

function Login({ onLogin }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/login', formData);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            onLogin(data.token);
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <>
        <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
        </div>
        </>
    );
}

export default Login;
