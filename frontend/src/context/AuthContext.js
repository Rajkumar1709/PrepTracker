import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const res = await api.get('/api/users/me', config);
                    setUser(res.data);
                } catch (err) {
                    console.error('Could not fetch user', err);
                    logout(); // Log out if token is invalid
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);

        // NEW: Clear the saved compiler state on logout
        sessionStorage.removeItem('compilerCode');
        sessionStorage.removeItem('compilerLanguage');
        sessionStorage.removeItem('compilerInput');
        sessionStorage.removeItem('compilerOutput');
    };

    const authContextValue = { token, user, loading, login, logout };

    return (
        <AuthContext.Provider value={authContextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};