import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/auth/Login.css";

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      if (isLoginView) {
        await login(email, password);
        navigate("/");
      } else {
        await register(email, password);
        alert("Account created! You can now log in.");
        setIsLoginView(true);
        setPassword("");
      }
    } catch (err) {
      setError(isLoginView ? "Invalid email or password. Please try again." : "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Decorative background elements */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <svg className="app-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <h1 className="app-title">ExpenseTracker</h1>
          <p className="app-subtitle">
            Manage your finances with clarity and ease.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="form-title">
            {isLoginView ? "Welcome Back" : "Create an Account"}
          </h2>
          
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              isLoginView ? "Sign In" : "Sign Up"
            )}
          </button>
        </form>

        <div className="toggle-view">
          <p>
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button" 
              className="toggle-button" 
              onClick={() => {
                setIsLoginView(!isLoginView);
                setError("");
              }}
            >
              {isLoginView ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="footer-note">
          <svg className="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Secure • Private • Cloud Synced
        </p>
      </div>
    </div>
  );
};

export default Login;
