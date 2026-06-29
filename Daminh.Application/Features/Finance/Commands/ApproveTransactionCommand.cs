using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Daminh.Domain.Entities;
using Daminh.Domain.Enums;
using Daminh.Application.Interfaces;

namespace Daminh.Application.Features.Finance.Commands
{
    public class ApproveTransactionCommand : IRequest<bool>
    {
        public int TransactionId { get; set; }
        public int ApproverId { get; set; }
    }

    public class ApproveTransactionCommandHandler : IRequestHandler<ApproveTransactionCommand, bool>
    {
        private readonly IGenericRepository<FinancialTransaction> _transactionRepo;
        private readonly IHouseRepository _houseRepo; // Dùng HouseRepository bạn đã khai báo
        private readonly IUnitOfWork _unitOfWork;

        public ApproveTransactionCommandHandler(
            IGenericRepository<FinancialTransaction> transactionRepo,
            IHouseRepository houseRepo,
            IUnitOfWork unitOfWork)
        {
            _transactionRepo = transactionRepo;
            _houseRepo = houseRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(ApproveTransactionCommand request, CancellationToken cancellationToken)
        {
            // 1. Lấy phiếu giao dịch ra
            var transaction = await _transactionRepo.GetByIdAsync(request.TransactionId);
            if (transaction == null) 
                throw new Exception("Không tìm thấy giao dịch hợp lệ.");

            // Bảo vệ tính Bất biến (Append-Only)
            if (transaction.Status == TransactionStatus.Hoan_Thanh)
                throw new InvalidOperationException("Giao dịch này đã được duyệt. Không thể thay đổi sổ cái!");

            // 2. Lấy thông tin Quỹ của Nhà
            // (Lưu ý: Bạn có thể cần thêm hàm GetByIdAsync vào IHouseRepository nếu chưa có)
            var houses = await _houseRepo.GetAllHousesAsync();
            var house = houses.FirstOrDefault(h => h.Id == transaction.HouseId);
            
            if (house == null) 
                throw new Exception("Không tìm thấy thông tin Nhà lưu xá.");

            // 3. THỰC THI NGHIỆP VỤ KẾ TOÁN
            if (transaction.Type == TransactionType.Chi)
            {
                if (house.FundBalance < transaction.Amount)
                    throw new InvalidOperationException($"Quỹ nhà không đủ! Quỹ hiện tại: {house.FundBalance}, Cần chi: {transaction.Amount}");
                
                house.FundBalance -= transaction.Amount;
            }
            else if (transaction.Type == TransactionType.Thu)
            {
                house.FundBalance += transaction.Amount;
            }

            // 4. Cập nhật trạng thái
            transaction.Status = TransactionStatus.Hoan_Thanh;
            transaction.UpdatedAt = DateTime.UtcNow;
            transaction.UpdatedBy = request.ApproverId.ToString();

            // 5. LƯU GIAO DỊCH (Transaction All-or-Nothing)
            _transactionRepo.Update(transaction);
            // _houseRepo.Update(house); -> Cần đảm bảo có hàm Update trong Repository của bạn
            
            await _unitOfWork.SaveChangesAsync(cancellationToken); // Hoàn tất giao dịch kế toán một cách an toàn tuyệt đối!

            return true;
        }
    }
}