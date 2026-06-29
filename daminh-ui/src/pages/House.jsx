import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { HouseService } from "../services/houseService"; // Đường dẫn đi ngược ra rồi vào thư mục services
import { C, SHADOW } from "../config/theme";
/* ── Thiết kế Design Tokens cục bộ để trang chạy độc lập ── */
const fmtM = n => (n / 1_000_000).toFixed(1) + "M ₫";

/* ── Các Component giao diện nhỏ của trang Nhà ── */
const Ring = ({ value, max, color, size = 56 }) => {
  const [anim, setAnim] = useState(false);
  const r = (size - 8) / 2, circ = 2 * Math.PI * r;
  useEffect(() => { const t = setTimeout(() => setAnim(true), 80); return () => clearTimeout(t); }, []);
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth="5" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={anim ? circ * (1 - value / max) : circ}
        strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }} />
      <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill={C.text} fontSize="10" fontWeight="600">
        {value}/{max}
      </text>
    </svg>
  );
};

const DarkBtn = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 8, background: C.borderDark, color: "#FFF",
    border: "none", padding: "10px 18px", borderRadius: 8, fontWeight: 600, fontSize: 13,
    cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "background 0.2s"
  }}
  onMouseEnter={e => e.currentTarget.style.background = "#000"}
  onMouseLeave={e => e.currentTarget.style.background = C.borderDark}>
    {children}
  </button>
);

const SectionHead = ({ title, sub, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div>
      <h2 style={{ color: C.text, fontSize: 22, fontWeight: 700, margin: 0, fontFamily: "Cinzel,serif", letterSpacing: "-0.02em" }}>{title}</h2>
      {sub && <p style={{ color: C.muted, fontSize: 13, margin: "4px 0 0" }}>{sub}</p>}
    </div>
    {action}
  </div>
);

/* ── COMPONENT CHÍNH ĐƯỢC XUẤT RA ── */
export default function HousesView() {
  const [housesReal, setHousesReal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Gọi lớp Service kết nối API Axios
    HouseService.getAllHouses()
      .then(response => {
        console.log("Đã kết nối thành công .NET API:", response);
        // Khớp với cấu trúc trả về: return Ok(new { CurrentUser = ..., Data = houses }) từ HousesController.cs
        setHousesReal(response.Data || response.data || []); 
      })
      .catch(error => {
        console.error("Lỗi luồng nạp dữ liệu nhà:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Tính toán tổng số lượng từ dữ liệu động của Database
  const total = {
    members: housesReal.reduce((s, h) => s + (h.numberOfMembers || 0), 0),
    cap: housesReal.reduce((s, h) => s + (h.cap || 15), 0), 
    fund: housesReal.reduce((s, h) => s + (h.fundBalance || 0), 0)
  };

  if (isLoading) {
    return <div style={{ color: C.muted, fontSize: 14, textAlign: "center", padding: "40px" }}>Đang thiết lập liên kết dữ liệu với Database .NET...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionHead title="Quản lý Nhà" sub={`${housesReal.length} nhà đang hoạt động thực tế`} action={<DarkBtn><Plus size={16} /> Tạo Nhà mới</DarkBtn>} />
      
      {/* Khối thống kê cấp cao */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[
          { label: "Tổng thành viên", value: `${total.members} người`, color: C.blue },
          { label: "Tổng sức chứa", value: `${total.cap} người`, color: C.purple },
          { label: "Tổng quỹ hệ thống", value: fmtM(total.fund), color: C.success },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px", boxShadow: SHADOW }}>
            <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: 24, fontWeight: 800 }}>{s.value}</div>
          </div>
        ))}
      </div>
      
      {/* Danh sách các Nhà render tự động từ Database */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
        {housesReal.map((h, index) => {
          const colors = [C.blue, C.warn, C.success, C.purple, C.danger];
          const hColor = colors[index % colors.length]; // Tự động xoay vòng màu sắc

          return (
            <div key={h.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, cursor: "pointer", transition: "all 0.2s", boxShadow: SHADOW }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderDark; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = ""; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: hColor }} />
                    <h3 style={{ color: C.text, fontSize: 18, fontWeight: 700, margin: 0, fontFamily: "Cinzel,serif" }}>{h.name}</h3>
                  </div>
                  <div style={{ color: C.muted, fontSize: 13, fontWeight: 500 }}>Trạng thái: <span style={{ color: C.text, fontWeight: 600 }}>{h.state || "Hoạt động"}</span></div>
                </div>
                <Ring value={h.numberOfMembers || 0} max={h.cap || 15} color={hColor} size={60} />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Thành viên", value: `${h.numberOfMembers || 0}/${h.cap || 15}`, color: C.text },
                  { label: "Quỹ nhà", value: fmtM(h.fundBalance || 0), color: C.success },
                ].map(s => (
                  <div key={s.label} style={{ background: C.bg, borderRadius: 8, padding: "12px 16px" }}>
                    <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{s.label}</div>
                    <div style={{ color: s.color, fontSize: 16, fontWeight: 800 }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

