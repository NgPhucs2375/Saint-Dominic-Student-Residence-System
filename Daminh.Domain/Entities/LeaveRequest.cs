using Daminh.Domain.Enums;
using System;

namespace Daminh.Domain.Entities
{
    public class LeaveRequest : BaseEntity
    {
        public int Id { get; set; }
        public int HouseId { get; set; }
        public int RequesterId { get; set; }
        public int? ApproverId { get; set; } // Có thể null khi Pending
        
        public string Reason { get; set; } = string.Empty;
        public string? EvidenceUrl { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public LeaveStatus Status { get; set; } = LeaveStatus.Pending;

        public virtual House House { get; set; } = null!;
        public virtual User Requester { get; set; } = null!;
        public virtual User? Approver { get; set; }
    }
}