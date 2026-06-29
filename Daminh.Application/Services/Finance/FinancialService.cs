using Daminh.Application.DTOs;
using Daminh.Application.Interfaces;
using Daminh.Domain.Entities;
using Daminh.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Daminh.Application.Services
{
    public class FinancialService : IFinancialService
    {
        private readonly IGenericRepository<FinancialTransaction> _transactionRepo;
        private readonly IGenericRepository<House> _houseRepo;
        private readonly IUnitOfWork _unitOfWork;

        // Bơm cả 2 Repo (Giao dịch và Nhà) để xử lý thay đổi số dư quỹ cùng lúc
        public FinancialService(
            IGenericRepository<FinancialTransaction> transactionRepo,
            IGenericRepository<House> houseRepo,
            IUnitOfWork unitOfWork)
        {
            _transactionRepo = transactionRepo;
            _houseRepo = houseRepo;
            _unitOfWork = unitOfWork;
        }

        // 1. Tạo phiếu Thu/Chi mới
        public async Task<FinancialTransaction> CreateTransactionAsync(CreateTransactionDto dto, int houseId, int creatorId)
        {
            // Validate nghiệp vụ: Chi tiền thì phải có ảnh minh chứng
            if (dto.Type == TransactionType.Chi && string.IsNullOrEmpty(dto.ReceiptUrl))
            {
                throw new Exception("Phiếu CHI bắt buộc phải đính kèm URL ảnh hóa đơn/minh chứng.");
            }

            if (dto.Amount <= 0)
            {
                throw new Exception("Số tiền giao dịch phải lớn hơn 0.");
            }

            var transaction = new FinancialTransaction
            {
                HouseId = houseId,
                CreatorId = creatorId,
                Type = dto.Type,
                Amount = dto.Amount,
                Description = dto.Description,
                ReceiptUrl = dto.ReceiptUrl,
                Status = TransactionStatus.Cho_Duyet, // Mặc định luôn là Chờ duyệt
                TransactionDate = DateTime.UtcNow
            };

            await _transactionRepo.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();

            return transaction;
        }

        // 2. Lấy sổ quỹ của nhà (Lịch sử giao dịch)
        public async Task<IEnumerable<FinancialTransaction>> GetTransactionsByHouseAsync(int houseId)
        {
            var allTransactions = await _transactionRepo.GetAllAsync();
            return allTransactions.Where(t => t.HouseId == houseId).OrderByDescending(t => t.TransactionDate);
        }

        // 3. Nghiệp vụ duyệt chi tiêu & Tính toán FundBalance (Nguyên tắc ACID)
        public async Task<bool> ApproveTransactionAsync(int transactionId, int approverId, int houseId)
        {
            var transaction = await _transactionRepo.GetByIdAsync(transactionId);
            
            if (transaction == null || transaction.HouseId != houseId)
                throw new Exception("Không tìm thấy giao dịch này trong nhà của bạn.");

            // Áp dụng Append-Only: Không cho phép tác động vào phiếu đã Hoàn Thành
            if (transaction.Status == TransactionStatus.Hoan_Thanh)
                throw new Exception("Phiếu này đã được duyệt và ghi nhận vào sổ cái, không thể duyệt lại.");

            var house = await _houseRepo.GetByIdAsync(houseId);
            if (house == null) throw new Exception("Không tìm thấy dữ liệu Nhà.");

            // Cập nhật số dư Quỹ nhà
            if (transaction.Type == TransactionType.Thu)
            {
                house.FundBalance += transaction.Amount;
            }
            else if (transaction.Type == TransactionType.Chi)
            {
                if (house.FundBalance < transaction.Amount)
                    throw new Exception("Quỹ nhà không đủ số dư để duyệt phiếu chi này.");
                    
                house.FundBalance -= transaction.Amount;
            }

            // Đổi trạng thái phiếu
            transaction.Status = TransactionStatus.Hoan_Thanh;
            
            // Dùng UnitOfWork lưu đồng thời cả Phiếu và Số dư Nhà. Nếu 1 cái lỗi, cả 2 sẽ Rollback.
            await _transactionRepo.UpdateAsync(transaction);
            await _houseRepo.UpdateAsync(house);
            await _unitOfWork.SaveChangesAsync(); 

            return true;
        }
    }
}