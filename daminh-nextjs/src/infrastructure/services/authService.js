// Chứa logic Login/Register/Logout, lưu trữ token, refresh token, check login status,...
import apiClient from '../apiClient';

export const AuthService = {
    // Gọi API login trong AuthController.cs
    // Khớp với đối tượng [FromBody] LoginRequest (Email, Password)
    login: (email, password) => {
        return apiClient.post('/Auth/login', { email, password });
    },

    // Gọi API register trong AuthController.cs (Chỉ Cha OB mới có quyền gọi)
    // Khớp với đối tượng [FromBody] RegisterRequest
    register: (userData) => {
        return apiClient.post('/Auth/register', userData);
    },

    // API phụ để khởi tạo nhanh tài khoản Cha OB nếu Database trống
    seedAdmin: () => {
        return apiClient.post('/Auth/seed_admin');
    }
};