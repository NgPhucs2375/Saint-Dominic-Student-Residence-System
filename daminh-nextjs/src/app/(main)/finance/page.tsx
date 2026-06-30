'use client';

import React, { useState } from "react";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { C, SHADOW } from "@/src/core/theme";

const fmtFull = (n: number) => n.toLocaleString("vi-VN") + " ₫";
const MONTHLY = [
  { month: "T1", thu: 1200000, chi: 380000 }, { month: "T2", thu: 980000, chi: 620000 },
  { month: "T3", thu: 1450000, chi: 410000 }, { month: "T4", thu: 1100000, chi: 780000 }
];

type FinanceItem = {
  id: number;
  type: "Thu" | "Chi";
  amount: number;
  desc: string;
  house: string;
  status: "Hoan_Thanh" | "Cho_Duyet";
  date: string;
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

type StatusBadgeProps = {
  status: FinanceItem["status"];
};

const GoldBtn = ({ children, onClick }: ButtonProps) => <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, background: C.gold, color: "#FFF", border: "none", padding: "10px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>{children}</button>;
const SectionHead = ({ title, sub, action }: SectionHeadProps) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, margin: 0, fontFamily: "Cinzel,serif" }}>{title}</h2><p style={{ color: C.muted, fontSize: 13, margin: "4px 0 0" }}>{sub}</p></div>{action}</div>;
const StatusBadge = ({ status }: StatusBadgeProps) => {
  const m: Record<string, [string, string]> = { Hoan_Thanh: ["Hoàn thành", C.success], Cho_Duyet: ["Chờ duyệt", C.warn] };
  const [label, color] = m[status] || [status, C.muted];
  return <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: color + "1A", color, border: `1px solid ${color}35` }}>{label}</span>;
};

const CustomTip = (props: unknown) => {
  const { active, payload, label } = props as {
    active?: boolean;
    payload?: Array<{ value?: number }>;
    label?: string | number;
  };

  if (!active || !payload?.length) return null;

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", boxShadow: SHADOW }}>
      <div style={{ color: C.text, fontWeight: 700, marginBottom: 8 }}>{label}</div>
      <div style={{ color: C.success, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Thu: {fmtFull(payload[0]?.value || 0)}</div>
      <div style={{ color: C.danger, fontSize: 13, fontWeight: 600 }}>Chi: {fmtFull(payload[1]?.value || 0)}</div>
    </div>
  );
};

export default function FinancePage() {
  const [finance] = useState<FinanceItem[]>([
    { id: 1, type: "Thu", amount: 1500000, desc: "Thu quỹ tháng", house: "Nhà Giuse", status: "Hoan_Thanh", date: "10/06/2026" },
    { id: 2, type: "Chi", amount: 500000, desc: "Sửa chữa", house: "Nhà Micae", status: "Cho_Duyet", date: "12/06/2026" },
  ]);

  const totalIncome = finance.filter(f => f.type === "Thu" && f.status === "Hoan_Thanh").reduce((s, f) => s + f.amount, 0);
  const totalExpense = finance.filter(f => f.type === "Chi" && f.status === "Hoan_Thanh").reduce((s, f) => s + f.amount, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionHead title="Tài chính & Sổ Quỹ" sub={`Ghi nhận biến động giao dịch`} action={<GoldBtn><Plus size={16} strokeWidth={3} /> Lập phiếu mới</GoldBtn>} />
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
        {[{ label: "Tổng quỹ", value: fmtFull(totalIncome - totalExpense), c: C.blue }, { label: "Thu tháng", value: fmtFull(totalIncome), c: C.success }, { label: "Chi tháng", value: fmtFull(totalExpense), c: C.danger }].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 28px", boxShadow: SHADOW }}>
            <div style={{ color: C.muted, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{s.label}</div>
            <div style={{ color: s.c, fontSize: 28, fontWeight: 800 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, boxShadow: SHADOW }}>
        <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 24, fontFamily: "Cinzel,serif" }}>Biểu đồ thu chi 4 tháng gần nhất</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={MONTHLY} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000000).toFixed(1) + "M"} />
            <Tooltip content={CustomTip} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
            <Bar dataKey="thu" fill={C.success} radius={[6, 6, 0, 0]} maxBarSize={32} />
            <Bar dataKey="chi" fill={C.danger} radius={[6, 6, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", boxShadow: SHADOW }}>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 980, borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: `2px solid ${C.border}`, background: C.bg }}>{["Loại", "Mô tả", "Nhà", "Số tiền", "Trạng thái", "Thao tác"].map(h => <th key={h} style={{ padding: "16px 24px", textAlign: "left", color: C.muted, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>)}</tr></thead>
          <tbody>
            {finance.map(f => (
              <tr key={f.id} style={{ borderBottom: `1px solid ${C.border}`, transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = C.cardHov} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "18px 24px" }}><span style={{ fontSize: 12, fontWeight: 800, padding: "6px 12px", borderRadius: 8, display: "inline-flex", gap: 6, background: (f.type === "Thu" ? C.success : C.danger) + "15", color: f.type === "Thu" ? C.success : C.danger }}>{f.type === "Thu" ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {f.type}</span></td>
                <td style={{ padding: "18px 24px", color: C.text, fontSize: 14, fontWeight: 600 }}>{f.desc}<div style={{ color: C.muted, fontSize: 12, marginTop: 4, fontWeight: 500 }}>{f.date}</div></td>
                <td style={{ padding: "18px 24px", color: C.text, fontSize: 14, fontWeight: 600 }}>{f.house}</td>
                <td style={{ padding: "18px 24px", color: f.type === "Thu" ? C.success : C.danger, fontSize: 15, fontWeight: 800 }}>{f.type === "Thu" ? "+" : "-"}{fmtFull(f.amount)}</td>
                <td style={{ padding: "18px 24px" }}><StatusBadge status={f.status} /></td>
                <td style={{ padding: "18px 24px" }}>{f.status === "Cho_Duyet" && <button style={{ background: "transparent", border: `1px solid ${C.success}60`, color: C.success, padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, transition: "0.2s" }}>Duyệt phiếu</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}