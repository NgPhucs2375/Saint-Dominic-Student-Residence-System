using Daminh.Application.DTOs;
using Daminh.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Daminh.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Yêu cầu phải đăng nhập cho toàn bộ Controller
    public class LeaveController : ControllerBase
    {
        private readonly ILeaveRequestService _leaveService;
        private readonly ICurrentUserService _currentUserService;

        public LeaveController(ILeaveRequestService leaveService, ICurrentUserService currentUserService)
        {
            _leaveService = leaveService;
            _currentUserService = currentUserService;
        }

        // 1. Dành cho Sinh viên: Tạo đơn xin phép
        [HttpPost]
        public async Task<IActionResult> CreateLeave([FromBody] CreateLeaveRequestDto dto)
        {
            var userIdStr = _currentUserService.UserId;
            var houseId = _currentUserService.HouseId;

            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId) || !houseId.HasValue)
            {
                return Unauthorized(ApiResponse<string>.Fail("Không xác định được thông tin người dùng hoặc nhà."));
            }

            var result = await _leaveService.CreateLeaveAsync(dto, userId, houseId.Value);
            return Ok(ApiResponse<object>.Ok(result, "Tạo đơn xin phép thành công, vui lòng chờ duyệt."));
        }

        // 2. Dành cho Sinh viên: Xem lịch sử xin phép của mình
        [HttpGet("my-leaves")]
        public async Task<IActionResult> GetMyLeaves()
        {
            var userIdStr = _currentUserService.UserId;
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized(ApiResponse<string>.Fail("Không xác định được người dùng."));
            }

            var leaves = await _leaveService.GetMyLeavesAsync(userId);
            return Ok(ApiResponse<object>.Ok(leaves, "Lấy danh sách đơn xin phép thành công."));
        }

        // 3. Dành cho Ban quản lý (TN, PN, QL): Xem danh sách chờ duyệt trong nhà
        [HttpGet("pending")]
        [Authorize(Policy = "RequireHouseManager")] // Chỉ BQL mới được gọi API này
        public async Task<IActionResult> GetPendingLeaves()
        {
            var houseId = _currentUserService.HouseId;
            if (!houseId.HasValue)
            {
                return BadRequest(ApiResponse<string>.Fail("Tài khoản của bạn chưa được phân bổ vào Nhà nào."));
            }

            var pendingLeaves = await _leaveService.GetPendingLeavesForHouseAsync(houseId.Value);
            return Ok(ApiResponse<object>.Ok(pendingLeaves, "Lấy danh sách đơn chờ duyệt thành công."));
        }

        // 4. Dành cho Ban quản lý: Xử lý đơn (Duyệt/Từ chối)
        [HttpPut("{id}/process")]
        [Authorize(Policy = "RequireHouseManager")] // Chỉ BQL mới được duyệt
        public async Task<IActionResult> ProcessLeave(int id, [FromQuery] bool isApproved)
        {
            var approverIdStr = _currentUserService.UserId;
            if (string.IsNullOrEmpty(approverIdStr) || !int.TryParse(approverIdStr, out int approverId))
            {
                return Unauthorized(ApiResponse<string>.Fail("Lỗi xác thực người duyệt."));
            }

            var success = await _leaveService.ProcessLeaveRequestAsync(id, approverId, isApproved);
            
            if (!success)
            {
                return BadRequest(ApiResponse<string>.Fail("Không thể xử lý đơn. Đơn không tồn tại hoặc đã được duyệt trước đó."));
            }

            string statusText = isApproved ? "Phê duyệt" : "Từ chối";
            return Ok(ApiResponse<string>.Ok(null, $"Đã {statusText} đơn xin phép thành công."));
        }
    }
}