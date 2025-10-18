import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { me } from "../services/authService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        const token = await getUserToken();
        try {
            const userDoc = await me(token);
            if (userDoc) {
              setUser(currentUser);
              setUserData(userDoc.data)
            } else {
              setUser(null);
              setUserData(null);
            }
        } catch (error) {
          setUser(null);
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getUserToken = useCallback(async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  }, []);

  const withToken = useCallback(async (service) => {
    const token = await getUserToken();
    return service(token);
  }, [getUserToken]);

  const value = {
    user,
    userData,
    loading,
    isAuthenticated: !!user,
    isAdmin: userData?.role === "admin",
    isEmployee: userData?.role === "employee",
    getUserToken,
    withToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;