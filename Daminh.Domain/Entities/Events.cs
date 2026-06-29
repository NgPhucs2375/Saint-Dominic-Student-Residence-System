using Daminh.Domain.Enums;
using System; // thu vien cho DateTime
using System.Collections.Generic; // thu vien cho List

namespace Daminh.Domain.Entities
{
    public class Event : BaseEntity
    {
        public int Id { get; set; }
        public int HouseId { get; set; }
        public int CreatorId { get; set; } // Id cua nguoi tao su kien
        public string Title { get; set; } = string.Empty; // tieu de su kien
        public string Description { get; set; } = string.Empty;  // mo ta su kien
        public EventType Type { get; set; } // loai su kien, su dung enum EventType de gioi han gia tri nhap vao
        public DateTime StartTime { get; set; } // thoi gian bat dau su kien
        public DateTime EndTime { get; set; } // thoi gian ket thuc
        public bool IsMandatory { get; set; } // default false, neu true thi su kien la bat buoc, nguoi dung phai tham gia
        public virtual User Creator { get; set; } = null!; // mot su kien
        public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>(); // mot su kien co nhieu attendance, moi attendance tuong ung voi mot user tham gia su kien

    }
}