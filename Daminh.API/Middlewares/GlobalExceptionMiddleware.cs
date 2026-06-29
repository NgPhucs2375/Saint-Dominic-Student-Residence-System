using Daminh.Application.DTOs;
using System.Net;
using System.Text.Json;

namespace Daminh.API.Middlewares
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Cho phép Request đi tiếp vào các Controller
                await _next(context); 
            }
            catch (Exception ex)
            {
                // Nếu có lỗi ở bất kỳ đâu, nó sẽ bị bắt tại đây
                _logger.LogError(ex, "Lỗi hệ thống: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            // Ép kiểu Content-Type trả về là JSON
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError; // Mã lỗi 500

            // Sử dụng chính layout ApiResponse.Fail mà bạn đã định nghĩa
            var errors = new List<string> { exception.Message }; 
            // Lưu ý: Khi deploy thật (Production), bạn nên ẩn exception.Message đi để bảo mật, chỉ hiện khi đang Dev
            
            var response = ApiResponse<object>.Fail("Hệ thống đang gặp sự cố, vui lòng thử lại sau!", errors);

            // Chuyển Object thành chuỗi JSON chuẩn CamelCase (chữ thường đầu tiên)
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            var json = JsonSerializer.Serialize(response, options);

            return context.Response.WriteAsync(json);
        }
    }
}