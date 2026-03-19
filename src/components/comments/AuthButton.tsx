
import React, { useState } from 'react';
import { signInWithPopup, signInWithRedirect, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AuthButtonProps {
    user: User | null;
}

const AuthButton: React.FC<AuthButtonProps> = ({ user }) => {
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);

        // Add a safety timeout to reset the loading state if the login gets stuck
        // (common when popups are blocked or redirects are pending)
        const safetyTimer = setTimeout(() => {
            setLoading(false);
        }, 12000);

        try {
            // Force account selection to avoid using a stale or incorrect session
            googleProvider.setCustomParameters({ prompt: 'select_account' });
            
            // Attempt popup first as it's the smoothest UX
            await signInWithPopup(auth, googleProvider);
            toast.success("Signed in successfully!");
            clearTimeout(safetyTimer);
        } catch (error: any) {
            console.error("Error signing in", error);
            
            // Handle popup block/closure by falling back to redirect
            if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/popup-blocked') {
                toast.error("Popup missed or blocked. Redirecting to Google Login...", {
                    duration: 5000
                });
                
                try {
                    // Start the redirect - don't await here because navigation will happen
                    signInWithRedirect(auth, googleProvider).catch(reErr => {
                        console.error("Redirect fallback error", reErr);
                        setLoading(false);
                        clearTimeout(safetyTimer);
                    });
                } catch (err) {
                    setLoading(false);
                    clearTimeout(safetyTimer);
                }
            } else {
                toast.error(`Auth Error: ${error.message || 'Please try again'}`);
                setLoading(false);
                clearTimeout(safetyTimer);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    if (user) {
        return (
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium hidden sm:block">
                    {user.displayName}
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </div>
        );
    }

    return (
        <Button onClick={handleLogin} variant="outline" size="sm" className="gap-2" disabled={loading}>
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
            )}
            {loading ? "Signing in..." : "Sign in with Google"}
        </Button>
    );
};

export default AuthButton;
