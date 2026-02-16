import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/auth/Login.css";

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch {
      alert("Login failed");
    }
  };

  const handleRegister = async () => {
    try {
      await register(email, password);
      alert("Account created! Now login.");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1 className="app-title">Expense Tracker</h1>
        <p className="app-subtitle">
          Manage your income & expenses with clarity.
        </p>

        <h2 className="login-title">Welcome Back 👋</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button onClick={handleRegister} className="register-button">
          Create Account
        </button>

        <p className="footer-note">
          Secure • Private • Cloud Synced
        </p>

      </div>
    </div>
  );


};

export default Login;
