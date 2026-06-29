using Daminh.Domain.Entities;
using Microsoft.EntityFrameworkCore; // Sử dụng Entity Framework Core
using System; // Sử dụng DateTime
using System.Threading; // Sử dụng CancellationToken
using System.Threading.Tasks; // Sử dụng Task
using Daminh.Application.Interfaces; 

namespace Daminh.Infrastructure.Persistence
{
    public class DaminhDbContext : DbContext
    {
        // Khai bao interface de lau HouseId cua nguoi dang nhap
       
        private readonly ICurrentUserService _currentUserService;

        public DaminhDbContext(DbContextOptions<DaminhDbContext> options, ICurrentUserService currentUserService): base(options)
        {
            _currentUserService = currentUserService;
        }

        // Khai báo các bảng trong Database
        public DbSet<House> Houses { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Delegation> Delegations { get; set; } = null!;
        public DbSet<FinancialTransaction> FinancialTransactions { get; set;} = null!;
        public DbSet<DutyRoster> DutyRosters { get; set;} = null!;
        public DbSet<Event> Events { get; set;} = null!;
        public DbSet<Attendance> Attendances { get; set;} = null!;
        public DbSet<DisciplinaryRecord> DisciplinaryRecords { get; set;} = null!;
        public DbSet<AcademicTransaction> AcademicTransactions { get; set;} = null!;
        public DbSet<Announcement> Announcements { get; set;} = null!;

        // ModelBuilder : Cấu hình mô hình dữ liệu (data model) của ứng dụng khi ánh xạ (mapping) giữa các lớp C# và các bảng trong cơ sở dữ liệu. Nó cho phép bạn định nghĩa các quy tắc ánh xạ, ràng buộc, quan hệ giữa các bảng, v.v.
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); // Gọi phương thức gốc để đảm bảo các cấu hình mặc định được áp dụng

            // ==========================================
            // 1. GLOBAL QUERY FILTERS (Bảo vệ dữ liệu)
            // ==========================================

            // Lọc Soft Delete: Mặc định không bao giờ query ra những record đã bị xóa
            builder.Entity<House>().HasQueryFilter(h => !h.IsDeleted);
            builder.Entity<User>().HasQueryFilter(x => !x.IsDeleted); 
            builder.Entity<FinancialTransaction>().HasQueryFilter(x => !x.IsDeleted);
            builder.Entity<LeaveRequest>().HasQueryFilter(x => !x.IsDeleted);
            
            // Ví dụ Lọc Multi-tenant (Đa phân khu): 
            // Nếu có _currentHouseId, EF Core sẽ tự động thêm "WHERE HouseId = ..." vào mọi câu query
            // builder.Entity<FinancialTransaction>().HasQueryFilter(x => !x.IsDeleted && (!_currentHouseId.HasValue || x.HouseId == _currentHouseId));

            // ==========================================
            // 2. FLUENT API: Xử lý quan hệ phức tạp & Tránh lỗi Cascade Delete
            // ==========================================

            // Bảng Delegatioin: Tránh lỗi Multiple Casecade Paths khi 1 bảng có 2 khóa ngoại trỏ về User
            builder.Entity<Delegation>().HasOne(d=>d.Delegator).WithMany().HasForeignKey(d=>d.DelegatorId).OnDelete(DeleteBehavior.Restrict); // khong cho phép xóa User nếu có Delegation liên quan
            //truy van tren co nghia la: Một Delegation có một Delegator (User), nhưng một User có thể là Delegator cho nhiều Delegation. Khi xóa một User, nếu có Delegation liên quan, sẽ không được phép xóa (Restrict) để tránh lỗi Multiple Cascade Paths.

            builder.Entity<Delegation>().HasOne(d=>d.Delegatee).WithMany().HasForeignKey(d=>d.DelegateeId).OnDelete(DeleteBehavior.Restrict); // khong cho phép xóa User nếu có Delegation liên quan
            //truy van tren co nghia la: Một Delegation có một Delegatee (User), nhưng một User có thể là Delegatee cho nhiều Delegation. Khi xóa một User, nếu có Delegation liên quan, sẽ không được phép xóa (Restrict) để tránh lỗi Multiple Cascade Paths.

            //Bang LeaveRequest: Co Requester va Approver deu la User, can cau hinh de tranh loi Multiple Cascade Paths
            builder.Entity<LeaveRequest>().HasOne(l=>l.Requester).WithMany(u=>u.LeaveReaquests).HasForeignKey(l=>l.RequesterId).OnDelete(DeleteBehavior.Restrict); // Một LeaveRequest có một Requester (User), nhưng một User có thể là Requester cho nhiều LeaveRequest. Khi xóa một User, nếu có LeaveRequest liên quan, sẽ không được phép xóa (Restrict) để tránh lỗi Multiple Cascade Paths.

            builder.Entity<LeaveRequest>()
                .HasOne(l => l.Approver)
                .WithMany()
                .HasForeignKey(l => l.ApproverId)
                .OnDelete(DeleteBehavior.Restrict); // Một LeaveRequest có một Approver (User), nhưng một User có thể là Approver cho nhiều LeaveRequest. Khi xóa một User, nếu có LeaveRequest liên quan, sẽ không được phép xóa (Restrict) để tránh lỗi Multiple Cascade Paths.

            // Table DisciplinaryRecord: Co Violator vaf Reporter deu la User, can cau hinh de tranh loi Multiple Cascade Paths
            builder.Entity<DisciplinaryRecord>()
                .HasOne(d =>d.Violator)
                .WithMany()
                .HasForeignKey(d => d.ViolatorId)
                .OnDelete(DeleteBehavior.Restrict); // Một DisciplinaryRecord có một Violator (User), nhưng một User có thể là Violator cho nhiều DisciplinaryRecord. Khi x     óa một User, nếu có DisciplinaryRecord liên quan, sẽ không được phép xóa (Restrict) để tránh lỗi Multiple Cascade Paths.

            builder.Entity<DisciplinaryRecord>()
                .HasOne(d => d.Reporter)
                .WithMany()
                .HasForeignKey(d => d.ReporterId)
                .OnDelete(DeleteBehavior.Restrict); // Một DisciplinaryRecord có một Reporter (User), nhưng một User có thể là Reporter cho nhiều DisciplinaryRecord. Khi xóa một User, nếu có DisciplinaryRecord liên quan, sẽ không được phép xóa (Restrict) để tránh lỗi Multiple Cascade Paths. 

            }
            
        // ==========================================
        // 3. TỰ ĐỘNG AUDIT LƯU VẾT THAO TÁC (Tự động hóa BaseEntity)
        // ==========================================
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {

            // Get ID of current user login to do API
            var currentUserId = _currentUserService.UserId ?? "System"; // Lấy UserId của người dùng hiện tại từ dịch vụ CurrentUserService

            // Task<> : Một kiểu dữ liệu đại diện cho một tác vụ bất đồng bộ (asynchronous operation) có thể trả về một giá trị. Trong trường hợp này, Task<int> biểu thị rằng phương thức sẽ trả về một số nguyên (int) sau khi hoàn thành tác vụ.
            //CancellationToken : Một cấu trúc được sử dụng để truyền thông tin về việc hủy bỏ một tác vụ bất đồng bộ. Nó cho phép bạn yêu cầu hủy bỏ tác vụ nếu nó đang chạy, giúp quản lý tài nguyên hiệu quả hơn và tránh các tác vụ không cần thiết tiếp tục thực thi.
            foreach(var entry in ChangeTracker.Entries<BaseEntity>())
            {
                // Duyet qua tat ca cac entity dang duoc theo doi trong DbContext ma ke thua tu BaseEntity
                // ChangeTracker : Một thành phần của Entity Framework Core, được sử dụng để theo dõi các thay đổi đối với các thực thể (entities) trong DbContext. Nó giúp xác định những thực thể nào đã được thêm, sửa đổi hoặc xóa, và cung cấp thông tin về trạng thái của chúng.
                // Entries<BaseEntity>() : Lấy tất cả các thực thể đang được theo dõi
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreateAt = DateTime.UtcNow; // Khi thêm mới, tự động gán CreateAt là thời gian hiện tại (UTC)
                        entry.Entity.CreatedBy = currentUserId; // auto fill CreatedBy = UserId cua nguoi dang nhap hien tai
                        break;
                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.UtcNow; // Khi sửa đổi, tự động gán UpdatedAt là thời gian hiện tại (UTC)
                        entry.Entity.UpdatedBy = currentUserId; // auto fill UpdatedBy = UserId cua nguoi dang nhap hien tai
                        break;
                    case EntityState.Deleted:
                        entry.State = EntityState.Modified; // Chuyển trạng thái thành Modified để thực hiện Soft Delete
                        entry.Entity.IsDeleted = true; // Đánh dấu là đã xóa thay vì xóa thật sự
                        entry.Entity.UpdatedAt = DateTime.UtcNow; // Cập nhật thời gian xóa
                        entry.Entity.UpdatedBy = currentUserId; // auto fill UpdatedBy = UserId cua nguoi dang nhap hien tai
                        break; 
                }
            }
            return base.SaveChangesAsync(cancellationToken); // Gọi phương thức gốc để thực hiện lưu thay đổi vào cơ sở dữ liệu
        }

    }
}