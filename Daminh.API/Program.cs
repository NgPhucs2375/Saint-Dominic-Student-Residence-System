using Daminh.Application.Interfaces;
using Daminh.Infrastructure.Persistence;
using Daminh.Infrastructure.Repositories;
using Daminh.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Daminh.Application.Services;

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
builder.Services.AddScoped<ILeaveRequestService, LeaveRequestService>();
builder.Services.AddScoped<IFinancialService, FinancialService>();

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
// 3.1 CẤU HÌNH PHÂN QUYỀN (Authorization Policies)
// ==========================================
builder.Services.AddAuthorization(options =>
{
    // Policy 1 : Only Father OB (Super Admin) mới có quyền truy cập vào các endpoint này
    options.AddPolicy("RequireSuperAdmin", policy => policy.RequireRole("OB")); // Fit với Role "OB" trong JWT Claims

    // Policy 2 : Spend for Ban Quan Ly (Truong nha, Pho nha, Quan ly) de thong bao , diem danh ,... mới có quyền truy cập vào các endpoint này
    options.AddPolicy("RequireHouseManager", policy => policy.RequireRole("TN","PN","QL")); // Fit với Role "TN", "PN", "QL" trong JWT Claims  

    // Policy 3 : Luat tai chinh Only (Ql, TN)
    options.AddPolicy("RequireFinancial", policy => policy.RequireRole("QL","TN")); // Fit với Role "QL", "TN" trong
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

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173") // Cho phép cổng của React
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
});

// ==========================================
var app = builder.Build(); // Ranh gioi frezze cua .Net 6.0, sau khi build xong thì không thể thêm service nữa
// ==========================================



// ==========================================
// 5. CẤU HÌNH PIPELINE (Luồng chạy của ứng dụng)
// ==========================================
app.UseMiddleware<Daminh.API.Middlewares.GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
// Thứ tự 2 dòng này CỰC KỲ QUAN TRỌNG: Xác thực (Ai vậy?) -> Phân quyền (Được làm gì?)
app.UseAuthentication(); 
app.UseAuthorization();

// Ánh xạ các Controllers
app.MapControllers();

app.Run();