using Daminh.Application.DTOs; // Để sử dụng lớp LoginRequest
using Daminh.Domain.Entities; // Để sử dụng lớp User
using Daminh.Domain.Enums; // Để sử dụng enum UserRole (nếu cần phân biệt giữa Admin và User)
using Daminh.Infrastructure.Persistence; // Để sử dụng DaminhDbContext
using Microsoft.AspNetCore.Mvc; // Để sử dụng các thuộc tính và lớp liên quan đến API Controller
using Microsoft.IdentityModel.Tokens; // Để sử dụng các lớp liên quan đến JWT như SymmetricSecurityKey, SigningCredentials, JwtSecurityToken, JwtSecurityTokenHandler
using System.IdentityModel.Tokens; // Để sử dụng các lớp liên quan đến JWT như JwtSecurityToken, JwtSecurityTokenHandler
using System.IdentityModel.Tokens.Jwt;  // Để sử dụng các lớp liên quan đến JWT như JwtSecurityToken, JwtSecurityTokenHandler
using System.Security.Claims; // Để sử dụng lớp Claim và ClaimTypes khi tạo claims cho JWT Token
using System.Text; // Để sử dụng Encoding.UTF8.GetBytes khi tạo secret key cho JWT Token

namespace Daminh.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DaminhDbContext _context;
        private readonly IConfiguration _configuration;

        // Constructor: Nhận DaminhDbContext để truy cập dữ liệu người dùng và IConfiguration để đọc cấu hình (như Secret Key cho JWT)
        public AuthController(DaminhDbContext context,IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Create API tao du lieu moi (TaiKhoan Cha OB)
        [HttpPost("seed_admin")]
        public async Task<IActionResult> SeedAdmin()
        {
            if(_context.Users.Any(u=>u.Email == "ChaOB@daminh.com"))
            {
                return BadRequest("Tài Khoản Cha OB đã tồn tại.");
            }
            var admin = new User
            {
                FullName = "Cha OB",
                Email = "ChaOB@daminh.com",
                PasswordHash = "DTOB@123",
                Role = RoleEnum.OB,
                IsActive = true 
            };

            _context.Users.Add(admin);
            await _context.SaveChangesAsync();

            return Ok("Tài Khoản Cha OB đã được tạo thành công.");
        }

        // API Login & Create Token
        [HttpPost("login")]
        public IActionResult login([FromBody] LoginRequest request)
        {
            // Check Usser in database
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email && u.PasswordHash == request.Password );

            if (user == null)
            {
                return Unauthorized("Sai Email hoặc Mật Khẩu");
            }

            // Create Claims (Gói thông tin) cho JWT Token
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim(ClaimTypes.Name,user.FullName),
                new Claim(ClaimTypes.Email,user.Email),
                new Claim(ClaimTypes.Role,user.Role.ToString()),
            };

            // Neu nguoi nay thuoc 1 nha cu the(Khong phai Cha OB), thi nhet them HouseId vao claims
            if (user.HouseId.HasValue)
            {
                claims.Add(new Claim("HouseId", user.HouseId.Value.ToString()));
            }

            // Get sercret key from appsettings.json
            var secretKey = _configuration["JwtSettings:SecretKey"] ?? "DaminhSuperSecretKey_PhaPhaiDaiChutNhe123!";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Tạo Token có hạn 1 ngày
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new { 
                Token = jwt, 
                Message = "Đăng nhập thành công!",
                User = new { user.FullName, user.Role }
            });
            }
        }

    }


