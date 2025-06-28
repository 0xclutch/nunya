import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
// Usage example:
// <ProtectedRoute> 
//   <YourProtectedComponent />
// </ProtectedRoute>
// This component checks if the user is authenticated before rendering the children components.
// If not authenticated, it redirects to the login page ("/").
//   } catch (error) {
//       setLoading(false);
//       throw error;
//     }
//     setLoading(false);
//     return data.user;
//   };
//
//
//   const logout = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//     setUserData(null); // Clear userData on logout
//     localStorage.removeItem("userData");
//   };