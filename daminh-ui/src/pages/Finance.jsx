import React from "react";
import { Plus, TrendingUp, TrendingDown, Check } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { C, SHADOW } from "../config/theme";
const fmtFull = n => n.toLocaleString("vi-VN") + " ₫";

const MONTHLY = [
  { month: "T1", thu: 1200000, chi: 380000 }, { month: "T2", thu: 980000, chi: 620000 },
  { month: "T3", thu: 1450000, chi: 410000 }, { month: "T4", thu: 1100000, chi: 780000 },
  { month: "T5", thu: 1680000, chi: 520000 }, { month: "T6", thu: 1550000, chi: 550000 }
];

const GoldBtn = ({ children, onClick }) => (
  <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, background: C.gold, color: "#000", border: "none", padding: "10px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>{children}</button>
);

const SectionHead = ({ title, sub, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div><h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, margin: 0, fontFamily: "Cinzel,serif" }}>{title}</h2><p style={{ color: C.muted, fontSize: 13, margin: "4px 0 0" }}>{sub}</p></div>
    {action}
  </div>
);

const StatusBadge = ({ status }) => {
  const m = { Hoan_Thanh: ["Hoàn thành", C.success], Cho_Duyet: ["Chờ duyệt", C.warn] };
  const [label, color] = m[status] || [status, C.muted];
  return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: color + "1A", color, border: `1px solid ${color}35` }}>{label}</span>;
};

export default function FinanceView({ finance, onApproveFinance }) {
  const CustomTip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ color: C.text, fontWeight: 600, marginBottom: 8 }}>{label}</div>
        <div style={{ color: C.blue, fontSize: 12, marginBottom: 4 }}>Thu: {fmtFull(payload[0]?.value || 0)}</div>
        <div style={{ color: C.danger, fontSize: 12 }}>Chi: {fmtFull(payload[1]?.value || 0)}</div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHead title="Tài chính & Quỹ" sub="Sổ quỹ và phê duyệt phiếu thu chi" action={<GoldBtn><Plus size={15} /> Lập phiếu mới</GoldBtn>} />
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {[{ label: "Tổng quỹ", value: "15,420,000 ₫", c: C.success }, { label: "Thu tháng", value: "1,550,000 ₫", c: C.blue }, { label: "Chi tháng", value: "550,000 ₫", c: C.danger }].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ color: C.muted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{s.label}</div>
            <div style={{ color: s.c, fontSize: 20, fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <h3 style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 20, fontFamily: "Cinzel,serif" }}>Biểu đồ thu chi 6 tháng</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={MONTHLY} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000000).toFixed(1) + "M"} />
            <Tooltip content={<CustomTip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Bar dataKey="thu" fill={C.blue} radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="chi" fill={C.danger} radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{["Loại", "Mô tả", "Nhà", "Số tiền", "Trạng thái", ""].map(h => <th key={h} style={{ padding: "12px 18px", textAlign: "left", color: C.muted, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>
            {finance.map(f => (
              <tr key={f.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "13px 18px" }}><span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, display: "inline-flex", gap: 4, background: (f.type === "Thu" ? C.success : C.danger) + "1A", color: f.type === "Thu" ? C.success : C.danger }}>{f.type === "Thu" ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {f.type}</span></td>
                <td style={{ padding: "13px 18px", color: C.text, fontSize: 13, fontWeight: 500 }}>{f.desc}</td>
                <td style={{ padding: "13px 18px", color: C.muted, fontSize: 13 }}>{f.house}</td>
                <td style={{ padding: "13px 18px", color: f.type === "Thu" ? C.success : C.danger, fontSize: 13, fontWeight: 700 }}>{f.type === "Thu" ? "+" : "-"}{fmtFull(f.amount)}</td>
                <td style={{ padding: "13px 18px" }}><StatusBadge status={f.status} /></td>
                <td style={{ padding: "13px 18px", textAlign: "right" }}>{f.status === "Cho_Duyet" && <button onClick={() => onApproveFinance(f.id)} style={{ background: "transparent", border: `1px solid ${C.success}50`, color: C.success, padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>Duyệt</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}