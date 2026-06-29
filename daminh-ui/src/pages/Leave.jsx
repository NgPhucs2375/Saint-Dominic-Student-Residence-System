import React, { useState, useEffect } from "react";
import { Plus, Check, X, Clock, AlertCircle } from "lucide-react";
import { LeaveService } from "../services/leaveService";
import { C, SHADOW, SHADOW_HOV } from "../config/theme";

/* ── UI Components Nhỏ ── */
const GoldBtn = ({ children, onClick }) => (
  <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, background: C.gold, color: "#FFF", border: "none", padding: "12px 20px", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "0.2s", boxShadow: "0 4px 15px rgba(181, 152, 104, 0.2)" }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
    {children}
  </button>
);

const AC = [C.blue, C.gold, C.success, C.purple, C.brown];
const Avatar = ({ name, size = 36 }) => {
  const init = name ? name.trim().split(" ").slice(-1)[0][0] : "U";
  const color = AC[(name ? name.charCodeAt(0) : 0) % 5];
  return <div style={{ width: size, height: size, borderRadius: 10, background: color + "15", border: `1px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{init}</div>;
};

/* ── THẺ KANBAN (CARD) ── */
const LeaveCard = ({ leave, onApprove, onReject }) => {
  const isPending = leave.status === "Cho_Duyet";
  const isApproved = leave.status === "Da_Duyet";
  
  return (
    <div style={{ 
      background: C.card, padding: 20, borderRadius: 16, border: `1px solid ${C.border}`, 
      boxShadow: SHADOW, transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" 
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = SHADOW_HOV; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = SHADOW; }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={leave.name} />
          <div>
            <h4 style={{ margin: 0, color: C.text, fontSize: 15, fontWeight: 700 }}>{leave.name}</h4>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 2, fontWeight: 500 }}>{leave.house}</div>
          </div>
        </div>
      </div>

      <div style={{ background: C.bg, padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 16 }}>
        <p style={{ margin: 0, color: C.text, fontSize: 14, fontStyle: "italic", lineHeight: 1.5 }}>"{leave.reason}"</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: isPending ? 16 : 0 }}>
        <Clock size={14} />
        <span>{leave.from} <span style={{opacity: 0.5}}>đến</span> {leave.to}</span>
      </div>

      {isPending && (
        <div style={{ display: "flex", gap: 10, paddingTop: 16, borderTop: `1px dashed ${C.border}` }}>
          <button onClick={() => onApprove(leave.id)} style={{ flex: 1, background: C.success + "15", color: C.success, border: `1px solid ${C.success}40`, padding: "10px 0", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = C.success; e.currentTarget.style.color = "#FFF"; }} onMouseLeave={e => { e.currentTarget.style.background = C.success + "15"; e.currentTarget.style.color = C.success; }}>
            DUYỆT
          </button>
          <button onClick={() => onReject(leave.id)} style={{ flex: 1, background: C.danger + "15", color: C.danger, border: `1px solid ${C.danger}40`, padding: "10px 0", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = C.danger; e.currentTarget.style.color = "#FFF"; }} onMouseLeave={e => { e.currentTarget.style.background = C.danger + "15"; e.currentTarget.style.color = C.danger; }}>
            TỪ CHỐI
          </button>
        </div>
      )}
      
      {isApproved && leave.approver && (
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.border}`, color: C.success, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          <Check size={12} strokeWidth={3} /> Đã duyệt bởi {leave.approver}
        </div>
      )}
    </div>
  );
};

/* ── COMPONENT CHÍNH ── */
export default function LeavesView() {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // GỌI API KHI MỞ TRANG
  useEffect(() => {
    LeaveService.getAllLeaves()
      .then(res => {
        const rawData = res.Data || res.data || [];
        const formatted = rawData.map(l => ({
          id: l.Id || l.id,
          name: l.User?.FullName || l.userName || "Sinh viên",
          house: l.User?.House?.Name || "Lưu xá",
          reason: l.Reason || l.reason || "Không rõ lý do",
          from: l.StartTime ? new Date(l.StartTime).toLocaleDateString('vi-VN') : "N/A",
          to: l.EndTime ? new Date(l.EndTime).toLocaleDateString('vi-VN') : "N/A",
          status: l.Status === 1 || l.Status === "Da_Duyet" ? "Da_Duyet" : l.Status === 2 || l.Status === "Tu_Choi" ? "Tu_Choi" : "Cho_Duyet",
          approver: l.Approver?.FullName || l.approverName || null
        }));
        setLeaves(formatted);
      })
      .catch(err => {
        console.error("Lỗi nạp đơn xin phép:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleApprove = (id) => {
    LeaveService.processLeave(id, true).then(() => {
      setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: "Da_Duyet", approver: "Bạn" } : l));
    }).catch(err => console.error(err));
  };

  const handleReject = (id) => {
    LeaveService.processLeave(id, false).then(() => {
      setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: "Tu_Choi" } : l));
    }).catch(err => console.error(err));
  };

  const pendingLeaves = leaves.filter(l => l.status === "Cho_Duyet");
  const approvedLeaves = leaves.filter(l => l.status === "Da_Duyet");
  const rejectedLeaves = leaves.filter(l => l.status === "Tu_Choi");

  if (isLoading) return <div style={{ padding: 40, color: C.muted, textAlign: "center" }}>Đang nạp luồng quy trình duyệt đơn...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, margin: 0, fontFamily: "Cinzel,serif" }}>Dòng chảy Trạng thái (Kanban)</h2>
          <p style={{ color: C.muted, fontSize: 14, margin: "6px 0 0", maxWidth: 600, lineHeight: 1.5 }}>Trực quan hóa luồng duyệt đơn. Kéo, thả hoặc thao tác trực tiếp trên thẻ để xử lý nhanh chóng.</p>
        </div>
        <GoldBtn><Plus size={18} strokeWidth={2.5} /> Lập đơn mới</GoldBtn>
      </div>

      {/* 3 Cột Kanban */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignItems: "start" }}>
        
        {/* CỘT 1: CHỜ DUYỆT */}
        <div style={{ background: C.card, borderRadius: 24, padding: 24, border: `1px solid ${C.warn}30`, boxShadow: SHADOW, minHeight: 400 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
            <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Clock size={18} color={C.warn} /> Chờ duyệt
            </h3>
            <span style={{ background: C.warn + "20", color: C.warn, padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 800 }}>{pendingLeaves.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {pendingLeaves.map(l => <LeaveCard key={l.id} leave={l} onApprove={handleApprove} onReject={handleReject} />)}
            {pendingLeaves.length === 0 && <div style={{ textAlign: "center", padding: 30, color: C.muted, fontSize: 13, border: `1px dashed ${C.border}`, borderRadius: 16 }}>Không có đơn chờ duyệt.</div>}
          </div>
        </div>

        {/* CỘT 2: ĐÃ DUYỆT */}
        <div style={{ background: C.card, borderRadius: 24, padding: 24, border: `1px solid ${C.success}30`, boxShadow: SHADOW, minHeight: 400 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
            <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Check size={18} color={C.success} strokeWidth={3} /> Đã duyệt
            </h3>
            <span style={{ background: C.success + "20", color: C.success, padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 800 }}>{approvedLeaves.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, opacity: 0.9 }}>
            {approvedLeaves.map(l => <LeaveCard key={l.id} leave={l} />)}
          </div>
        </div>

        {/* CỘT 3: TỪ CHỐI */}
        <div style={{ background: C.card, borderRadius: 24, padding: 24, border: `1px solid ${C.danger}20`, boxShadow: SHADOW, minHeight: 400 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
            <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <X size={18} color={C.danger} strokeWidth={3} /> Từ chối
            </h3>
            <span style={{ background: C.danger + "20", color: C.danger, padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 800 }}>{rejectedLeaves.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, opacity: 0.6 }}>
            {rejectedLeaves.map(l => <LeaveCard key={l.id} leave={l} />)}
          </div>
        </div>

      </div>
    </div>
  );
}