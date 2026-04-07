import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux_slice/UserSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("الرجاء إدخال رقم الهاتف أو كلمة المرور");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/login", { password });
      if (res.data.success) {
        dispatch(loginUser({ username: res.data.username, role: res.data.role }));
        if (res.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/players");
        }
      }
    } catch (err) {
      setError("رقم الهاتف أو كلمة المرور غير صحيحة");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">♠♥♦♣</div>
        <h1 className="login-title">♠  بوكر</h1>
        <p className="login-subtitle">أدخل رقم هاتفك أو كلمة مرور المدير</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="login-input"
            placeholder="رقم الهاتف / كلمة مرور المدير"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
