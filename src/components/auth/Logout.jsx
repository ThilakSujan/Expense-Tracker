import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const logoutStyle = {
    padding: "10px 18px",
    background: "linear-gradient(135deg, #ff4d4d, #e60000)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease",
  };

  return (
    <button
      style={logoutStyle}
      onClick={handleLogout}
      onMouseOver={(e) => {
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = "0 6px 14px rgba(0,0,0,0.25)";
      }}
      onMouseOut={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
