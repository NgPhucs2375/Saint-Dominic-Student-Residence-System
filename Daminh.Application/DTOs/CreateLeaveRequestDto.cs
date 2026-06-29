using System;

namespace Daminh.Application.DTOs
{
    public class CreateLeaveRequestDto
    {
        public string Reason { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Description { get; set; } = string.Empty;
        // Có thể bổ sung EvidenceUrl (Ảnh minh chứng) sau nếu cần
    }
}