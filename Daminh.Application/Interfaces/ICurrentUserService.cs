namespace Daminh.Application.Interfaces
{
    public interface ICurrentUserService
    {
        string? UserId { get; } // Lấy UserId từ claim "sub" trong JWT Token
        int? HouseId { get; } // Lấy HouseId từ claim "houseId" trong JWT Token (nếu có)
        string? Role { get; } // Lấy Role từ claim "role" trong JWT Token
    }
}