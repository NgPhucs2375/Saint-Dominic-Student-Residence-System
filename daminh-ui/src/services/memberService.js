import apiClient from './apiClient';

export const MemberService = {
    // Tùy theo Controller C# của bạn đang viết đường dẫn nào
    getAllMembers: () => apiClient.get('/Users'), 
};