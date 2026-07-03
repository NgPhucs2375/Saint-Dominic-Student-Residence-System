using Daminh.Application.DTOs;
using System.Threading.Tasks;

namespace Daminh.Application.Interfaces
{
    public interface IAuthService
    {
        // Trả về Tuple gồm Token và thông tin User
        Task<(string Token, object User)> LoginAsync(LoginRequest request);
        
        // Trả về thông báo thành công
        Task<string> RegisterAsync(RegisterRequest request);
    }
}