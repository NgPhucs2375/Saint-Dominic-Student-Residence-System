using Daminh.Application.Interfaces;
using Daminh.Infrastructure.Persistence;
using Daminh.Infrastructure.Repositories;
using Daminh.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models; 

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. CẤU HÌNH DATABASE (PostgreSQL)
// ==========================================
builder.Services.AddDbContext<DaminhDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("Daminh.Infrastructure")
    ));

// ==========================================
// 2. ĐĂNG KÝ DEPENDENCY INJECTION (DI)
// ==========================================
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// ==========================================
// 3. CẤU HÌNH BẢO MẬT JWT (Authentication)
// ==========================================
// Đọc Secret Key từ appsettings.json (sẽ cấu hình ở bước sau)
var secretKey = builder.Configuration["JwtSettings:SecretKey"] ?? "DaminhSuperSecretKey_PhaPhaiDaiChutNhe123!";
var keyBytes = Encoding.UTF8.GetBytes(secretKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
            ValidateIssuer = false, // Tạm tắt cho môi trường dev
            ValidateAudience = false, // Tạm tắt cho môi trường dev
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// ==========================================
// 4. CẤU HÌNH CONTROLLERS & SWAGGER (Tài liệu API)
// ==========================================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Thêm nút Authorize (Ổ khóa) vào Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQ2hhIE9CIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiQ2hhT0JAZGFtaW5oLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6Ik9CIiwiZXhwIjoxNzc4ODQ0MDYwfQ.mfqt_og1_QGw392PC_pmOkx0URbhIPT_7zRuwDCoFIk"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] {}
        }
    });
});
var app = builder.Build();

// ==========================================
// 5. CẤU HÌNH PIPELINE (Luồng chạy của ứng dụng)
// ==========================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Thứ tự 2 dòng này CỰC KỲ QUAN TRỌNG: Xác thực (Ai vậy?) -> Phân quyền (Được làm gì?)
app.UseAuthentication(); 
app.UseAuthorization();

// Ánh xạ các Controllers
app.MapControllers();

app.Run();