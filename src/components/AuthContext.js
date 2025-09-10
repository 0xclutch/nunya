import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // Track userData here
  const [loading, setLoading] = useState(true);


  const isAuthenticated = !!user; // Check if user is authenticated

  useEffect(() => {

    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const activeUser = session?.user || null;
      setUser(activeUser);

      const stored = localStorage.getItem('session');
      if(stored) {
        setUserData(JSON.parse(stored));
      }

      // user but no userData yet, fetch it
      if(activeUser && !stored) {
        await fetchUserData(activeUser.id);
      }

      setLoading(false); 
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const loggedInUser = session?.user || null;
      
      setUser(loggedInUser);

      if(loggedInUser) {
        fetchUserData(loggedInUser.id);
      } else {
        setUserData(null); // Clear userData on logout
        localStorage.removeItem("userData");
      }
    });


    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchUserData = async (uuid) => { // Database info
    try {
      const { data: reqDB, error } = await supabase
        .from("users")
        .select("*")
        .eq("uuid", uuid)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }

      setUserData(reqDB); // Store data in context as well
      localStorage.setItem("session", JSON.stringify(reqDB)); // Ensure data is being saved correctly
    } catch (error) {
      console.error("Critical error fetching user data:", error);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw error;
      }

      setUser(data.user);
      await fetchUserData(data.user.id); // Fetch user data after login

      setLoading(false);
      return data.user;
    } catch (err) {
      setLoading(false);
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserData(null); // Clear userData on logout
    localStorage.removeItem("session");
  };



  return (
    <AuthContext.Provider value={{ user, userData, login, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
