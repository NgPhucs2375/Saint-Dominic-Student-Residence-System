import React, { useState } from "react";
import { AuthService } from "../services/authService";

import { C, SHADOW } from "../config/theme";

export default function RegisterView({ onRegisterSuccess }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(4); // Mặc định là 4 (TV - Thành viên) theo Enum trong C#
  const [houseId, setHouseId] = useState("");
  
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setIsError(false);

    if (!fullName || !email || !password || !houseId) {
      setMsg("Vui lòng điền đầy đủ các trường bắt buộc.");
      setIsError(true);
      return;
    }

    // Đóng gói đúng cấu trúc RegisterRequest của C#
    const payload = {
      fullName,
      email,
      password,
      role: parseInt(role),
      houseId: parseInt(houseId)
    };

    try {
      setLoading(true);
      const response = await AuthService.register(payload);
      
      // Kiểm tra ApiResponse chuẩn từ Backend
      if (response.success || response.Success) {
        setMsg(response.message || "Tạo tài khoản thành viên thành công!");
        // Reset form
        setFullName(""); setEmail(""); setPassword(""); setHouseId("");
        if (onRegisterSuccess) onRegisterSuccess();
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMsg(err.response?.data?.message || "Lỗi phân quyền: Chỉ cấp quyết định (Cha OB) mới có quyền thực hiện.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, maxWidth: 600, margin: "0 auto", boxShadow: "0 4px 20px -2px rgba(0,0,0,0.02)" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, fontFamily: "Cinzel,serif", margin: 0 }}>Cấp tài khoản mới</h2>
        <p style={{ color: C.muted, fontSize: 13, margin: "4px 0 0" }}>Tạo thông tin định danh và phân bổ phòng lưu trú cho sinh viên</p>
      </div>

      {msg && (
        <div style={{ 
          background: isError ? C.danger + "10" : C.success + "10", 
          border: `1px solid ${isError ? C.danger : C.success}40`, 
          color: isError ? C.danger : C.success, 
          padding: "12px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, marginBottom: 24 
        }}>
          {isError ? "⚠️ " : "✓ "} {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ display: "block", color: C.text, fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Họ và Tên</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nguyễn Văn A"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, outline: "none" }}/>
          </div>
          <div>
            <label style={{ display: "block", color: C.text, fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Mã Nhà (House ID)</label>
            <input type="number" value={houseId} onChange={e => setHouseId(e.target.value)} placeholder="Ví dụ: 1"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, outline: "none" }}/>
          </div>
        </div>

        <div>
          <label style={{ display: "block", color: C.text, fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Email đăng ký</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="sinhvien@daminh.com"
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, outline: "none" }}/>
        </div>

        <div>
          <label style={{ display: "block", color: C.text, fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Mật mã khởi tạo</label>
          <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Đặt mật khẩu mặc định"
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, outline: "none" }}/>
        </div>

        <div>
          <label style={{ display: "block", color: C.text, fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Vai trò (Role Enum)</label>
          <select value={role} onChange={e => setRole(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, outline: "none", cursor: "pointer" }}>
            <option value={1}>Trưởng Nhà (TN)</option>
            <option value={2}>Phó Nhà (PN)</option>
            <option value={3}>Quản Lý (QL)</option>
            <option value={4}>Thành Viên (TV)</option>
          </select>
        </div>

        <button type="submit" disabled={loading} style={{ background: C.borderDark, color: "#FFF", padding: "12px", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "0.2s", marginTop: 8 }}
          onMouseEnter={e => e.currentTarget.style.background = "#000"} onMouseLeave={e => e.currentTarget.style.background = C.borderDark}>
          {loading ? "Đang đồng bộ lệnh xuống .NET..." : "Kích hoạt tài khoản"}
        </button>
      </form>
    </div>
  );
}


