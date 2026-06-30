// Chứa logic liên quan đến Tài chính, ví dụ: lấy dữ liệu thống kê, báo cáo, chi tiêu, thu nhập,...
import apiClient from '../apiClient';

export const FinanceService = {
    // Gọi API GetHouseLedger trong FinanceController.cs
    getLedger: () => apiClient.get('/Finance/ledger'),
    
    // Gọi API CreateTransaction trong FinanceController.cs
    createTransaction: (data) => apiClient.post('/Finance', data),
    
    // Gọi API ApproveTransaction trong HousesController.cs
    approveTransaction: (id) => apiClient.put(`/Houses/approve-transaction`, { transactionId: id, isApproved: true })
};