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

        public string? UserId => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

        public int? HouseId
        {
            get
            {
                var houseIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("HouseId")?.Value;
                return int.TryParse(houseIdClaim, out var id) ? id : null;
            }
        }

        public string? Role => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);
    }
}