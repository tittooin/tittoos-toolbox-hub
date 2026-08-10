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

    const isGoogleRedirect = sessionStorage.getItem('ax_google_redirect') === '1';

    const handleInitialAuth = async () => {
      if (isGoogleRedirect) {
        try {
          console.log("[AuthContext] Awaiting getRedirectResult...");
          const result = await getRedirectResult(auth);
          console.log("[AuthContext] getRedirectResult returned:", result);

          if (result && result.user) {
            console.log("[AuthContext] User found in redirect result. Fetching ID token...");
            const firebaseIdToken = await result.user.getIdToken();
            console.log("[AuthContext] ID token fetched. Sending POST request to backend...");
            const res = await fetch('/api/community/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ firebaseIdToken })
            });

            const data = await res.json();
            sessionStorage.removeItem('ax_google_redirect');

            if (res.ok && data.success) {
              await checkAuth();
              toast.success("Authenticated with Google successfully!");
            } else {
              await signOut(auth);
              toast.error(data.error || "Google authentication failed.");
              await checkAuth();
            }
          } else {
            sessionStorage.removeItem('ax_google_redirect');
            await checkAuth();
          }
        } catch (err: any) {
          sessionStorage.removeItem('ax_google_redirect');
          try { await signOut(auth); } catch (_) {}
          toast.error(err?.message || "Google authentication failed.");
          await checkAuth();
        }
      } else {
        await checkAuth();
      }
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
