'use client';

import React, { useEffect, useState } from "react";
import { Home, Users, CalendarOff, Wallet, Trophy } from "lucide-react";
import { C, SHADOW, SHADOW_HOV } from "@/src/core/theme";

const fmtM = (n: number) => (n / 1_000_000).toFixed(1) + "M ₫";
const fmtDate = () => new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" });

type House = {
  id: number;
  name: string;
  members: number;
  cap: number;
  fund: number;
  color: string;
};

type Member = {
  id: number;
  name: string;
  house: string;
  pts: number;
};

type DashboardData = {
  houses: House[];
  members: Member[];
  pendL: number;
  pendF: number;
  totalFund: number;
};

/* ── Custom Hook Số Nhảy ── */
const useCountUp = (target: number, duration = 1200) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
};

/* ── UI Components ── */
const Ring = ({ value, max, color, size = 68 }: { value: number; max: number; color: string; size?: number }) => {
  const [anim, setAnim] = useState(false);
  const r = (size - 12) / 2, circ = 2 * Math.PI * r;
  useEffect(() => { const t = setTimeout(() => setAnim(true), 80); return () => clearTimeout(t); }, []);
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth="6" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={circ} strokeDashoffset={anim ? circ * (1 - value / max) : circ} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.25, 1, 0.5, 1)" }} />
    </svg>
  );
};

const Avatar = ({ name, size = 44 }: { name: string; size?: number }) => {
  const init = name ? name.trim().split(" ").slice(-1)[0][0] : "U";
  const AC = [C.blue, C.gold, C.success, C.purple, C.danger];
  const color = AC[(name ? name.charCodeAt(0) : 0) % 5];
  return <div style={{ width: size, height: size, borderRadius: 12, background: color + "15", border: `1px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: 16, fontWeight: 800, flexShrink: 0 }}>{init}</div>;
};

const StatCard = ({ label, value, sub, color, Icon }: { label: string; value: number; sub: string; color: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }) => {
  const counted = useCountUp(value);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "28px 32px", display: "flex", alignItems: "center", gap: 20, transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)", boxShadow: SHADOW, cursor: "default" }}
         onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = SHADOW_HOV; e.currentTarget.style.borderColor = color + "60"; }}
         onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = SHADOW; e.currentTarget.style.borderColor = C.border; }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
        <Icon size={26} strokeWidth={2} />
      </div>
      <div>
        <div style={{ color: C.muted, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{label}</div>
        <div style={{ color: C.text, fontSize: 36, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>{counted}{label === "Tổng quỹ" ? " ₫" : ""}</div>
        <div style={{ color: C.muted, fontSize: 13, marginTop: 6, fontWeight: 500 }}>{sub}</div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [data] = useState<DashboardData>({
    houses: [
      { id: 1, name: "Nhà Giuse", members: 12, cap: 15, fund: 3200000, color: C.blue },
      { id: 2, name: "Nhà Micae", members: 10, cap: 12, fund: 2800000, color: C.gold },
      { id: 3, name: "Nhà Phêrô", members: 9, cap: 12, fund: 3100000, color: C.success }
    ],
    members: [
      { id: 1, name: "Nguyễn Văn An", house: "Nhà Giuse", pts: 95 },
      { id: 2, name: "Trần Thị Bình", house: "Nhà Micae", pts: 88 }
    ],
    pendL: 3,
    pendF: 2,
    totalFund: 9100000
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Banner Chào mừng khổng lồ */}
      <div style={{ background: `linear-gradient(135deg, ${C.card} 50%, ${C.goldLight}40)`, border: `1px solid ${C.border}`, borderRadius: 20, padding: "36px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: SHADOW, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ color: C.gold, fontSize: 14, marginBottom: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>✝ {fmtDate()}</div>
          <h2 style={{ color: C.text, fontSize: 36, fontWeight: 700, margin: 0, fontFamily: "Cinzel,serif", letterSpacing: "-0.02em" }}>Xin chào, Quản Trị Viên</h2>
          <p style={{ color: C.muted, fontSize: 16, margin: "10px 0 0", fontWeight: 500 }}>
            Hệ thống phân tích đã đồng bộ hoàn tất. 
            {(data.pendL + data.pendF) > 0 && <span style={{ color: C.warn, fontWeight: 600 }}> · Có {data.pendL + data.pendF} mục chờ xử lý</span>}
          </p>
        </div>
        <div style={{ position: "absolute", right: -20, top: -40, opacity: 0.04, fontSize: 240, fontFamily: "Cinzel,serif", lineHeight: 1, color: C.gold, zIndex: 1, pointerEvents: "none", transform: "rotate(15deg)" }}>✝</div>
      </div>

      {/* 4 Khối Thống kê Siêu to */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
        <StatCard label="Số nhà" value={data.houses.length} sub="Đang hoạt động" color={C.blue} Icon={Home} />
        <StatCard label="Thành viên" value={data.members.length} sub="Toàn hệ thống" color={C.gold} Icon={Users} />
        <StatCard label="Chờ duyệt" value={data.pendL} sub="Đơn xin phép" color={C.warn} Icon={CalendarOff} />
        <StatCard label="Tổng quỹ" value={data.totalFund} sub="Toàn hệ thống" color={C.success} Icon={Wallet} />
      </div>

      {/* 2 Khối Nội dung dưới */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 36, boxShadow: SHADOW }}>
          <h3 style={{ color: C.text, fontSize: 20, fontWeight: 700, margin: "0 0 28px", fontFamily: "Cinzel,serif", letterSpacing: "-0.01em" }}>Tổng quan các Nhà</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {data.houses.map((h) => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 24, paddingBottom: 16, borderBottom: `1px dashed ${C.border}` }}>
                <Ring value={h.members} max={h.cap} color={h.color} size={68} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                    <span style={{ color: C.text, fontSize: 18, fontWeight: 700, fontFamily: "Cinzel,serif" }}>{h.name}</span>
                    <span style={{ color: h.color, fontSize: 16, fontWeight: 800 }}>{fmtM(h.fund)}</span>
                  </div>
                  <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(h.members / h.cap) * 100}%`, background: h.color, borderRadius: 3, transition: "width 1.5s cubic-bezier(0.25, 1, 0.5, 1)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 36, boxShadow: SHADOW, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ padding: 8, background: C.gold + "15", borderRadius: 10, color: C.gold }}><Trophy size={20} strokeWidth={2.5} /></div>
              <h3 style={{ color: C.text, fontSize: 20, fontWeight: 700, margin: 0, fontFamily: "Cinzel,serif", letterSpacing: "-0.01em" }}>Bảng Vàng RLN</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[...data.members].sort((a, b) => b.pts - a.pts).slice(0, 5).map((m, i) => {
                const mc = i === 0 ? C.gold : i === 1 ? "#A0A0A0" : i === 2 ? "#B87333" : C.muted;
                return (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", borderRadius: 14, background: C.bg, border: `1px solid ${C.border}`, transition: "transform 0.2s" }}
                       onMouseEnter={e => e.currentTarget.style.transform = "translateX(6px)"}
                       onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}>
                    <span style={{ fontSize: 16, fontWeight: 800, width: 24, textAlign: "center", color: mc }}>{i + 1}</span>
                    <Avatar name={m.name} size={48} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>{m.name}</span>
                        <span style={{ color: m.pts >= 80 ? C.success : C.warn, fontSize: 18, fontWeight: 800 }}>{m.pts}</span>
                      </div>
                      <div style={{ color: C.muted, fontSize: 12, marginTop: 4, fontWeight: 500 }}>{m.house}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}