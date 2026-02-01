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
        localStorage.removeItem("session"); // Fixed key name
      }
    });


    return () => authListener.subscription.unsubscribe();
  }, []);

  const saveCachedSignature = async (file) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    try {
      // Get current session to ensure we have a valid token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      
      if (sessionError || !session) {
        throw new Error('Not authenticated - please log in again');
      }

      const filePath = `public/${session.user.id}.png`;
      
      console.log('Uploading signature for user:', session.user.id);
      
      // Upload with upsert to replace existing file
      const { data, error } = await supabase.storage
        .from('user-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/png'
        });
                
      if (error) {
        console.error('Error uploading signature:', error);
        throw error;
      }
      
      console.log('Signature uploaded successfully:', data);
      return data;
    } catch (err) {
      console.error('saveCachedSignature failed:', err);
      throw err;
    }
  }

  const fetchUserData = async (uuid, forceRefresh = false) => { // Database info
    // Check if we already have cached data and don't force refresh
    if (!forceRefresh && userData && userData.uuid === uuid) {
      return userData; // Already have this user's data
    }

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
      return reqDB;
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
    <AuthContext.Provider value={{ user, userData, login, logout, loading, isAuthenticated, saveCachedSignature }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
