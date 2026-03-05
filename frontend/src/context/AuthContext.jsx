import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const res = await api.get('/user');
            setUser(res.data.user);
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await api.post('/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const register = async (name, email, password, password_confirmation) => {
        const res = await api.post('/register', {
            name, email, password, password_confirmation,
        });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch {
        }
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateBalance = (newBalance) => {
        setUser(prev => ({
            ...prev,
            wallet: { ...prev.wallet, balance: newBalance },
        }));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateBalance, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}