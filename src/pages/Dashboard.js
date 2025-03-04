import { useAuth } from "../components/AuthContext";
import { supabase } from "../components/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("session");
    setUser(null);
    navigate("/");
  };

  return (
    <div>
      <h2>Welcome, {user?.email}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
