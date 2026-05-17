using Daminh.Domain.Enums;
using System; // thu vien cho DateTime

namespace Daminh.Domain.Entities
{
    public class DutyRoster : BaseEntity
    {
        public int Id {get;set;}
        public int HouseId {get;set;}
        public int AssigneeId {get;set;} // Nguoi truc

        public string TaskType {get;set;} = string.Empty; // Loai cong viec, vd: "Don dep", "Nau an", "Mua sam",...
        public DateTime DutyDate {get;set;} // Ngay thuc hien cong viec
        public DutyStatus Status {get;set;}= DutyStatus.Chua_Lam; // trang thai cong viec, su dung enum DutyStatus de gioi han gia tri nhap vao, default la Pending
        
        public virtual House House {get;set;} = null!; // mot duty roster thuoc mot house
        public virtual User Assignee {get;set;} = null!; // mot duty roster duoc giao cho mot user (Assignee)
    }
}