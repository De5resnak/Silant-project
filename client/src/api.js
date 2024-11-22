import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // базовый URL для API
    headers: {
        'Content-Type': 'application/json',
    },
});

// Функция для сохранения токенов
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('access_token', token);
    } else {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('access_token');
    }
};

export default api;