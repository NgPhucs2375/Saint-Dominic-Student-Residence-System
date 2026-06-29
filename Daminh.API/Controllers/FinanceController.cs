using Daminh.Application.DTOs;
using Daminh.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Daminh.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FinanceController : ControllerBase
    {
        private readonly IFinancialService _financialService;
        private readonly ICurrentUserService _currentUserService;

        public FinanceController(IFinancialService financialService, ICurrentUserService currentUserService)
        {
            _financialService = financialService;
            _currentUserService = currentUserService;
        }

        // 1. Tạo phiếu thu/chi (Chỉ Ban Quản Lý mới được tạo)
        [HttpPost]
        [Authorize(Policy = "RequireFinancial")] // Policy này bạn đã setup chỉ dành cho QL, TN
        public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionDto dto)
        {
            var houseId = _currentUserService.HouseId;
            var userIdStr = _currentUserService.UserId;

            if (!houseId.HasValue || string.IsNullOrEmpty(userIdStr))
                return Unauthorized(ApiResponse<string>.Fail("Không xác thực được thông tin tài khoản."));

            var result = await _financialService.CreateTransactionAsync(dto, houseId.Value, int.Parse(userIdStr));
            return Ok(ApiResponse<object>.Ok(result, "Đã lập phiếu thành công. Chờ duyệt để cập nhật số dư."));
        }

        // 2. Xem sổ quỹ của nhà (Thành viên cũng được xem để đảm bảo minh bạch)
        [HttpGet("ledger")]
        public async Task<IActionResult> GetHouseLedger()
        {
            var houseId = _currentUserService.HouseId;
            if (!houseId.HasValue)
                return BadRequest(ApiResponse<string>.Fail("Bạn chưa được phân bổ vào nhà nào."));

            var transactions = await _financialService.GetTransactionsByHouseAsync(houseId.Value);
            return Ok(ApiResponse<object>.Ok(transactions, "Lấy sổ quỹ thành công."));
        }

        // 3. Duyệt phiếu thu/chi (Chỉ Trưởng Nhà mới được duyệt phiếu do Quản lý lập)
        [HttpPut("{id}/approve")]
        [Authorize(Policy = "RequireHouseManager")] // Có thể setup quyền chặt hơn nếu muốn chỉ TN duyệt
        public async Task<IActionResult> ApproveTransaction(int id)
        {
            var houseId = _currentUserService.HouseId;
            var approverIdStr = _currentUserService.UserId;

            if (!houseId.HasValue || string.IsNullOrEmpty(approverIdStr))
                return Unauthorized(ApiResponse<string>.Fail("Lỗi xác thực."));

            await _financialService.ApproveTransactionAsync(id, int.Parse(approverIdStr), houseId.Value);
            
            return Ok(ApiResponse<string>.Ok(null!, "Đã duyệt phiếu và cập nhật số dư quỹ Nhà thành công!"));
        }
    }
}