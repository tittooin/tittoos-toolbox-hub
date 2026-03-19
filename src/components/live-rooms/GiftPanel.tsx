import React, { useState } from "react";
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Gift, Coins, Loader2 } from "lucide-react";
import { AVAILABLE_GIFTS, LiveRoomGift, LiveRoomProfile } from "@/lib/liveRooms";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GiftPanelProps {
  roomId: string;
  profile: LiveRoomProfile;
  isDarkRoom: boolean;
}

export function GiftPanel({ roomId, profile, isDarkRoom }: GiftPanelProps) {
  const [open, setOpen] = useState(false);
  const [sendingGiftId, setSendingGiftId] = useState<string | null>(null);

  const handleSendGift = async (gift: LiveRoomGift) => {
    if (profile.walletBalance < gift.cost) {
      toast.error(`Not enough coins! You need ${gift.cost} coins for ${gift.name}.`);
      return;
    }

    setSendingGiftId(gift.id);

    try {
      // 1. Deduct balance from user profile
      const profileRef = doc(db, "live_profiles", profile.uid);
      await updateDoc(profileRef, {
        walletBalance: increment(-gift.cost)
      });

      // 2. Add gift event to the room's event stream
      const eventsRef = collection(db, "live_rooms", roomId, "events");
      await addDoc(eventsRef, {
        type: "gift",
        senderUid: profile.uid,
        senderName: profile.displayName,
        timestamp: serverTimestamp(),
        payload: {
          giftId: gift.id,
          giftName: gift.name,
          giftIcon: gift.icon,
          cost: gift.cost,
        }
      });

      toast.success(`Sent a ${gift.name}!`);
      setOpen(false);
    } catch (error) {
      console.error("Error sending gift:", error);
      toast.error("Failed to send gift.");
    } finally {
      setSendingGiftId(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          size="icon"
          className={cn(
            "rounded-full h-11 w-11 shrink-0 transition-transform hover:scale-105 shadow-md",
            isDarkRoom 
              ? "bg-gradient-to-tr from-pink-500 to-rose-500 border-0 text-white" 
              : "bg-gradient-to-tr from-rose-400 to-pink-500 border-0 text-white"
          )}
        >
          <Gift className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={16} className="w-80 p-0 rounded-2xl overflow-hidden shadow-2xl dark:bg-slate-900 border-rose-200 dark:border-rose-900/50">
        <div className="bg-rose-50 dark:bg-rose-950/30 p-4 border-b border-rose-100 dark:border-rose-900/30 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-rose-100">Send a Gift</h3>
          <div className="flex items-center gap-1.5 text-sm font-bold bg-white dark:bg-slate-800 py-1 px-3 rounded-full text-amber-500 shadow-sm border border-amber-100 dark:border-amber-900/50">
            <Coins className="h-4 w-4" />
            {profile.walletBalance?.toLocaleString() || 0}
          </div>
        </div>
        <div className="p-4 grid grid-cols-3 gap-3">
          {AVAILABLE_GIFTS.map((gift) => (
            <button
              key={gift.id}
              disabled={sendingGiftId === gift.id}
              onClick={() => handleSendGift(gift)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all hover:scale-105 active:scale-95",
                gift.colorClass,
                profile.walletBalance < gift.cost && "opacity-50 grayscale cursor-not-allowed"
              )}
            >
              {sendingGiftId === gift.id ? (
                <Loader2 className="h-8 w-8 mb-2 animate-spin opacity-50" />
              ) : (
                <span className="text-3xl mb-1">{gift.icon}</span>
              )}
              <span className="text-xs font-bold leading-tight truncate w-full text-center">{gift.name}</span>
              <div className="flex items-center gap-1 mt-1 text-[10px] font-black opacity-80">
                <Coins className="h-3 w-3" /> {gift.cost}
              </div>
            </button>
          ))}
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 text-center text-xs text-slate-500 dark:text-slate-400">
          Gifts support the host and appear on screen!
        </div>
      </PopoverContent>
    </Popover>
  );
}
