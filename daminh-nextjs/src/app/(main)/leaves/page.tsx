'use client';

import React, { useState } from "react";
import { Plus, Check, X, Clock } from "lucide-react";
import { C, SHADOW, SHADOW_HOV } from "@/src/core/theme";

type LeaveItem = {
  id: number;
  name: string;
  house: string;
  reason: string;
  from: string;
  to: string;
  status: "Cho_Duyet" | "Da_Duyet" | "Tu_Choi";
  approver?: string;
};

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

type LeaveCardProps = {
  leave: LeaveItem;
};

const GoldBtn = ({ children, onClick }: ButtonProps) => (
  <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, background: C.gold, color: "#FFF", border: "none", padding: "12px 20px", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "0.2s", boxShadow: "0 4px 15px rgba(181, 152, 104, 0.2)" }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
    {children}
  </button>
);

const AC = [C.blue, C.gold, C.success, C.purple, C.brown];
const Avatar = ({ name, size = 36 }: { name: string, size?: number }) => {
  const init = name ? name.trim().split(" ").slice(-1)[0][0] : "U";
  const color = AC[(name ? name.charCodeAt(0) : 0) % 5];
  return <div style={{ width: size, height: size, borderRadius: 10, background: color + "15", border: `1px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{init}</div>;
};

const LeaveCard = ({ leave }: LeaveCardProps) => {
  const isPending = leave.status === "Cho_Duyet";
  const isApproved = leave.status === "Da_Duyet";
  
  return (
    <div style={{ background: C.card, padding: 20, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: SHADOW, transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}
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
        <p style={{ margin: 0, color: C.text, fontSize: 14, fontStyle: "italic", lineHeight: 1.5 }}>&ldquo;{leave.reason}&rdquo;</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: isPending ? 16 : 0 }}>
        <Clock size={14} />
        <span>{leave.from} <span style={{opacity: 0.5}}>đến</span> {leave.to}</span>
      </div>

      {isPending && (
        <div style={{ display: "flex", gap: 10, paddingTop: 16, borderTop: `1px dashed ${C.border}` }}>
          <button style={{ flex: 1, background: C.success + "15", color: C.success, border: `1px solid ${C.success}40`, padding: "10px 0", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = C.success; e.currentTarget.style.color = "#FFF"; }} onMouseLeave={e => { e.currentTarget.style.background = C.success + "15"; e.currentTarget.style.color = C.success; }}>DUYỆT</button>
          <button style={{ flex: 1, background: C.danger + "15", color: C.danger, border: `1px solid ${C.danger}40`, padding: "10px 0", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = C.danger; e.currentTarget.style.color = "#FFF"; }} onMouseLeave={e => { e.currentTarget.style.background = C.danger + "15"; e.currentTarget.style.color = C.danger; }}>TỪ CHỐI</button>
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

export default function LeavesPage() {
  const [leaves] = useState<LeaveItem[]>([
    { id: 1, name: "Nguyễn Văn A", house: "Nhà Giuse", reason: "Khám sức khỏe", from: "12/06", to: "13/06", status: "Cho_Duyet" },
    { id: 2, name: "Trần Thị B", house: "Nhà Micae", reason: "Việc gia đình", from: "10/06", to: "11/06", status: "Da_Duyet", approver: "TN. Hùng" },
  ]);

  const pendingLeaves = leaves.filter(l => l.status === "Cho_Duyet");
  const approvedLeaves = leaves.filter(l => l.status === "Da_Duyet");
  const rejectedLeaves = leaves.filter(l => l.status === "Tu_Choi");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, margin: 0, fontFamily: "Cinzel,serif" }}>Dòng chảy Trạng thái (Kanban)</h2>
          <p style={{ color: C.muted, fontSize: 14, margin: "6px 0 0", maxWidth: 600, lineHeight: 1.5 }}>Trực quan hóa luồng duyệt đơn. Kéo, thả hoặc thao tác trực tiếp trên thẻ để xử lý nhanh chóng.</p>
        </div>
        <GoldBtn><Plus size={18} strokeWidth={2.5} /> Lập đơn mới</GoldBtn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, alignItems: "start" }}>
        
        {/* CỘT 1: CHỜ DUYỆT */}
        <div style={{ background: C.card, borderRadius: 24, padding: 24, border: `1px solid ${C.warn}30`, boxShadow: SHADOW, minHeight: 400 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
            <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Clock size={18} color={C.warn} /> Chờ duyệt
            </h3>
            <span style={{ background: C.warn + "20", color: C.warn, padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 800 }}>{pendingLeaves.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {pendingLeaves.map(l => <LeaveCard key={l.id} leave={l} />)}
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