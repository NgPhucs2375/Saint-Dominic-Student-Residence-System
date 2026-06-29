import React, { useState } from "react";
import { AuthService } from "../services/authService";
import { C, SHADOW } from "../config/theme";

export default function LoginView({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(false);

    if (!email || !password) {
      setError("Vui lòng điền đầy đủ thông tin tài khoản.");
      return;
    }

    try {
      setLoading(true);
      // Gọi sang lớp Service bắn request qua .NET
      const response = await AuthService.login(email, password);
      
      // Khắc phục: Đón lỏng JSON do ASP.NET tự động ép về camelCase (token, user)
      const jwtToken = response.token || response.Token;
      const userData = response.user || response.User;
      
      if (jwtToken) {
        localStorage.setItem("daminh_token", jwtToken);
        localStorage.setItem("daminh_user", JSON.stringify(userData));
        
        // Kích hoạt hàm báo hiệu cho App.jsx biết để chuyển trang
        onLoginSuccess(userData);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data || "Sai tên đăng nhập hoặc mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", alignItems: "center", justifyContent: "center", background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: 400, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "40px 32px", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.04)" }}>
        
        {/* Logo Icon */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 44, background: C.borderDark, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 900, fontSize: 24, fontFamily: "Cinzel,serif", marginBottom: 16 }}>✝</div>
          <h1 style={{ color: C.text, fontSize: 24, fontWeight: 700, fontFamily: "Cinzel,serif", margin: 0, letterSpacing: "-0.02em" }}>Đa Minh Ledger</h1>
          <p style={{ color: C.muted, fontSize: 13, margin: "6px 0 0", fontWeight: 500 }}>Hệ thống quản lý lưu xá tối giản</p>
        </div>

        {error && (
          <div style={{ background: C.danger + "10", border: `1px solid ${C.danger}40`, color: C.danger, padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", color: C.text, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Email Hệ thống</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@daminh.com"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, outline: "none", transition: "border-color 0.2s", fontWeight: 500 }}
              onFocus={e => e.currentTarget.style.borderColor = C.borderDark} onBlur={e => e.currentTarget.style.borderColor = C.border} />
          </div>

          <div>
            <label style={{ display: "block", color: C.text, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Mật mã</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, outline: "none", transition: "border-color 0.2s", fontWeight: 500 }}
              onFocus={e => e.currentTarget.style.borderColor = C.borderDark} onBlur={e => e.currentTarget.style.borderColor = C.border} />
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%", background: C.borderDark, color: "#FFF", padding: "14px", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer", marginTop: 8, transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#000"} onMouseLeave={e => e.currentTarget.style.background = C.borderDark}>
            {loading ? "Đang xác thực thông tin..." : "Đăng nhập vào hệ thống"}
          </button>
        </form>
      </div>
    </div>
  );
}