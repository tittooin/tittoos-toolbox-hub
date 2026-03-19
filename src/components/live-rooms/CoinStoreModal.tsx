import React, { useState } from "react";
import { Coins, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CoinStoreModalProps {
  uid: string;
  currentBalance: number;
}

export function CoinStoreModal({ uid, currentBalance }: CoinStoreModalProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleAddDefaultCoins = async () => {
    if (!uid) return;
    setLoading(true);
    try {
      const profileRef = doc(db, "live_profiles", uid);
      await updateDoc(profileRef, {
        walletBalance: increment(10000),
      });
      toast.success("Added 10,000 Coins successfully!");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add coins.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="hidden md:flex gap-2 rounded-full border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-500 font-bold px-4">
          <Coins className="h-4 w-4" />
          <span>{currentBalance.toLocaleString()} Coins</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-sky-950 dark:border-sky-800 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Coins className="h-6 w-6 text-amber-500" /> Coin Wallet
          </DialogTitle>
          <DialogDescription className="text-base text-slate-600 dark:text-sky-200">
            Top up your balance to send premium gifts in private rooms.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 flex flex-col items-center gap-6">
            <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900/50 rounded-2xl w-full p-6 text-center">
                <p className="text-sm font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wider mb-2">Current Balance</p>
                <h3 className="text-5xl font-black text-amber-600 dark:text-amber-400">
                    {currentBalance.toLocaleString()}
                </h3>
            </div>
            
            <div className="grid gap-3 w-full">
                <Button 
                    onClick={handleAddDefaultCoins} 
                    disabled={loading}
                    className="w-full text-lg py-6 font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg border-0"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Coins className="h-5 w-5 mr-2" />}
                    Add 10,000 Coins (Free)
                </Button>
                <p className="text-center text-xs text-slate-500 dark:text-sky-200/50 mt-2">
                    For demonstration purposes only.
                </p>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
