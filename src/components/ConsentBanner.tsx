import { useEffect, useState } from 'react';

const CONSENT_STORAGE_KEY = 'consent.choice.v2';

type ConsentState = 'granted' | 'denied' | null;

function updateConsent(state: Exclude<ConsentState, null>) {
  // Ensure gtag exists
  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  // @ts-ignore
  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
  // @ts-ignore
  window.gtag('consent', 'update', {
    ad_storage: state,
    analytics_storage: state,
    functionality_storage: state,
    personalization_storage: state,
    security_storage: state,
  });
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (saved === 'granted' || saved === 'denied') {
        updateConsent(saved as Exclude<ConsentState, null>);
        setVisible(false);
      } else {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'granted');
    updateConsent('granted');
    setVisible(false);
  };

  const rejectAll = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'denied');
    updateConsent('denied');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="bg-card border border-border rounded-lg shadow-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            We use cookies for ads and analytics. Manage your consent to improve your experience. See our <a className="text-primary hover:underline" href="/privacy">Privacy Policy</a>.
          </div>
          <div className="flex gap-2">
            <button onClick={rejectAll} className="px-4 py-2 rounded border border-border text-sm">
              Reject All
            </button>
            <button onClick={acceptAll} className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm">
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}