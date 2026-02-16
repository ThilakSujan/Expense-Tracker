import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import "./App.css";


function App() {
  const { currentUser } = useAuth();
  console.log(currentUser);


  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? <Dashboard /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
