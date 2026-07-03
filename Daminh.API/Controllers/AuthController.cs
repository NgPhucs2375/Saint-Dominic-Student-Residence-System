using Daminh.Application.DTOs;
using Daminh.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Daminh.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        // Controller hoàn toàn sạch bóng Database!
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var (token, user) = await _authService.LoginAsync(request);

            return Ok(new { 
                Success = true,
                Token = token, 
                Message = "Đăng nhập thành công!",
                User = user
            });
        }

        [HttpPost("register")]
        [Authorize(Roles = "OB")] // Chỉ Cha OB mới có quyền tạo tài khoản
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var message = await _authService.RegisterAsync(request);
            
            // ApiResponse sẽ trả về cấu trúc chuẩn hóa cho Next.js
            return Ok(ApiResponse<string>.Ok(null!, message));
        }
    }
}