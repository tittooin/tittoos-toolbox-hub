import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Lock, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isAdminGateConfigured, isAdminGateUnlocked, unlockAdminGate, verifyAdminSecret } from "@/lib/adminGate";
import { setSEO } from "@/utils/seoUtils";
import { toast } from "sonner";

interface AdminRouteGuardProps {
  children: ReactNode;
}

const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
  const [secret, setSecret] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setUnlocked(isAdminGateUnlocked());
    setSEO({
      title: "Admin Access | Axevora",
      description: "Restricted admin access page.",
      noindex: true,
      type: "website"
    });
  }, []);

  const handleUnlock = async (event: FormEvent) => {
    event.preventDefault();
    if (!secret.trim()) {
      toast.error("Secret passcode enter karo");
      return;
    }

    setSubmitting(true);
    try {
      const isValid = await verifyAdminSecret(secret);
      if (!isValid) {
        toast.error("Wrong admin secret");
        return;
      }

      unlockAdminGate();
      setUnlocked(true);
      setSecret("");
      toast.success("Admin gate unlocked");
    } finally {
      setSubmitting(false);
    }
  };

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <Card className="border-primary/10 shadow-lg">
          <CardHeader>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-3xl">Restricted Admin Access</CardTitle>
            <CardDescription>
              Yeh route public users ke liye hidden hai. Access ke liye admin secret required hai.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isAdminGateConfigured() && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Admin secret not configured</AlertTitle>
                <AlertDescription>
                  `.env` me `VITE_ADMIN_GATE_HASH` set hona chahiye, tabhi gate unlock hoga.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={secret}
                  onChange={(event) => setSecret(event.target.value)}
                  placeholder="Enter admin passcode"
                  className="pl-11 h-12"
                  autoComplete="current-password"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={submitting || !isAdminGateConfigured()}>
                  {submitting ? "Checking..." : "Unlock Admin"}
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminRouteGuard;
