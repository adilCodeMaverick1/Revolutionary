import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { setAuthToken } from './services/api';

function App() {
    const [authToken, setAuthTokenState] = useState(localStorage.getItem('token') || '');

    const handleLogin = (token) => {
        setAuthTokenState(token);
        localStorage.setItem('token', token);
        setAuthToken(token); 
    };

    const handleLogout = () => {
        setAuthTokenState('');
        localStorage.removeItem('token');
        setAuthToken(''); 
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
