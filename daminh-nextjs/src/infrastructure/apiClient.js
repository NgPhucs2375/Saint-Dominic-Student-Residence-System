//Interceptor - Nơi xử lý mọi Request/Reponse chung (như gắn Token, xử lý lỗi 401,..)
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5119/api', // Địa chỉ Backend .NET của bạn
    headers: { 'Content-Type': 'application/json' }
});

// Request Interceptor: Tự động gắn Token vào Header
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('daminh_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Xử lý lỗi tập trung
apiClient.interceptors.response.use(
    (response) => response.data, // Chỉ trả về dữ liệu thuần
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token hết hạn, đá về login
            localStorage.removeItem('daminh_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;