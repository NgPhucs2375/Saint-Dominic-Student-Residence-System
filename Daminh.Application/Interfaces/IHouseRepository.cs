using Daminh.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Daminh.Application.Interfaces
{
    public interface IHouseRepository
    {
        Task<IEnumerable<House>> GetAllHousesAsync();
        Task<string> CreateHouseAsync(string houseName);
        Task<bool> UpdateHouseNameAsync(int id, string newName);
        Task<bool> DeleteHouseAsync(int id);
    }
}