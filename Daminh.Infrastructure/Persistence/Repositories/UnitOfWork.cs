using Daminh.Application.Interfaces;
using Daminh.Infrastructure.Persistence;
using System.Threading.Tasks;

namespace Daminh.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DaminhDbContext _context;

        public UnitOfWork(DaminhDbContext context)
        {
            _context = context;
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}