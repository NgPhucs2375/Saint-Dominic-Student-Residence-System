using Daminh.Domain.Enums;
using System.Collections.Generic; // thu vien cho List

namespace Daminh.Domain.Entities
{
    public class User : BaseEntity
    {
        public int Id {get;set;} // map voi Id_U
        public int? HouseId {get;set;} // map voi Id_H, cho phep null de truong hop user == OB
        public string FullName {get;set;} = string.Empty; // name_U
        public string Email {get;set;} = string.Empty; // email_U
        public string PasswordHash {get;set;} = string.Empty; // password_U, se duoc hash truoc khi luu vao database
        public RoleEnum Role {get;set;} // role_U, su dung enum RoleEnum de gioi han gia tri nhap vao
        public int ConductPoints {get;set;} = 100; // default 100
        public bool IsActive {get;set;} = true; // default true, neu false thi user khong the dang nhap

        //Navigation property
        public virtual House? House{get;set;} // mot user co the thuoc mot house, nhung OB co the khong thuoc house nao ca (HouseId = null)
        public virtual ICollection<LeaveRequest> LeaveReaquests {get;set;} = new List<LeaveRequest>();
        public virtual ICollection<DutyRoster> DutyRosters {get;set;} = new List<DutyRoster>();
    }    
}