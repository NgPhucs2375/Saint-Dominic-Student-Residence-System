using Daminh.Domain.Enums;

namespace Daminh.Domain.Entities
{
    public class Attendance : BaseEntity
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public int UserId { get; set; }
        public AttendanceStatus Status { get; set; }  // trang thai tham gia, su dung enum AttendanceStatus de gioi han gia tri nhap vao, default la Chua_Xac_Nhan

        public virtual Event Event { get; set; } = null!; // mot attendance thuoc mot su kien
        public virtual User User { get; set; } = null!; // mot attendance tuong ung voi mot user tham gia su kien
    }
}