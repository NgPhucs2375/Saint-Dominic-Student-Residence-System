import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ĐÂY LÀ LÕI ĐIỀU HƯỚNG
import { LayoutDashboard, Home, Users, Wallet, CalendarOff, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { C, SHADOW } from "../../config/theme";

const NAV = [
  { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { id: "houses", label: "Quản lý Nhà", icon: Home },
  { id: "members", label: "Nhân sự", icon: Users },
  { id: "finance", label: "Tài chính", icon: Wallet },
  { id: "leaves", label: "Xin phép", icon: CalendarOff },
];

// Chú ý: Đã loại bỏ hoàn toàn setTab ra khỏi đây vì không còn cần thiết
export default function Sidebar({ tab, user, onLogout, pendingLeavesCount }) {
  const [isOpen, setIsOpen] = useState(true);
  
  // Khởi tạo công cụ bẻ lái URL
  const navigate = useNavigate();

  return (
    <div style={{ 
      width: isOpen ? 260 : 88, 
      transition: "width 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
      background: C.sidebar, borderRight: `1px solid ${C.borderDark}`, 
      display: "flex", flexDirection: "column", flexShrink: 0, zIndex: 20, position: "relative"
    }}>
      
      {/* Nút Toggle mạ vàng */}
      <button onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "absolute", top: 38, right: -14, width: 28, height: 28, borderRadius: "50%",
          background: C.gold, border: `4px solid ${C.bg}`, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", zIndex: 30, color: "#FFF", boxShadow: SHADOW, transition: "transform 0.3s, background 0.3s"
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {isOpen ? <ChevronLeft size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
      </button>

      {/* Logo */}
      <div style={{ padding: isOpen ? "36px 28px" : "36px 0", display: "flex", alignItems: "center", justifyContent: isOpen ? "flex-start" : "center", gap: 14, overflow: "hidden", transition: "padding 0.4s" }}>
        <div style={{ width: 44, height: 44, background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: C.sidebar, fontWeight: 900, fontSize: 24, fontFamily: "Cinzel,serif", boxShadow: "0 4px 15px rgba(181, 152, 104, 0.25)", flexShrink: 0 }}>✝</div>
        
        <div style={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0, transition: "opacity 0.3s", whiteSpace: "nowrap" }}>
          <div style={{ color: "#FFF", fontSize: 20, fontWeight: 700, fontFamily: "Cinzel,serif", letterSpacing: "-0.02em", lineHeight: 1 }}>Đa Minh</div>
          <div style={{ color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4 }}>Management</div>
        </div>
      </div>
      
      {/* Menu Điều hướng */}
      <nav style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 8, overflowX: "hidden" }}>
        {NAV.map(n => {
          const act = tab === n.id;
          return (
            <button key={n.id} 
              /* ĐÂY CHÍNH LÀ NƠI PHÉP MÀU XẢY RA: Thay đổi URL thẳng trên trình duyệt */
              onClick={() => navigate(`/${n.id}`)}
              style={{
                display: "flex", alignItems: "center", justifyContent: isOpen ? "flex-start" : "center",
                gap: isOpen ? 14 : 0, padding: isOpen ? "14px 18px" : "14px 0", 
                borderRadius: 10, border: "none", cursor: "pointer", transition: "all 0.3s ease",
                background: act ? "rgba(255,255,255,0.06)" : "transparent", 
                color: act ? C.gold : C.sidebarText, 
                fontWeight: act ? 700 : 500, position: "relative"
              }}
              onMouseEnter={e => { if (!act) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#FFF"; } }}
              onMouseLeave={e => { if (!act) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.sidebarText; } }}>
              
              {act && <div style={{ position: "absolute", left: 0, top: "25%", bottom: "25%", width: 3, background: C.gold, borderRadius: "0 4px 4px 0" }} />}
              
              <n.icon size={20} strokeWidth={act ? 2.5 : 2} style={{ flexShrink: 0 }} />
              
              <span style={{ fontSize: 14, textAlign: "left", opacity: isOpen ? 1 : 0, width: isOpen ? "100%" : 0, display: isOpen ? "block" : "none", transition: "opacity 0.3s", whiteSpace: "nowrap" }}>
                {n.label}
              </span>

              {isOpen && n.id === "leaves" && pendingLeavesCount > 0 && <span style={{ marginLeft: "auto", background: C.warn, color: "#FFF", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 12 }}>{pendingLeavesCount}</span>}
              {!isOpen && n.id === "leaves" && pendingLeavesCount > 0 && <span style={{ position: "absolute", top: 8, right: 18, width: 8, height: 8, background: C.warn, borderRadius: "50%", border: `2px solid ${C.sidebar}` }} />}
            </button>
          );
        })}
      </nav>
      
      {/* Thông tin User */}
      <div style={{ padding: isOpen ? "20px 24px" : "20px 0", borderTop: `1px solid rgba(255,255,255,0.05)`, display: "flex", justifyContent: "center", background: "transparent" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, overflow: "hidden", width: "100%", justifyContent: isOpen ? "flex-start" : "center" }}>
          
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: `1px solid ${C.gold}40`, display: "flex", alignItems: "center", justifyContent: "center", color: C.gold, fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
            {user?.fullName?.charAt(0) || user?.FullName?.charAt(0) || "U"}
          </div>
          
          <div style={{ flex: 1, opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0, display: isOpen ? "block" : "none", transition: "opacity 0.3s", whiteSpace: "nowrap" }}>
            <div style={{ color: "#FFF", fontSize: 13, fontWeight: 700 }}>{user?.fullName || user?.FullName || "Khách"}</div>
            <div style={{ color: C.muted, fontSize: 11, fontWeight: 500, marginTop: 2 }}>Vai trò: {user?.role || user?.Role || "N/A"}</div>
          </div>

          {isOpen && (
            <LogOut onClick={onLogout} size={18} color={C.sidebarText} style={{ cursor: "pointer", flexShrink: 0, transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = C.danger} onMouseLeave={e => e.currentTarget.style.color = C.sidebarText} title="Đăng xuất" />
          )}
        </div>
      </div>
    </div>
  );
}