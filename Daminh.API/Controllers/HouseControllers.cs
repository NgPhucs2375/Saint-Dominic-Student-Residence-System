using Daminh.Application.Interfaces;
using Daminh.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Daminh.Domain.Enums;

namespace Daminh.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // CHÚT NỮA SẼ BẬT DÒNG NÀY LÊN SAU: [Authorize(Roles = "OB")] 
    public class HousesController : ControllerBase
    {
        private readonly IGenericRepository<House> _houseRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService; // Lấy thông tin người đang đăng nhập

        public HousesController(
            IGenericRepository<House> houseRepository,
            IUnitOfWork unitOfWork,
            ICurrentUserService currentUserService)
        {
            _houseRepository = houseRepository;
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
        }

        // API Lấy danh sách Nhà (Phải có Token mới xem được)
        [HttpGet]
        [Authorize] // Ai đăng nhập rồi (có Token) đều xem được
        public async Task<IActionResult> GetAllHouses()
        {
            var houses = await _houseRepository.GetAllAsync();

            // In ra xem ai đang gọi API này
            var currentUser = $"Người gọi API là: {_currentUserService.Role} có ID: {_currentUserService.UserId}";

            return Ok(new { CurrentUser = currentUser, Data = houses });
        }

        // API Tạo Nhà mới (CHỈ CHA OB MỚI ĐƯỢC TẠO)
        [HttpPost]
        [Authorize(Roles = "OB")] // Rất quyền lực: Phải có Token VÀ Role trong Token phải là "OB"
        public async Task<IActionResult> CreateHouse([FromBody] string houseName)
        {
            var newHouse = new House
            {
                Name = houseName,
                FundBalance = 0,
                State = "Hoạt động",
                NumberOfMembers = 0
            };

            await _houseRepository.AddAsync(newHouse);
            await _unitOfWork.SaveChangesAsync();

            return Ok($"Tạo nhà {houseName} thành công!");
        }

        // API Cập nhật tên Nhà
        [HttpPut("{id}")]
        [Authorize(Roles = "OB")] // Chỉ Cha OB mới được đổi tên Nhà
        public async Task<IActionResult> UpdateHouse(int id, [FromBody] string newName)
        {
            var house = await _houseRepository.GetByIdAsync(id);
            if (house == null) return NotFound("Không tìm thấy Nhà này!");

            house.Name = newName;
            house.UpdatedAt = DateTime.UtcNow;
            house.UpdateBy = _currentUserService.UserId;

            await _houseRepository.UpdateAsync(house);
            await _unitOfWork.SaveChangesAsync();

            return Ok($"Đã đổi tên Nhà thành {newName} thành công!");
        }

        // API Xóa Nhà (Xóa mềm)
        [HttpDelete("{id}")]
        [Authorize(Roles = "OB")]
        public async Task<IActionResult> DeleteHouse(int id)
        {
            var house = await _houseRepository.GetByIdAsync(id);
            if (house == null) return NotFound("Không tìm thấy Nhà để xóa!");

            // Vì chúng ta dùng Global Filter IsDeleted, nên chỉ cần set IsDeleted = true
            house.IsDeleted = true;
            house.UpdatedAt = DateTime.UtcNow;
            house.UpdateBy = _currentUserService.UserId;

            await _houseRepository.UpdateAsync(house);
            await _unitOfWork.SaveChangesAsync();

            return Ok("Đã xóa Nhà thành công!");
        }
    }
}