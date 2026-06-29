import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Check, X } from "lucide-react";
import { C, SHADOW } from "./config/theme";

// ── IMPORT CÁC TRANG VÀ LAYOUT ──
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import LoginView from "./pages/Login";
import DashboardView from "./pages/Dashboard";
import HousesView from "./pages/House"; 
import MembersView from "./pages/Members";
import FinanceView from "./pages/Finance";
import LeavesView from "./pages/Leave";

/* ── Dữ liệu Fallback (Dành cho các trang chưa nối API) ── */
const INITIAL_DATA = {
  leaves: [
    { id: 1, name: "Lê Văn Cường", house: "Nhà Micae", reason: "Về thăm gia đình", from: "10/06", to: "12/06", status: "Cho_Duyet" },
    { id: 2, name: "Phạm Thị Dung", house: "Nhà Phêrô", reason: "Đám cưới người thân", from: "15/06", to: "16/06", status: "Da_Duyet" }
  ],
  finance: [ // Sẽ xóa sau khi Finance nối API hoàn chỉnh
    { id: 1, type: "Thu", amount: 500000, desc: "Đóng quỹ tháng 6", house: "Nhà Giuse", status: "Hoan_Thanh", date: "01/06" }
  ]
};

const Toasts = ({ toasts }) => (
  <div style={{ position: "absolute", bottom: 24, right: 24, zIndex: 999, display: "flex", flexDirection: "column", gap: 12 }}>
    {toasts.map(t => (
      <div key={t.id} style={{ background: C.card, border: `1px solid ${t.type === "danger" ? C.danger : C.success}50`, borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, boxShadow: SHADOW, animation: "slideIn 0.3s cubic-bezier(0.25, 1, 0.5, 1)" }}>
        {t.type === "danger" ? <div style={{background: C.danger+"20", padding: 6, borderRadius: "50%"}}><X size={16} color={C.danger} strokeWidth={3}/></div> : <div style={{background: C.success+"20", padding: 6, borderRadius: "50%"}}><Check size={16} color={C.success} strokeWidth={3}/></div>}
        <span style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{t.msg}</span>
      </div>
    ))}
  </div>
);

/* ── COMPONENT KHUNG GIAO DIỆN (SHELL) ── */
function MainLayout({ user, onLogout }) {
  const location = useLocation();
  const currentTab = location.pathname.substring(1) || "dashboard";
  
  // Tạm thời đếm số lượng đơn chờ từ INITIAL_DATA (Sau này LeavesView sẽ tự lấy)
  const pendingLeavesCount = INITIAL_DATA.leaves.filter(l => l.status === "Cho_Duyet").length;

  // CHỐNG CRASH 1: Phục hồi biến toasts để giao diện không bị sập
  const [toasts, setToasts] = useState([]);

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, overflow: "hidden" }}>
      {/* CHỐNG CRASH 2: Truyền hàm rỗng setTab={() => {}} đề phòng Sidebar cũ của bạn chưa cập nhật */}
      <Sidebar tab={currentTab} setTab={() => {}} user={user} onLogout={onLogout} pendingLeavesCount={pendingLeavesCount} />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        <Header tab={currentTab} />
        
        <div style={{ flex: 1, overflowY: "auto", padding: "40px" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            {/* ── BỘ ĐIỀU HƯỚNG ROUTES ── */}
            <Routes>
              {/* Tự động chuyển hướng / sang /dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Trang Dashboard & Leaves tạm thời dùng dữ liệu tĩnh trong lúc chờ nối API */}
              <Route path="/dashboard" element={<DashboardView leaves={INITIAL_DATA.leaves} finance={INITIAL_DATA.finance} data={{ houses: [], members: [] }} />} />
              <Route path="/leaves" element={<LeavesView leaves={INITIAL_DATA.leaves} />} />
              
              {/* CÁC TRANG ĐÃ TỰ ĐỘNG NỐI API */}
              <Route path="/houses" element={<HousesView />} />
              <Route path="/members" element={<MembersView />} />
              {/* CHỐNG CRASH 3: Truyền dữ liệu dự phòng để trang Finance không bị sập nếu bạn chưa kịp chép API vào */}
              <Route path="/finance" element={<FinanceView finance={INITIAL_DATA.finance} onApproveFinance={() => {}} />} />
            </Routes>
          </div>
        </div>
      </div>
      
      <Toasts toasts={toasts} />
    </div>
  );
}

/* ── COMPONENT GỐC QUẢN LÝ ĐĂNG NHẬP ── */
export default function AdminDashboard() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("daminh_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.backgroundColor = C.bg;
    document.body.style.fontFamily = "'Inter', sans-serif";
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("daminh_token");
    localStorage.removeItem("daminh_user");
    setUser(null);
  };

  if (!user) return <LoginView onLoginSuccess={(userData) => setUser(userData)} />;

  return (
    <BrowserRouter>
      <MainLayout user={user} onLogout={handleLogout} />
    </BrowserRouter>
  );
}