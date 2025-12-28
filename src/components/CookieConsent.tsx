import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Small delay to show animation
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
    // Here you would trigger analytics/ads scripts to load
    // if you had a system that waited for consent
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-background/95 backdrop-blur-sm border-t border-border z-50 shadow-lg animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-foreground/80 md:pr-8">
          <p className="font-semibold mb-1">🍪 We value your privacy</p>
          <p>
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.
            By clicking "Accept All", you consent to our use of cookies.
            Read our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> to learn more.
          </p>
        </div>
        <div className="flex gap-3 md:shrink-0 w-full md:w-auto">
          <Button variant="outline" size="sm" onClick={handleDecline} className="flex-1 md:flex-none">
            Decline
          </Button>
          <Button onClick={handleAccept} size="sm" className="flex-1 md:flex-none">
            Accept All
          </Button>
          <button
            onClick={() => setIsVisible(false)}
            className="md:hidden absolute top-2 right-2 text-muted-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
