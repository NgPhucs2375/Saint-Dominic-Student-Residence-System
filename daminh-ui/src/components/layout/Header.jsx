import React from "react";
import { Search, Bell, Calendar } from "lucide-react";
import { C } from "../../config/theme"; // Lấy bảng màu hoàng gia

const fmtDate = () => new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" });

const NAV_LABELS = {
  dashboard: "Tổng quan",
  houses: "Quản lý Nhà",
  members: "Nhân sự",
  finance: "Tài chính",
  leaves: "Xin phép"
};

export default function Header({ tab }) {
  return (
    <header style={{ 
      height: 96, borderBottom: `2px solid ${C.border}`, 
      display: "flex", alignItems: "center", justifyContent: "space-between", 
      padding: "0 48px", background: C.bg, zIndex: 10, flexShrink: 0
    }}>
      {/* Trái: Ngữ cảnh không gian */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1 style={{ color: C.text, fontSize: 28, fontWeight: 700, fontFamily: "Cinzel,serif", letterSpacing: "-0.02em", margin: 0 }}>
          {NAV_LABELS[tab] || "Tổng quan"}
        </h1>
        <div style={{ color: C.muted, fontSize: 14, marginTop: 8, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, letterSpacing: "0.02em" }}>
          <Calendar size={16} strokeWidth={2.5} color={C.gold} />
          {fmtDate()}
        </div>
      </div>

      {/* Phải: Công cụ & Thông báo */}
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <div style={{ 
          display: "flex", alignItems: "center", gap: 14, 
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 40, 
          padding: "12px 24px", width: 350, boxShadow: "0 2px 10px rgba(0,0,0,0.02)", 
          transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)" 
        }}
          onFocus={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = "0 8px 24px rgba(181, 152, 104, 0.12)"; }}
          onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.02)"; }}>
          <Search size={15} color={C.muted} strokeWidth={2.5} />
          <input placeholder="Tra cứu thông tin..." style={{ background: "none", border: "none", outline: "none", color: C.text, fontSize: 15, width: "100%", fontWeight: 500, fontFamily: "'Inter',sans-serif" }} />
        </div>

        <div style={{ width: 1, height: 34, background: C.border }} />

        <button style={{ 
          background: C.card, border: `2px solid ${C.border}`, width: 48, height: 48, 
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", 
          color: C.text, cursor: "pointer", position: "relative", transition: "transform 0.2s, box-shadow 0.2s" 
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.04)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
          <Bell size={22} strokeWidth={2} />
          <span style={{ position: "absolute", top: 12, right: 12, width: 10, height: 10, background: C.danger, borderRadius: "50%", border: `2px solid ${C.card}` }} />
        </button>
      </div>
    </header>
  );
}
