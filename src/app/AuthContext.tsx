"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { setUser, clearUser } from "@/lib/userSlice";
import { initializeAxiosWithToken } from "@/lib/axiosinstance";
import { auth } from "@/config/firebaseConfig";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Get user data from cookies (set during login)
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    
    const storedUser = getCookie("user");
    const storedToken = getCookie("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUserState(parsedUser);
      initializeAxiosWithToken(storedToken);
      dispatch(setUser(parsedUser));
      setLoading(false);
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const accessToken = await firebaseUser.getIdToken();
        const claims = await firebaseUser.getIdTokenResult();
        
        // Extract only serializable data from Firebase user
        const serializableUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          type: claims.claims.type,
        };
        
        localStorage.setItem("user", JSON.stringify(serializableUserData));
        localStorage.setItem("token", accessToken);
        setUserState(firebaseUser);
        initializeAxiosWithToken(accessToken);
        dispatch(setUser(serializableUserData));
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUserState(null);
        dispatch(clearUser());
        router.replace("/auth/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
