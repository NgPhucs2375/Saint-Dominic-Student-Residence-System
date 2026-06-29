using Daminh.Application.Interfaces;
using Daminh.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Daminh.Application.Services
{
    public class HouseService : IHouseRepository
    {
        private readonly IGenericRepository<House> _houseRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;

        public HouseService(
            IGenericRepository<House> houseRepository,
            IUnitOfWork unitOfWork,
            ICurrentUserService currentUserService)
        {
            _houseRepository = houseRepository;
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
        }

        public async Task<IEnumerable<House>> GetAllHousesAsync()
        {
            return await _houseRepository.GetAllAsync();
        }

        public async Task<string> CreateHouseAsync(string houseName)
        {
            var newHouse = new House
            {
                Name = houseName,
                FundBalance = 0,
                State = "Hoạt động",
                NumberOfMembers = 0
                // Không cần gán CreateAt và CreatedBy vì DbContext đã tự động Audit
            };

            await _houseRepository.AddAsync(newHouse);
            await _unitOfWork.SaveChangesAsync();

            return houseName;
        }

        public async Task<bool> UpdateHouseNameAsync(int id, string newName)
        {
            var house = await _houseRepository.GetByIdAsync(id);
            if (house == null) return false;

            house.Name = newName;
            // Không cần gán UpdatedAt và UpdatedBy thủ công nữa vì DbContext đã tự lo

            await _houseRepository.UpdateAsync(house);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteHouseAsync(int id)
        {
            var house = await _houseRepository.GetByIdAsync(id);
            if (house == null) return false;

            // Hàm SaveChangesAsync ở DbContext sẽ tự động bắt trạng thái Delete 
            // và chuyển nó thành Soft Delete (IsDeleted = true)
            await _houseRepository.DeleteAsync(house);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}