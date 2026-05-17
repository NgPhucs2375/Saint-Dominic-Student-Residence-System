using System;

namespace Daminh.Domain.Entities
{
    public class AcademicTransaction : BaseEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        
        public string Semester { get; set; } = string.Empty;
        public string Year { get; set; } = string.Empty;
        public string DocumentUrl { get; set; } = string.Empty;
        public DateTime SubmissionDate { get; set; } = DateTime.UtcNow;

        public virtual User User { get; set; } = null!;
    }
}