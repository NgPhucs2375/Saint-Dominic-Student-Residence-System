using Daminh.Domain.Enums;

namespace Daminh.Application.DTOs
{
    public class CreateTransactionDto
    {
        public TransactionType Type { get; set; } // Thu, Chi, Du_Toan
        public double Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? ReceiptUrl { get; set; } // Link ảnh hóa đơn (Bắt buộc nếu là Chi)
    }
}