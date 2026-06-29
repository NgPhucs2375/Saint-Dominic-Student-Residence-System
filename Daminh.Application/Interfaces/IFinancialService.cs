using Daminh.Application.DTOs;
using Daminh.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Daminh.Application.Interfaces
{
    public interface IFinancialService
    {
        Task<FinancialTransaction> CreateTransactionAsync(CreateTransactionDto dto, int houseId, int creatorId);
        Task<bool> ApproveTransactionAsync(int transactionId, int approverId, int houseId);
        Task<IEnumerable<FinancialTransaction>> GetTransactionsByHouseAsync(int houseId);
    }
}