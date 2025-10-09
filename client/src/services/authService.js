import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';


  export const register = async( name, email, password ) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(user, { displayName: name });
      }

      const token = await user.getIdToken();
      const userData = { name, email };

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
          headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        return { success: false, error: response.error };
      }
      const data = await response.json();

      return { success: true, data: data.newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  export const login = async(email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return { 
          success: true, 
          user: { uid: user.uid, ...userDoc.data() } 
        };
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  export const logout = async() => {
    try {
      const outSuccess = await signOut(auth);
      if (outSuccess) navigate("/login");

      return { success: true, message: "Logout Successfully!" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  export const getCurrentUser = () => {
    return auth.currentUser;
  };

//   async register( name, email, password ) {
//     try {
//       const { user } = await createUserWithEmailAndPassword(auth, email, password);
//       if (name) {
//         await updateProfile(user, { displayName: name });
//       }

//       const token = await user.getIdToken();
//       const userData = { name, email };

//       const response = await fetch(`${API_BASE_URL}/auth/register`, {
//         method: "POST",
//           headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": 'application/json'
//         },
//         body: JSON.stringify(userData),
//       });
      
//       if (!response.ok) {
//         return { success: false, error: response.error };
//       }
//       const data = await response.json();

//       return { success: true, data: data.newUser };
//     } catch (error) {
//       return { success: false, error: error.message };
//     }
//   },

//   async login(email, password) {
//     try {
//       const { user } = await signInWithEmailAndPassword(auth, email, password);

//       const userDocRef = doc(db, 'users', user.uid);
//       const userDoc = await getDoc(userDocRef);

//       if (userDoc.exists()) {
//         return { 
//           success: true, 
//           user: { uid: user.uid, ...userDoc.data() } 
//         };
//       } else {
//         throw new Error('User data not found');
//       }
//     } catch (error) {
//       return { success: false, error: error.message };
//     }
//   },

//   async logout() {
//     try {
//       await signOut(auth);
//       return { success: true };
//     } catch (error) {
//       return { success: false, error: error.message };
//     }
//   },

//   getCurrentUser() {
//     return auth.currentUser;
//   },
// };