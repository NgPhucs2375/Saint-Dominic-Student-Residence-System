using Daminh.Application.DTOs;
using Daminh.Application.Interfaces;
using Daminh.Domain.Entities;
using Daminh.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Daminh.Application.Services
{
    public class LeaveRequestService : ILeaveRequestService
    {
        private readonly IGenericRepository<LeaveRequest> _leaveRepository;
        private readonly IUnitOfWork _unitOfWork;

        public LeaveRequestService(IGenericRepository<LeaveRequest> leaveRepository, IUnitOfWork unitOfWork)
        {
            _leaveRepository = leaveRepository;
            _unitOfWork = unitOfWork;
        }

        // Sinh viên tạo đơn mới
        public async Task<LeaveRequest> CreateLeaveAsync(CreateLeaveRequestDto dto, int requesterId, int houseId)
        {
            var leaveRequest = new LeaveRequest(
                houseId,
                requesterId,
                dto.Reason,
                dto.StartTime,
                dto.EndTime);

            await _leaveRepository.AddAsync(leaveRequest);
            await _unitOfWork.SaveChangesAsync(CancellationToken.None); // Audit log sẽ tự ghi CreatedBy, CreateAt

            return leaveRequest;
        }

        // Sinh viên xem danh sách đơn của chính mình
        public async Task<IEnumerable<LeaveRequest>> GetMyLeavesAsync(int requesterId)
        {
            var allLeaves = await _leaveRepository.GetAllAsync();
            return allLeaves.Where(l => l.RequesterId == requesterId).OrderByDescending(l => l.CreateAt);
        }

        // Ban quản lý xem các đơn đang chờ duyệt trong nhà của mình
        public async Task<IEnumerable<LeaveRequest>> GetPendingLeavesForHouseAsync(int houseId)
        {
            var allLeaves = await _leaveRepository.GetAllAsync();
            return allLeaves.Where(l => l.HouseId == houseId && l.Status == LeaveStatus.Pending)
                            .OrderBy(l => l.StartTime);
        }

        // Ban quản lý duyệt hoặc từ chối đơn
        public async Task<bool> ProcessLeaveRequestAsync(int leaveId, int approverId, bool isApproved)
        {
            var leaveRequest = await _leaveRepository.GetByIdAsync(leaveId);
            if (leaveRequest == null || leaveRequest.Status != LeaveStatus.Pending)
            {
                return false; // Không tìm thấy hoặc đơn đã được xử lý rồi
            }

            if (isApproved)
            {
                leaveRequest.Approve(approverId);
            }
            else
            {
                leaveRequest.Reject(approverId);
            }

            await _leaveRepository.UpdateAsync(leaveRequest);
            await _unitOfWork.SaveChangesAsync(CancellationToken.None); // Audit log tự ghi UpdateBy, UpdatedAt

            return true;
        }

        public async Task<LeaveRequest?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            return await _leaveRepository.GetByIdAsync(id);
        }

        public void Update(LeaveRequest leaveRequest)
        {
            _leaveRepository.Update(leaveRequest);
        }
    }
}