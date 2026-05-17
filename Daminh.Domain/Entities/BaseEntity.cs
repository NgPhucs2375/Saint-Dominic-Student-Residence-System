namespace Daminh.Domain.Entities
{
    // Class cha de luu vet Audit, cac class khac se ke thua tu class nay
    public abstract class BaseEntity
    {
        public DateTime CreateAt {get;set;} = DateTime.UtcNow;
        public string? CreatedBy {get;set;}
        public DateTime? UpdatedAt {get;set;}
        public string? UpdateBy {get;set;}
        public bool IsDeleted {get;set;} = false; // Phu vu Soft Delete
    }
}