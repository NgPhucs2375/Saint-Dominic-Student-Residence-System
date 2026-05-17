using System.Collections.Generic;
using System.Threading.Tasks;

namespace Daminh.Application.Interfaces
{
    // Chữ T đại diện cho bất kỳ Entity nào (User, House, Event...)
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);     // Cập nhật món đồ
        Task DeleteAsync(T entity);     // Xóa món đồ
        void Update(T entity);
        void Delete(T entity); // Xóa mềm hay cứng sẽ do DbContext lo
    }
}