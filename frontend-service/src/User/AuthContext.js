import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context for authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ username: '', password: '' });
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user info when auth credentials change
        if (auth.username && auth.password) {
            const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;

            axios.get('http://192.168.49.2:30001/api/users/me', {
                headers: {
                    Authorization: authHeader
                }
            })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setUser(null); // Clear user data on error
            });
        }
    }, [auth]);

    const login = (username, password) => {
        setAuth({ username, password });
    };

    const logout = () => {
        setAuth({ username: '', password: '' });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ auth, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
