import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import CalendarView from "./pages/CalendarView";
import "./App.css";
import "./styles/CalendarSettings.css";
function App() {
  const { currentUser } = useAuth();
<<<<<<< HEAD
  console.log(currentUser);
=======
>>>>>>> c56b658 (Altered Database and Authentication)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? <Dashboard /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/settings"
          element={
            currentUser ? <Settings /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/calendar"
          element={
            currentUser ? <CalendarView /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
