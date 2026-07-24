import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Flame, UserCheck, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface JoinCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAuth: (mode: 'login' | 'signup') => void;
  actionName?: string;
}

export function JoinCommunityModal({ isOpen, onClose, onSelectAuth, actionName }: JoinCommunityModalProps) {
  const trackConversion = (mode: 'login' | 'signup') => {
    try {
      fetch('/api/community/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: 'guest_conversion', metadata: { mode, action: actionName || 'generic' } })
      }).catch(() => {});
    } catch {
      // ignore
    }
    onSelectAuth(mode);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xl">
        <DialogHeader className="space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold w-fit">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>JOIN AXEVORA COMMUNITY</span>
          </div>

          <DialogTitle className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            {actionName ? `Sign in to ${actionName}` : 'Join the Axevora Community'}
          </DialogTitle>

          <DialogDescription className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Create an account or sign in to participate in discussions, post updates, and unlock member trust privileges.
          </DialogDescription>
        </DialogHeader>

        {/* Benefits List */}
        <div className="space-y-3 py-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Spam-Free Discussions</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Turnstile & D1 rate-limiting keep automated link spam off our boards.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Promote Your Content & Deals</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Share YouTube channels, blog articles, tech launches, and partner deals.</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2 pt-2">
          <Button 
            onClick={() => trackConversion('signup')}
            className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
          >
            Create Account <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>

          <Button 
            variant="outline" 
            onClick={() => trackConversion('login')}
            className="w-full h-10 rounded-xl border-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-50"
          >
            Sign In Existing Account
          </Button>

          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full h-8 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            Continue Browsing as Guest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
