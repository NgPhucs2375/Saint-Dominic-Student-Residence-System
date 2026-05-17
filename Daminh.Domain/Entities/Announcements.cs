using Daminh.Domain.Enums;

namespace Daminh.Domain.Entities
{
    public class Announcement : BaseEntity
    {
        public int Id { get; set; }
        public int? HouseId { get; set; } // Null = Global
        public int AuthorId { get; set; }
        
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public AnnouncementType Type { get; set; }

        public virtual House? House { get; set; }
        public virtual User Author { get; set; } = null!;
    }
}