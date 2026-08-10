import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { auth, googleProvider } from "@/lib/firebase";
import { getRedirectResult, signOut } from "firebase/auth";
import { toast } from "sonner";

export interface CommunityUser {
  id: string;
  firebase_uid: string;
  username: string;
  email: string;
  platformRole: string;
  trustLevel: number;
  status: string;
  emailVerified: boolean;
  avatar_url?: string | null;
  cover_image?: string | null;
  display_name?: string | null;
}

interface AuthContextType {
  user: CommunityUser | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<CommunityUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CommunityUser | null>(null);
  const [loading, setLoading] = useState(true);
  const authInitializedRef = useRef(false);

  const checkAuth = async () => {
    console.log("[EXECUTION TRACE] STEP 7: Before calling /api/community/auth/me");
    try {
      const res = await fetch('/api/community/auth/me');
      if (res.ok) {
        const data = await res.json();
        console.log(`[EXECUTION TRACE] STEP 8: After auth/me | Status: ${res.status} | Response:`, data);
        if (data.authenticated && data.user) {
          console.log("[EXECUTION TRACE] STEP 9: Before setUser() (SUCCESS)");
          setUser(data.user);
        } else {
          console.log("[EXECUTION TRACE] STEP 9: Before setUser(null) (NO USER)");
          setUser(null);
        }
      } else {
        console.log(`[EXECUTION TRACE] STEP 8: After auth/me | Status: ${res.status} | OK: false`);
        setUser(null);
      }
    } catch (err) {
      console.error('[AuthContext] checkAuth error:', err);
      setUser(null);
    } finally {
      console.log("[EXECUTION TRACE] STEP 10: Setting loading to false");
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await fetch('/api/community/auth/logout', { method: 'POST' });
      setUser(null);
      toast.success("Logged out successfully");
    } catch (err) {
      console.error('[AuthContext] logout error:', err);
      toast.error("Failed to logout securely");
    }
  };

  useEffect(() => {
    if (authInitializedRef.current) return;
    authInitializedRef.current = true;

    const handleInitialAuth = async () => {
      await checkAuth();
    };

    handleInitialAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
