import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (username: string, password: string) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        const response = await api.post('/users/token', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return response.data;
    },
    register: async (email: string, username: string, password: string) => {
        const response = await api.post('/users/', { email, username, password });
        return response.data;
    },
    me: async () => {
        const response = await api.get('/users/me');
        return response.data;
    }
};

export const analysisService = {
    submitCode: async (code_content: string, language: string = 'python') => {
        const response = await api.post('/analysis/submit', { code_content, language });
        return response.data;
    },
    getHistory: async (skip: number = 0, limit: number = 50) => {
        const response = await api.get('/analysis/history', { params: { skip, limit } });
        return response.data;
    },
};

export const analyticsService = {
    getTrends: async (days: number = 30) => {
        const response = await api.get('/analytics/trends', { params: { days } });
        return response.data;
    },
    getSummary: async () => {
        const response = await api.get('/analytics/summary');
        return response.data;
    },
    getLanguageBreakdown: async () => {
        const response = await api.get('/analytics/languages');
        return response.data;
    },
};

export default api;
