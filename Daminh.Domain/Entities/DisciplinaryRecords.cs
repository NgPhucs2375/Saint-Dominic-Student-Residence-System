using System;

namespace Daminh.Domain.Entities
{
    public class DisciplinaryRecord : BaseEntity
    {
        public int Id { get; set; }
        public int HouseId { get; set; }
        public int ViolatorId { get; set; } // Người vi phạm
        public int ReporterId { get; set; } // Phó nhà ghi nhận
        
        public string Reason { get; set; } = string.Empty;
        public int PointsDeducted { get; set; }
        public DateTime DateOfViolation { get; set; }

        public virtual House House { get; set; } = null!;
        public virtual User Violator { get; set; } = null!;
        public virtual User Reporter { get; set; } = null!;
    }
}