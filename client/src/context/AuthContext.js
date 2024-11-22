import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
    const [user, setUser] = useState(null);

    const login = (tokens, userData) => {
        // Сохраняем токены и информацию о пользователе в localStorage
        localStorage.setItem('authToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);

        // Устанавливаем состояние аутентификации и данные пользователя
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        setUser(null); // Удаляем информацию о пользователе
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
