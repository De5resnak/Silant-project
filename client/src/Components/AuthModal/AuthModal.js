import React, { useState, useContext } from 'react';
import api, { setAuthToken } from '../../api';
import { AuthContext } from '../../context/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/login/', { username, password });
            const { access, refresh, user } = response.data;

            // Сохраняем токены и устанавливаем заголовок авторизации
            setAuthToken(access);
            localStorage.setItem('refresh_token', refresh);
            login({ access, refresh }, user);
            setError('');
            onClose();  // Закрываем модальное окно
        } catch (err) {
            setError('Неверный логин или пароль');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="auth-modal">
            <div className="auth-modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Вход</h2>
                <form onSubmit={handleLogin} className='auth-modal-form'>
                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className='auth-modal-form-input'
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Войти</button>
                </form>
            </div>
        </div>
    );
};

export default AuthModal