using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Daminh.Domain.Entities;
using Daminh.Domain.Enums;
using Daminh.Application.Interfaces;

namespace Daminh.Application.Features.Finance.Commands
{
    // 1. DATA TRANSFER OBJECT (DTO) - Đầu vào
    public class CreateTransactionCommand : IRequest<int>
    {
        public int HouseId { get; set; }
        public int CreatorId { get; set; }
        public TransactionType Type { get; set; } // Thu hoặc Chi
        public double Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? ReceiptUrl { get; set; }
    }

    // 2. HANDLER - Xử lý logic
    public class CreateTransactionCommandHandler : IRequestHandler<CreateTransactionCommand, int>
    {
        private readonly IGenericRepository<FinancialTransaction> _transactionRepo;
        private readonly IUnitOfWork _unitOfWork;

        // Bơm Generic Repository của bạn vào
        public CreateTransactionCommandHandler(
            IGenericRepository<FinancialTransaction> transactionRepo, 
            IUnitOfWork unitOfWork)
        {
            _transactionRepo = transactionRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<int> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
        {
            // Kiểm tra tính hợp lệ cơ bản
            if (request.Amount <= 0) 
                throw new ArgumentException("Số tiền giao dịch phải lớn hơn 0.");

            var transaction = new FinancialTransaction
            {
                HouseId = request.HouseId,
                CreatorId = request.CreatorId,
                Type = request.Type,
                Amount = request.Amount,
                Description = request.Description,
                ReceiptUrl = request.ReceiptUrl,
                TransactionDate = DateTime.UtcNow,
                Status = TransactionStatus.Cho_Duyet // Luôn chờ Trưởng nhà duyệt
            };

            await _transactionRepo.AddAsync(transaction);
            
            // Dùng hàm SaveChangesAsync() không có CancellationToken khớp y hệt interface của bạn
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return transaction.Id;
        }
    }
}