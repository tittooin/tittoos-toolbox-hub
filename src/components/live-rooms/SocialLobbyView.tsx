import React from "react";
import { User } from "firebase/auth";
import { Link2, Sparkles, Users, Globe2, TrendingUp, Music, Heart, Mic, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import AuthButton from "@/components/comments/AuthButton";
import { CoinStoreModal } from "@/components/live-rooms/CoinStoreModal";
import { cn } from "@/lib/utils";
import type { LiveRoomProfile } from "@/lib/liveRooms";

interface SocialLobbyViewProps {
  user: User | null;
  profile: LiveRoomProfile | null;
  roomName: string;
  setRoomName: (name: string) => void;
  roomCodeInput: string;
  setRoomCodeInput: (code: string) => void;
  creatingRoom: boolean;
  joiningRoom: boolean;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  onJoinGlobalRoom: (roomId: string, roomName: string) => void;
}

export function SocialLobbyView({
  user,
  profile,
  roomName,
  setRoomName,
  roomCodeInput,
  setRoomCodeInput,
  creatingRoom,
  joiningRoom,
  onCreateRoom,
  onJoinRoom,
  onJoinGlobalRoom,
}: SocialLobbyViewProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-10 py-6 animate-in fade-in duration-500">
      
      {/* Header & Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Discover Rooms</h1>
          <p className="mt-1 text-slate-800 dark:text-sky-100 font-medium">Join public conversations or host your own.</p>
        </div>

        {profile ? (
          <div className="flex items-center gap-4 rounded-xl bg-white dark:bg-sky-950 border-2 border-sky-200 dark:border-sky-800 p-2 pr-6 shadow-md">
            <Avatar className="h-12 w-12 border-2 border-sky-100 dark:border-sky-700">
                <AvatarImage src={profile.photoURL} />
                <AvatarFallback className="bg-sky-100 text-sky-900 font-bold">{profile.displayName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 dark:text-white">{profile.displayName}</span>
              <div className="flex items-center gap-3 mt-1">
                <CoinStoreModal uid={profile.uid} currentBalance={profile.walletBalance || 0} />
                <span className="flex items-center text-sm font-bold text-rose-600 dark:text-rose-400">
                  <span className="h-2 w-2 rounded-full bg-rose-500 mr-2" />
                  0 Diamonds
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 rounded-xl bg-white dark:bg-sky-950 border-2 border-sky-200 dark:border-sky-800 p-4 shadow-md w-full md:w-auto">
             <span className="text-base font-bold text-slate-800 dark:text-sky-100">Sign in to host & gift</span>
             <AuthButton user={user} />
          </div>
        )}
      </div>

      {/* Trending Public Rooms */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-sky-600 dark:text-sky-400" />
               Trending Global Rooms
            </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Room Card 1 */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-sky-900 border-2 border-sky-100 dark:border-sky-800 p-6 shadow-sm transition-all hover:shadow-lg hover:border-sky-400 dark:hover:border-sky-400 cursor-pointer" onClick={() => onJoinGlobalRoom("cricket_lounge", "Cricket Lounge")}>
               <div className="flex items-start justify-between">
                   <Badge className="bg-sky-100 text-sky-900 hover:bg-sky-200 dark:bg-sky-950 dark:text-sky-100 dark:hover:bg-sky-800 font-bold px-3 py-1">
                       <Mic className="w-3 h-3 mr-2 inline" />
                       Live Chat
                   </Badge>
                   <div className="flex items-center gap-1 text-base font-bold text-slate-800 dark:text-sky-100">
                       <Users className="w-4 h-4" /> 210
                   </div>
               </div>
               <div className="mt-6 mb-4">
                   <h3 className="text-xl font-black text-slate-900 dark:text-white">Cricket Lounge</h3>
                   <p className="mt-2 text-base font-medium text-slate-700 dark:text-sky-100 leading-snug">Live match discussions, team banter, and instant score updates.</p>
               </div>
               <div className="flex items-center justify-between pt-4 border-t-2 border-sky-100 dark:border-sky-800">
                   <div className="flex -space-x-2">
                        <Avatar className="w-9 h-9 border-2 border-white dark:border-sky-900"><AvatarFallback className="bg-sky-200 text-sky-900 font-bold text-xs">RJ</AvatarFallback></Avatar>
                        <Avatar className="w-9 h-9 border-2 border-white dark:border-sky-900"><AvatarFallback className="bg-sky-300 text-sky-900 font-bold text-xs">VK</AvatarFallback></Avatar>
                        <Avatar className="w-9 h-9 border-2 border-white dark:border-sky-900"><AvatarFallback className="bg-sky-400 text-sky-950 font-bold text-xs">MS</AvatarFallback></Avatar>
                   </div>
                   <Button size="default" className="rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold px-6" onClick={() => onJoinGlobalRoom("cricket_lounge", "Cricket Lounge")}>Join</Button>
               </div>
            </div>

            {/* Room Card 2 */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-sky-900 border-2 border-sky-100 dark:border-sky-800 p-6 shadow-sm transition-all hover:shadow-lg hover:border-sky-400 dark:hover:border-sky-400 cursor-pointer" onClick={() => onJoinGlobalRoom("bollywood_hits", "Bollywood Hits")}>
               <div className="flex items-start justify-between">
                   <Badge className="bg-sky-100 text-sky-900 hover:bg-sky-200 dark:bg-sky-950 dark:text-sky-100 dark:hover:bg-sky-800 font-bold px-3 py-1">
                       <Music className="w-3 h-3 mr-2 inline" />
                       Music
                   </Badge>
                   <div className="flex items-center gap-1 text-base font-bold text-slate-800 dark:text-sky-100">
                       <Users className="w-4 h-4" /> 124
                   </div>
               </div>
               <div className="mt-6 mb-4">
                   <h3 className="text-xl font-black text-slate-900 dark:text-white">Bollywood Hits</h3>
                   <p className="mt-2 text-base font-medium text-slate-700 dark:text-sky-100 leading-snug">Vibe to the latest tracks and meet music lovers.</p>
               </div>
               <div className="flex items-center justify-between pt-4 border-t-2 border-sky-100 dark:border-sky-800">
                   <div className="flex -space-x-2">
                        <Avatar className="w-9 h-9 border-2 border-white dark:border-sky-900"><AvatarFallback className="bg-sky-200 text-sky-900 font-bold text-xs">SK</AvatarFallback></Avatar>
                        <Avatar className="w-9 h-9 border-2 border-white dark:border-sky-900"><AvatarFallback className="bg-sky-300 text-sky-900 font-bold text-xs">AP</AvatarFallback></Avatar>
                   </div>
                   <Button size="default" className="rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold px-6" onClick={(e) => { e.stopPropagation(); onJoinGlobalRoom("bollywood_hits", "Bollywood Hits"); }}>Join</Button>
               </div>
            </div>

            {/* Room Card 3 */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-sky-900 border-2 border-sky-100 dark:border-sky-800 p-6 shadow-sm transition-all hover:shadow-lg hover:border-sky-400 dark:hover:border-sky-400 cursor-pointer" onClick={() => onJoinGlobalRoom("midnight_chill", "Midnight Chill")}>
               <div className="flex items-start justify-between">
                   <Badge className="bg-sky-100 text-sky-900 hover:bg-sky-200 dark:bg-sky-950 dark:text-sky-100 dark:hover:bg-sky-800 font-bold px-3 py-1">
                       <Heart className="w-3 h-3 mr-2 inline" />
                       Chill
                   </Badge>
                   <div className="flex items-center gap-1 text-base font-bold text-slate-800 dark:text-sky-100">
                       <Users className="w-4 h-4" /> 89
                   </div>
               </div>
               <div className="mt-6 mb-4">
                   <h3 className="text-xl font-black text-slate-900 dark:text-white">Midnight Chill</h3>
                   <p className="mt-2 text-base font-medium text-slate-700 dark:text-sky-100 leading-snug">Late night talks, lo-fi beats, and good vibes.</p>
               </div>
               <div className="flex items-center justify-between pt-4 border-t-2 border-sky-100 dark:border-sky-800">
                   <div className="flex -space-x-2">
                        <Avatar className="w-9 h-9 border-2 border-white dark:border-sky-900"><AvatarFallback className="bg-sky-200 text-sky-900 font-bold text-xs">DJ</AvatarFallback></Avatar>
                   </div>
                   <Button size="default" className="rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold px-6" onClick={(e) => { e.stopPropagation(); onJoinGlobalRoom("midnight_chill", "Midnight Chill"); }}>Join</Button>
               </div>
            </div>
        </div>
      </div>

      {/* Private Rooms Area (Host / Join) */}
      <div className="pt-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <Mic className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            Private Stages
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-5">
              {/* Host Card */}
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-white dark:bg-sky-950 border-2 border-sky-200 dark:border-sky-800 rounded-2xl p-6 shadow-md">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                     <Crown className="w-8 h-8" />
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                      <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Host a Room</h3>
                          <p className="text-base font-medium text-slate-700 dark:text-sky-100 mt-1">Invite friends and earn gifts from viewers.</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                          <Input
                            id="room-name"
                            value={roomName}
                            onChange={(event) => setRoomName(event.target.value)}
                            placeholder="Room title..."
                            disabled={!user || creatingRoom}
                            className="bg-white dark:bg-sky-900 border-2 border-sky-200 dark:border-sky-700 h-12 rounded-xl px-4 text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-500"
                          />
                          <Button 
                            className="shrink-0 h-12 rounded-xl font-bold bg-sky-600 hover:bg-sky-700 text-white px-6" 
                            onClick={onCreateRoom} 
                            disabled={!user || creatingRoom || !roomName.trim()}
                          >
                            Create Stage
                          </Button>
                      </div>
                  </div>
              </div>

              {/* Join Card */}
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-white dark:bg-sky-950 border-2 border-sky-200 dark:border-sky-800 rounded-2xl p-6 shadow-md">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                     <Link2 className="w-8 h-8" />
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                      <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Join via Invite</h3>
                          <p className="text-base font-medium text-slate-700 dark:text-sky-100 mt-1">Have a room code? Enter it to join the stage.</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                          <Input
                            id="join-room"
                            value={roomCodeInput}
                            onChange={(event) => setRoomCodeInput(event.target.value)}
                            placeholder="e.g. ROOM2026"
                            disabled={!user || joiningRoom}
                            className="uppercase font-mono tracking-widest bg-white dark:bg-sky-900 border-2 border-sky-200 dark:border-sky-700 h-12 rounded-xl px-4 text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-500"
                          />
                          <Button 
                            className="shrink-0 h-12 rounded-xl font-bold bg-sky-600 hover:bg-sky-700 text-white px-6" 
                            onClick={onJoinRoom} 
                            disabled={!user || joiningRoom || !roomCodeInput.trim()}
                          >
                            Join Stage
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
}
