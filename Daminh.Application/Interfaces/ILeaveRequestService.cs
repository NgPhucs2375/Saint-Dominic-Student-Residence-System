using Daminh.Application.DTOs;
using Daminh.Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Daminh.Application.Interfaces
{
    public interface ILeaveRequestService
    {
        Task<LeaveRequest> CreateLeaveAsync(CreateLeaveRequestDto dto, int requesterId, int houseId);
        Task<IEnumerable<LeaveRequest>> GetMyLeavesAsync(int requesterId);
        Task<IEnumerable<LeaveRequest>> GetPendingLeavesForHouseAsync(int houseId);
        Task<bool> ProcessLeaveRequestAsync(int leaveId, int approverId, bool isApproved);
        Task<LeaveRequest?> GetByIdAsync(int id, CancellationToken cancellationToken);
        void Update(LeaveRequest leaveRequest);
    }
}