import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, XCircle, Loader2, ArrowLeft, RefreshCw, Send } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    // 1. Fetch current logged-in identity to check if they can resend verification
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/community/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setCurrentUser(data.user);
          }
        }
      } catch (err) {
        console.error('Error fetching user context:', err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Verification token is missing. Please use the link sent to your email.');
      setErrorCode('MISSING_TOKEN');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch('/api/community/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
          setStatus('success');
          toast.success(data.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setErrorMessage(data.error || 'Verification link is invalid or expired.');
          setErrorCode(data.code || 'VERIFICATION_FAILED');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setErrorMessage('Failed to connect to the server. Please try again.');
        setErrorCode('NETWORK_ERROR');
      }
    };

    // Small timeout for polished visual feedback
    const timer = setTimeout(() => {
      verifyToken();
    }, 1500);

    return () => clearTimeout(timer);
  }, [token]);

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch('/api/community/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success(data.message || 'Verification email resent!');
      } else {
        toast.error(data.error || 'Failed to resend verification email.');
      }
    } catch (err) {
      toast.error('Network error. Please try again later.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
      <Header />
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-md border border-slate-200/80 bg-white rounded-3xl shadow-xl shadow-slate-100/50 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
          {/* Subtle Top Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
          
          <CardHeader className="pt-8 pb-4 text-center">
            <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
              Email Verification
            </CardTitle>
            <CardDescription className="text-slate-500 text-sm mt-1">
              Axevora Community Engine
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 sm:px-8 py-4">
            {status === 'loading' && (
              <div className="flex flex-col items-center py-8 text-center space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-16 h-16 rounded-full border-4 border-indigo-100 animate-pulse" />
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-base">Verifying your token...</h3>
                  <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
                    Please wait while we validate your email verification details against the secure engine database.
                  </p>
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center py-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 scale-100 animate-in zoom-in-50 duration-300">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-lg">Verification Successful!</h3>
                  <p className="text-slate-500 text-xs px-2 leading-relaxed">
                    Your email address is now verified. You have full access to Axevora Community: post content, interact on boards, and participate in discussions.
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 animate-in zoom-in-50 duration-300">
                  <XCircle className="w-7 h-7" />
                </div>
                <div className="w-full text-center space-y-1">
                  <h3 className="font-bold text-slate-900 text-lg">Verification Failed</h3>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                    We could not verify your email address.
                  </p>
                </div>
                
                <Alert variant="destructive" className="bg-rose-50/50 border-rose-100 text-rose-900 rounded-2xl p-4 mt-2">
                  <AlertTitle className="font-bold text-sm">Error details</AlertTitle>
                  <AlertDescription className="text-xs leading-relaxed mt-0.5 text-rose-750">
                    {errorMessage}
                  </AlertDescription>
                </Alert>

                {currentUser && currentUser.emailVerified === false && (
                  <div className="w-full border-t border-slate-100 pt-6 mt-4 text-center">
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Need a new verification link? Click the button below to resend the email to <strong className="text-slate-700">{currentUser.email}</strong>.
                    </p>
                    <Button 
                      onClick={handleResend}
                      disabled={resending}
                      variant="outline"
                      className="w-full h-11 rounded-xl text-sm font-semibold border-slate-200 hover:bg-slate-50/80 transition-all flex items-center justify-center gap-2"
                    >
                      {resending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                          Resending link...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-indigo-500" />
                          Resend Verification Email
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="px-6 sm:px-8 pb-8 pt-2 flex flex-col space-y-3">
            {status === 'success' ? (
              <Button 
                onClick={() => navigate('/community')}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-md shadow-indigo-100 transition-all duration-200"
              >
                Go to Community Dashboard
              </Button>
            ) : (
              <Link to="/community" className="w-full">
                <Button 
                  variant="ghost" 
                  className="w-full h-11 rounded-xl text-slate-600 hover:bg-slate-50 font-bold flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-400" />
                  Back to Community
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
