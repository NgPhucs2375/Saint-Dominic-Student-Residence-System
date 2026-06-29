using Daminh.Application.Interfaces;
using Daminh.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Daminh.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Daminh.Infrastructure.Persistence;
namespace Daminh.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HousesController : ControllerBase
    {
        
        
        private readonly DaminhDbContext _context;        
        private readonly IGenericRepository<House> _houseRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService; // Lấy thông tin người đang đăng nhập

        public HousesController(
            DaminhDbContext context,
            IGenericRepository<House> houseRepository,
            IUnitOfWork unitOfWork,
            ICurrentUserService currentUserService)
        {
            _context = context;
            _houseRepository = houseRepository;
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
        }

        // ==================================== //
        // 1. API QUẢN LÝ NHÀ (House Management APIs)
        // ==================================== //

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

        // API Tạo Nhà mới 
        [HttpPost]
        [Authorize(Policy = "RequireSuperAdmin")] // Rất quyền lực:  Only Father OB mới được tạo Nhà mới
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
            house.UpdatedBy = _currentUserService.UserId;

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
            house.UpdatedBy = _currentUserService.UserId;

            await _houseRepository.UpdateAsync(house);
            await _unitOfWork.SaveChangesAsync();

            return Ok("Đã xóa Nhà thành công!");
        }

        // ==================================== //
        // 2. API QUẢN LÝ TAI CHÍNH NHÀ (House Financial Management APIs)
        // ==================================== //

        // API Duyet chi tiêu (Chỉ Trưởng nhà và QL mới được duyệt chi tiêu)
        [HttpPut("approve-transaction")]
        [Authorize(Policy = "RequireFinancial")] // Chỉ Trưởng nhà (TN) và Quản lý (QL) mới được duyệt chi tiêu
        public async Task<IActionResult> ApproveTransaction([FromBody] ApproveTransactionRequestDTO request)
        {
            // 1. Lấy thông tin nhà của người đang duyệt từ Token
            var userHouseId = _currentUserService.HouseId;

            // 2. Lấy giao dịch từ DB bằng biến _context 
            var transaction = await _context.FinancialTransactions.FindAsync(request.TransactionId);

            // 3. Kiểm tra các điều kiện bắt buộc
            if (transaction == null)
            {
                return NotFound("Không tìm thấy phiếu thu/chi này!");
            }

            if (transaction.HouseId != userHouseId)
            {
                return Forbid("Bạn không có quyền duyệt phiếu thu/chi của nhà khác!");
            }

            if (transaction.Status == TransactionStatus.Hoan_Thanh)
            {
                return BadRequest("Giao dịch này đã được duyệt từ trước rồi!");
            }

            // 4. Thực hiện duyệt giao dịch
            transaction.Status = TransactionStatus.Hoan_Thanh;
            transaction.UpdatedBy = _currentUserService.UserId;
            transaction.UpdatedAt = DateTime.UtcNow;

            // [Nâng cao] Nếu muốn, bạn có thể gọi _houseRepository để cộng/trừ FundBalance của House tại đây

            // 5. Lưu xuống Database
            await _context.SaveChangesAsync();

            return Ok($"Đã duyệt chi tiêu mã số {request.TransactionId} thành công!");
        }
    }
}