import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
    const [authToken, setAuthToken] = useState(localStorage.getItem('token') || '');

    const handleLogin = (token) => {
        setAuthToken(token);
        localStorage.setItem('token', token);
    };

    const handleLogout = () => {
        setAuthToken('');
        localStorage.removeItem('token');
    };

    return (
        <div>
            {!authToken ? (
                <Login onLogin={handleLogin} />
            ) : (
                <Dashboard onLogout={handleLogout} />
            )}
        </div>
    );
}

export default App;

