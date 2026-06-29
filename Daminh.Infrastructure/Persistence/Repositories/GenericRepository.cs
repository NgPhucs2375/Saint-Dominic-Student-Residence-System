using Daminh.Application.Interfaces;
using Daminh.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Daminh.Infrastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        // Lớp này sẽ cung cấp các phương thức chung để thao tác với bất kỳ Entity nào (User, House, Event...). Các Repository cụ thể (UserRepository, HouseRepository...) sẽ kế thừa từ lớp này và có thể thêm các phương thức riêng nếu cần. Điều này giúp giảm thiểu mã lặp và tăng tính tái sử dụng trong ứng dụng.
        protected readonly DaminhDbContext _context;
        protected readonly DbSet<T> _dbSet;

        // Constructor
        public GenericRepository(DaminhDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
        }
        public Task UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            // EF Core không có UpdateAsync thực sự (vì Update chỉ là đánh dấu trạng thái)
            // nên ta dùng Task.CompletedTask để đồng bộ với Interface.
            return Task.CompletedTask; 
        }

        public Task DeleteAsync(T entity)
        {
            _dbSet.Remove(entity);
            return Task.CompletedTask;
        }
    }
}