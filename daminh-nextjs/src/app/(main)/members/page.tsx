'use client'; // Bắt buộc vì trang này có hiệu ứng Hover, Click và State

import React, { useState } from "react";
import { Search, Plus, X } from "lucide-react";
// Chú ý cách import chuẩn mực của Next.js (dùng @/)
import { C, SHADOW } from "@/src/core/theme";
// import { MemberService } from "@/infrastructure/services/memberService"; 

type Member = {
  id: number;
  name: string;
  email: string;
  role: string;
  house: string;
  pts: number;
  status: string;
  joined: string;
};

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

type SectionHeadProps = {
  title: string;
  sub: string;
  action?: React.ReactNode;
};

type BadgeProps = {
  role?: string;
  status?: string;
};

type MemberPanelProps = {
  member: Member | null;
  onClose: () => void;
};

/* ── UI Components Phóng To (Tỷ Lệ Editorial) ── */
const GoldBtn = ({ children, onClick }: ButtonProps) => (
  <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 10, background: C.gold, color: "#FFF", border: "none", padding: "14px 24px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "all 0.2s cubic-bezier(0.25, 1, 0.5, 1)", boxShadow: "0 6px 20px rgba(181, 150, 90, 0.25)" }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(181, 150, 90, 0.35)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(181, 150, 90, 0.25)"; }}>
    {children}
  </button>
);

const SectionHead = ({ title, sub, action }: SectionHeadProps) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12 }}>
    <div>
      <h2 style={{ color: C.text, fontSize: 32, fontWeight: 700, margin: 0, fontFamily: "Cinzel,serif", letterSpacing: "-0.02em" }}>{title}</h2>
      <p style={{ color: C.muted, fontSize: 15, margin: "8px 0 0", fontWeight: 500 }}>{sub}</p>
    </div>
    {action}
  </div>
);

const RoleBadge = ({ role }: Pick<BadgeProps, "role">) => {
  const m: Record<string, [string, string]> = { OB: ["Cha OB", C.gold], TN: ["Trưởng Nhà", C.blue], PN: ["Phó Nhà", C.purple], QL: ["Quản Lý", C.success], TV: ["Thành Viên", C.muted] };
  const key = role ?? "";
  const [label, color] = m[key] || [key, C.muted];
  return <span style={{ fontSize: 12, fontWeight: 800, padding: "6px 14px", borderRadius: 8, background: color + "15", color, border: `1px solid ${color}30`, letterSpacing: "0.02em" }}>{label}</span>;
};

const StatusBadge = ({ status }: Pick<BadgeProps, "status">) => {
  const m: Record<string, [string, string]> = { "Hoạt động": ["Hoạt động", C.success], "Nghỉ phép": ["Nghỉ phép", C.purple] };
  const key = status ?? "";
  const [label, color] = m[key] || [key, C.muted];
  return <span style={{ fontSize: 12, fontWeight: 800, padding: "6px 16px", borderRadius: 24, background: color + "15", color, border: `1px solid ${color}30`, letterSpacing: "0.02em" }}>{label}</span>;
};

const AC = [C.blue, C.gold, C.success, C.purple, C.brown];
const Avatar = ({ name, size = 48 }: { name: string, size?: number }) => {
  const init = name ? name.trim().split(" ").slice(-1)[0][0] : "U";
  const color = AC[(name ? name.charCodeAt(0) : 0) % 5];
  return <div style={{ width: size, height: size, borderRadius: 14, background: color + "15", border: `1px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: size > 60 ? 32 : 18, fontWeight: 800, flexShrink: 0 }}>{init}</div>;
};

/* ── Panel Thông tin mở rộng (Width: 500px) ── */
const MemberPanel = ({ member, onClose }: MemberPanelProps) => {
  if (!member) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(27, 25, 24, 0.4)", backdropFilter: "blur(6px)", animation: "fadeIn 0.3s" }} />
      <div style={{ position: "relative", width: "min(500px, 100vw)", height: "100%", background: C.bg, borderLeft: `1px solid ${C.border}`, padding: 48, overflowY: "auto", boxShadow: "-15px 0 40px rgba(0,0,0,0.08)", animation: "slideInRight 0.4s cubic-bezier(0.25, 1, 0.5, 1)" }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: 24, right: 24, background: C.card, border: `1px solid ${C.border}`, color: C.text, width: 40, height: 40, borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s hover:bg-stone-100", boxShadow: SHADOW }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}><X size={18} strokeWidth={2.5} /></button>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 36, borderBottom: `1px solid ${C.border}`, marginBottom: 32 }}>
          <Avatar name={member.name} size={120} />
          <h3 style={{ color: C.text, fontSize: 28, fontWeight: 700, margin: "24px 0 10px", fontFamily: "Cinzel,serif" }}>{member.name}</h3>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}><RoleBadge role={member.role} /><StatusBadge status={member.status} /></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[["Nhà sinh hoạt", member.house], ["Email định danh", member.email], ["Ngày gia nhập", member.joined]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: `1px dashed ${C.border}` }}><span style={{ color: C.muted, fontSize: 14, fontWeight: 600 }}>{l}</span><span style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>{v}</span></div>
          ))}
        </div>
        <div style={{ marginTop: 40, background: C.card, borderRadius: 20, padding: 32, border: `1px solid ${C.border}`, boxShadow: SHADOW }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><span style={{ color: C.muted, fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>Điểm Rèn Luyện</span><span style={{ color: member.pts >= 80 ? C.success : C.warn, fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{member.pts}</span></div>
          <div style={{ height: 8, background: C.border, borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 4, width: `${member.pts}%`, background: member.pts >= 80 ? C.success : C.warn, transition: "width 1.5s cubic-bezier(0.25, 1, 0.5, 1)" }} /></div>
        </div>
      </div>
    </div>
  );
};

/* ── COMPONENT CHÍNH ── */
export default function MembersPage() {
  const [members] = useState<Member[]>([
    { id: 1, name: "Nguyễn Văn A", email: "a.nguyen@daminh.com", role: "TN", house: "Nhà Toma", pts: 95, status: "Hoạt động", joined: "01/01/2026" },
    { id: 2, name: "Trần Thị B", email: "b.tran@daminh.com", role: "TV", house: "Nhà Phaolo", pts: 70, status: "Hoạt động", joined: "15/02/2026" }
  ]);
  const [search, setSearch] = useState("");
  const [hFilter, setHFilter] = useState("Tất cả");
  const [selMember, setSelMember] = useState<Member | null>(null);

  const houses = ["Tất cả", ...Array.from(new Set(members.map(m => m.house)))];
  const filtered = members.filter(m => (m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())) && (hFilter === "Tất cả" || m.house === hFilter));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, minHeight: "100%", position: "relative" }}>
      <SectionHead title="Nhân Sự Lưu Xá" sub={`Tổng cộng ${filtered.length} thành viên đang hiển thị`} action={<GoldBtn><Plus size={18} strokeWidth={2.5} /> Thêm nhân sự</GoldBtn>} />
      
      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", background: C.card, padding: "20px 28px", borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: SHADOW }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 20px", width: "100%", maxWidth: 380, flex: "1 1 320px", transition: "0.3s" }} onFocus={e => e.currentTarget.style.borderColor = C.gold} onBlur={e => e.currentTarget.style.borderColor = C.border}>
          <Search size={18} color={C.muted} strokeWidth={2.5} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm tên, email sinh viên..." style={{ background: "none", border: "none", outline: "none", color: C.text, fontSize: 15, width: "100%", fontWeight: 500, fontFamily: "'Inter',sans-serif" }} />
        </div>
        <div style={{ width: 1, height: 28, background: C.border, margin: "0 8px" }} />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {houses.map(h => (
            <button key={h} onClick={() => setHFilter(h)} style={{ padding: "10px 20px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s cubic-bezier(0.25, 1, 0.5, 1)", border: `1px solid ${hFilter === h ? C.gold : C.border}`, background: hFilter === h ? C.gold : C.bg, color: hFilter === h ? "#FFF" : C.muted, boxShadow: hFilter === h ? "0 4px 12px rgba(181, 150, 90, 0.2)" : "none" }}>{h}</button>
          ))}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden", boxShadow: SHADOW }}>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 980, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${C.border}`, background: C.bg }}>
              {["Định danh", "Quyền hạn", "Nhà", "Điểm RLN", "Trạng thái", ""].map(h => <th key={h} style={{ padding: "20px 32px", textAlign: "left", color: C.muted, fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "36px 32px", textAlign: "center", color: C.muted, fontSize: 14 }}>
                  Không tìm thấy thành viên phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              filtered.map(m => (
                <tr key={m.id} style={{ borderBottom: `1px solid ${C.border}`, transition: "all 0.2s ease", cursor: "pointer" }} onMouseEnter={e => { e.currentTarget.style.background = C.cardHov; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }} onClick={() => setSelMember(m)}>
                  <td style={{ padding: "24px 32px" }}><div style={{ display: "flex", alignItems: "center", gap: 16 }}><Avatar name={m.name} /><div><div style={{ color: C.text, fontSize: 16, fontWeight: 700 }}>{m.name}</div><div style={{ color: C.muted, fontSize: 13, marginTop: 4, fontWeight: 500 }}>{m.email}</div></div></div></td>
                  <td style={{ padding: "24px 32px" }}><RoleBadge role={m.role} /></td>
                  <td style={{ padding: "24px 32px", color: C.text, fontSize: 15, fontWeight: 600 }}>{m.house}</td>
                  <td style={{ padding: "24px 32px" }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 100, height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 3, width: `${m.pts}%`, background: m.pts >= 80 ? C.success : C.warn }} /></div><span style={{ color: C.text, fontSize: 15, fontWeight: 800 }}>{m.pts}</span></div></td>
                  <td style={{ padding: "24px 32px" }}><StatusBadge status={m.status} /></td>
                  <td style={{ padding: "24px 32px", textAlign: "right" }}><button style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text, padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700 }}>Hồ sơ</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      <MemberPanel member={selMember} onClose={() => setSelMember(null)} />
    </div>
  );
}