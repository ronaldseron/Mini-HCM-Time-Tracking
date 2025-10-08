import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        try {
          // Fetch user data from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser(firebaseUser);
            setUserData({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...data
            });
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

    return unsubscribe;
  }, []);

  const getUserToken = async () => {
    const { currentUser } = auth;
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  }

  const value = {
    user,
    userData,
    loading,
    isAuthenticated: !!user,
    isAdmin: userData?.role === 'admin',
    isEmployee: userData?.role === 'employee',
    getUserToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;