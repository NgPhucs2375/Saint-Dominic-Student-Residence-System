using System; // thu vien cho DateTime

namespace Daminh.Domain.Entities
{
    public class Delegation : BaseEntity
    {
        public int Id {get;set;}
        public int HouseId {get;set;} 
        public int DelegatorId {get;set;} // Id cua nguoi giao nhiem vy (Truong nha)
        public int DelegateeId {get;set;} // Id cua nguoi duoc giao nhiem vy (Pho nha)

        public DateTime StartTime {get;set;} // thoi gian bat dau giao nhiem vy
        public DateTime EndTime {get;set;} // thoi gian ket thuc giao
        public bool IsActive {get;set;} = true; // default true, neu false thi delegation khong con hieu luc

        //Navigation property
        public virtual House House {get;set;} = null!;// mot delegation thuoc mot house
        public virtual User Delegator {get;set;} = null!; // mot delegation co mot delegator
        public virtual User Delegatee {get;set;} = null!; // mot delegation co mot delegatee
    }
}

