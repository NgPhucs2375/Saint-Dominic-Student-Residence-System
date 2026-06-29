// Chứa logic xin phép nghỉ, ví dụ: lấy dữ liệu xin phép nghỉ, gửi yêu cầu xin phép nghỉ, duyệt yêu cầu xin phép nghỉ,...
import apiClient from './apiClient';

export const LeaveService = {
    // Lấy toàn bộ đơn xin phép (Tùy theo Role mà C# sẽ trả về dữ liệu tương ứng)
    getAllLeaves: () => apiClient.get('/Leave'),
    
    // Tạo đơn mới (Dành cho Thành viên)
    createLeave: (data) => apiClient.post('/Leave', data),
    
    // Xử lý đơn: isApproved = true (Duyệt), false (Từ chối)
    processLeave: (id, isApproved) => apiClient.put(`/Leave/${id}/process`, { isApproved })
};