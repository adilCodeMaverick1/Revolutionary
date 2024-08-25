import React, { useState } from 'react';
import api from '../services/api';
import  '../css/login.css';

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
        <div className='center'>
        <div className='container'>
        
        <form onSubmit={handleSubmit} className="form">
        <h1>Login</h1>
            <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <input className="input"type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
            <button type="submit" className='btn'><span>login</span></button>
            {error && <p className='error'>{error}</p>}
        </form>
        </div>
        </div>
        </>
    );
}

export default Login;
