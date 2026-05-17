using System.Threading.Tasks;

namespace Daminh.Application.Interfaces
{
    public interface IUnitOfWork
    {
        // Có thể bổ sung các Repository cụ thể vào đây sau
        Task<int> SaveChangesAsync();
    }
}