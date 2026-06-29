using Daminh.Domain.Enums;
using System;

namespace Daminh.Domain.Entities
{
    // Kế thừa BaseEntity của bạn để tự động có Audit (CreateAt, UpdatedAt, IsDeleted)
    public class LeaveRequest : BaseEntity
    {
        // Sử dụng 'private set' để không ai ở tầng ngoài (Controller) có thể gán bậy bạ
        // Ví dụ: Không thể gọi leaveRequest.Status = LeaveStatus.Approved một cách tự do
        public int Id { get; private set; }
        public int HouseId { get; private set; }
        public int RequesterId { get; private set; }
        public int? ApproverId { get; private set; } // Có thể null khi Pending
        
        public string Reason { get; private set; } = string.Empty;
        public string? EvidenceUrl { get; private set; }
        public DateTime StartTime { get; private set; }
        public DateTime EndTime { get; private set; }
        
        // Dùng enum LeaveStatus từ file Enums.cs của bạn
        public LeaveStatus Status { get; private set; } = LeaveStatus.Pending;

        // Navigation Properties (Dành cho Entity Framework)
        public virtual House House { get; private set; } = null!;
        public virtual User Requester { get; private set; } = null!;
        public virtual User? Approver { get; private set; }

        // Constructor mặc định bắt buộc cho EF Core (Không dùng để code tay)
        protected LeaveRequest() { }

        // Constructor nghiệp vụ: Khi tạo đơn mới, bắt buộc phải qua "cửa kiểm duyệt" này
        public LeaveRequest(int houseId, int requesterId, string reason, DateTime startTime, DateTime endTime, string? evidenceUrl = null)
        {
            if (string.IsNullOrWhiteSpace(reason))
                throw new ArgumentException("Lý do xin phép không được để trống.");
            
            if (startTime > endTime)
                throw new ArgumentException("Thời gian bắt đầu không thể lớn hơn thời gian kết thúc.");

            HouseId = houseId;
            RequesterId = requesterId;
            Reason = reason;
            StartTime = startTime;
            EndTime = endTime;
            EvidenceUrl = evidenceUrl;
            Status = LeaveStatus.Pending; // Luôn bắt đầu bằng Pending
            
            // Kế thừa từ BaseEntity, bạn có thể set ngay lúc tạo (nếu không dùng Interceptor của EF)
            CreateAt = DateTime.UtcNow; 
        }

        /* ── CÁC HÀNH VI NGHIỆP VỤ LÕI (DOMAIN BEHAVIORS) ── */
        
        // Hành vi: Phê duyệt đơn
        public void Approve(int approverId)
        {
            if (Status != LeaveStatus.Pending)
                throw new InvalidOperationException("Chỉ có thể duyệt đơn đang ở trạng thái 'Pending'.");

            Status = LeaveStatus.Approved;
            ApproverId = approverId;
            UpdatedAt = DateTime.UtcNow; // Lưu vết người cập nhật nhờ BaseEntity
        }

        // Hành vi: Từ chối đơn
        public void Reject(int approverId)
        {
            if (Status != LeaveStatus.Pending)
                throw new InvalidOperationException("Chỉ có thể từ chối đơn đang ở trạng thái 'Pending'.");

            Status = LeaveStatus.Rejected;
            ApproverId = approverId;
            UpdatedAt = DateTime.UtcNow; // Lưu vết người cập nhật nhờ BaseEntity
        }
    }
}