using Daminh.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Daminh.Infrastructure.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        // Lấy UserId từ Claims (ở AuthController dùng ClaimTypes.NameIdentifier để lưu UserId vào Token)
        public string? UserId => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

        // Lấy HouseId từ Claims (ở AuthController dùng ClaimTypes.UserData để lưu HouseId vào Token)
        public int? HouseId
        {
            get
            {
                var houseIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("HouseId")?.Value;
                return int.TryParse(houseIdClaim, out var id) ? id : null;
            }
        }

        // Lấy Role từ Claims (ở AuthController dùng ClaimTypes.Role để lưu Role vào Token)
        public string? Role => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);
    }
}