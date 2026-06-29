using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Daminh.Domain.Entities;
using Daminh.Application.Interfaces;

namespace Daminh.Application.Features.LeaveRequests.Commands
{
    // 1. BẢN MỆNH LỆNH (COMMAND)
    // Chứa toàn bộ "nguyên liệu" cần thiết từ người dùng (hoặc Controller) truyền vào.
    public class ProcessLeaveCommand : IRequest<bool>
    {
        public int LeaveRequestId { get; set; }
        public int ApproverId { get; set; }
        public bool IsApproved { get; set; } // True: Duyệt, False: Từ chối
    }

    // 2. NGƯỜI THỰC THI (HANDLER)
    // Kẻ đứng ra dàn xếp luồng đi của dữ liệu.
    public class ProcessLeaveCommandHandler : IRequestHandler<ProcessLeaveCommand, bool>
    {
        private readonly ILeaveRequestService _leaveRepository;
        private readonly IUnitOfWork _unitOfWork;

        // Dependency Injection: Bơm các "Giao ước" vào thay vì dùng trực tiếp Class.
        public ProcessLeaveCommandHandler(ILeaveRequestService leaveRepository, IUnitOfWork unitOfWork)
        {
            _leaveRepository = leaveRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(ProcessLeaveCommand request, CancellationToken cancellationToken)
        {
            // Bước 1: Tra cứu đơn xin phép từ kho dữ liệu
            var leaveRequest = await _leaveRepository.GetByIdAsync(request.LeaveRequestId, cancellationToken);
            
            if (leaveRequest == null)
            {
                // Tối ưu nhất là ném ra một Custom Exception (vd: NotFoundException) để Middleware bắt lấy
                throw new Exception($"Không tìm thấy Đơn xin phép với ID: {request.LeaveRequestId}");
            }

            // Bước 2: Kích hoạt "Hành vi" của Domain Entity.
            // Chú ý sự thanh khiết: Handler KHÔNG TỰ ĐỔI TRẠNG THÁI (Status).
            // Nó chỉ "ra lệnh" cho leaveRequest tự xử lý chính nó dựa trên logic ta đã viết ở file LeaveRequest.cs
            if (request.IsApproved)
            {
                leaveRequest.Approve(request.ApproverId);
            }
            else
            {
                leaveRequest.Reject(request.ApproverId);
            }

            // Bước 3: Ghi nhận sự thay đổi và Lưu toàn bộ giao dịch
            _leaveRepository.Update(leaveRequest);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true; // Trả về true nếu luồng chạy trót lọt
        }
    }
}