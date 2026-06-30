using Daminh.Application.Interfaces;
using Daminh.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace Daminh.Infrastructure.Persistence
{
    public class DaminhDbContext : DbContext
    {
        private readonly ICurrentUserService _currentUserService;

        public DaminhDbContext(DbContextOptions<DaminhDbContext> options, ICurrentUserService currentUserService) : base(options)
        {
            _currentUserService = currentUserService;
        }

        public DbSet<House> Houses { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Delegation> Delegations { get; set; } = null!;
        public DbSet<FinancialTransaction> FinancialTransactions { get; set; } = null!;
        public DbSet<DutyRoster> DutyRosters { get; set; } = null!;
        public DbSet<Event> Events { get; set; } = null!;
        public DbSet<Attendance> Attendances { get; set; } = null!;
        public DbSet<DisciplinaryRecord> DisciplinaryRecords { get; set; } = null!;
        public DbSet<AcademicTransaction> AcademicTransactions { get; set; } = null!;
        public DbSet<Announcement> Announcements { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            ApplySoftDeleteQueryFilters(builder);

            builder.Entity<Delegation>().HasOne(d => d.Delegator).WithMany().HasForeignKey(d => d.DelegatorId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Delegation>().HasOne(d => d.Delegatee).WithMany().HasForeignKey(d => d.DelegateeId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<LeaveRequest>().HasOne(l => l.Requester).WithMany(u => u.LeaveReaquests).HasForeignKey(l => l.RequesterId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<LeaveRequest>().HasOne(l => l.Approver).WithMany().HasForeignKey(l => l.ApproverId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<DisciplinaryRecord>().HasOne(d => d.Violator).WithMany().HasForeignKey(d => d.ViolatorId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<DisciplinaryRecord>().HasOne(d => d.Reporter).WithMany().HasForeignKey(d => d.ReporterId).OnDelete(DeleteBehavior.Restrict);
        }

        private static void ApplySoftDeleteQueryFilters(ModelBuilder builder)
        {
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                if (entityType.ClrType == null)
                {
                    continue;
                }

                if (!typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                {
                    continue;
                }

                var parameter = Expression.Parameter(entityType.ClrType, "entity");
                var isDeleted = Expression.Property(parameter, nameof(BaseEntity.IsDeleted));
                var predicate = Expression.Lambda(Expression.Equal(isDeleted, Expression.Constant(false)), parameter);
                builder.Entity(entityType.ClrType).HasQueryFilter(predicate);
            }
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var currentUserId = _currentUserService.UserId ?? "System";

            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreateAt = DateTime.UtcNow;
                        entry.Entity.CreatedBy = currentUserId;
                        break;
                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        entry.Entity.UpdatedBy = currentUserId;
                        break;
                    case EntityState.Deleted:
                        entry.State = EntityState.Modified;
                        entry.Entity.IsDeleted = true;
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        entry.Entity.UpdatedBy = currentUserId;
                        break;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}