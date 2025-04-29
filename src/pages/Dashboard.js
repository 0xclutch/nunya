import { Button } from "antd";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../components/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // Use the logout function from AuthContext
    navigate("/");
  };

  const accessLicense = () => {
    navigate('/id');
  }

  return (
    <div>
      <h2>Welcome, {user?.email}</h2>
      <button onClick={handleLogout}>Logout</button>
      <Button onClick={accessLicense}>Driver License</Button>
    </div>
  );
}
