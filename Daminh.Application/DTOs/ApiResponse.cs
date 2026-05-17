namespace Daminh.Application.DTOs
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }

        // Layout cho API Thành công
        public static ApiResponse<T> Ok(T data, string message = "Thành công")
        {
            return new ApiResponse<T> { Success = true, Message = message, Data = data };
        }

        // Layout cho API Thất bại
        public static ApiResponse<T> Fail(string message, List<string>? errors = null)
        {
            return new ApiResponse<T> { Success = false, Message = message, Errors = errors };
        }
    }
}