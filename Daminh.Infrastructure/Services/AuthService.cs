using BCrypt.Net;
using Daminh.Application.DTOs;
using Daminh.Application.Interfaces;
using Daminh.Domain.Entities;
using Daminh.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Daminh.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly DaminhDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(DaminhDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<(string Token, object User)> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == request.Email);
            
            // Xác thực bằng BCrypt thay vì so sánh chuỗi thô
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new Exception("Sai tên đăng nhập hoặc mật khẩu.");
            }

            if (!user.IsActive)
            {
                throw new Exception("Tài khoản của bạn đã bị khóa.");
            }

            // Tạo Token (Logic giữ nguyên từ code cũ của ngài)
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim("HouseId", user.HouseId?.ToString() ?? "")
            };

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]!));
            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:ValidIssuer"],
                audience: _configuration["JwtSettings:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            var userData = new { user.FullName, Role = user.Role.ToString(), user.HouseId };

            return (jwt, userData);
        }

        public async Task<string> RegisterAsync(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                throw new Exception("Email này đã được sử dụng!");
            }

            var newUser = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                // Thuật toán băm mật khẩu 1 chiều, không thể dịch ngược
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password), 
                Role = request.Role,
                HouseId = request.HouseId,
                IsActive = true,
                ConductPoints = 100
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return $"Tạo tài khoản {request.FullName} ({request.Role}) thành công!";
        }
    }
}