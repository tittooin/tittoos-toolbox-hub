
import React, { useEffect, useState } from 'react';
import { useAxevoraGamification, UserProfile } from "@/hooks/useAxevoraGamification";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Medal, Crown } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface LeaderboardProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function Leaderboard({ isOpen, onOpenChange }: LeaderboardProps) {
    const { getLeaderboard, userProfile } = useAxevoraGamification();
    const [leaders, setLeaders] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchLeaders = async () => {
        setLoading(true);
        try {
            const data = await getLeaderboard();
            setLeaders(data);
        } catch (error) {
            console.error("Failed to fetch leaderboard", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchLeaders();
        }
    }, [isOpen]);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />;
            case 1: return <Medal className="w-5 h-5 text-gray-300 fill-gray-300" />;
            case 2: return <Medal className="w-5 h-5 text-amber-700 fill-amber-700" />;
            default: return <span className="font-bold text-gray-400">#{index + 1}</span>;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-black/80 backdrop-blur-xl border-white/10 text-white">
                <DialogHeader>
                    <div className="flex items-center gap-2 justify-center mb-2">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
                            Axevora Champions
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-center text-gray-400">
                        Top 20 Legends of the Circle
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <ScrollArea className="h-[400px] w-full pr-4">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableHead className="w-[60px] text-center text-gray-400">Rank</TableHead>
                                    <TableHead className="text-gray-400">Member</TableHead>
                                    <TableHead className="text-right text-gray-400">XP</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center text-gray-500">
                                            Loading Champions...
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    leaders.map((leader, index) => (
                                        <TableRow
                                            key={leader.uid}
                                            className={`border-white/5 hover:bg-white/5 ${leader.uid === userProfile?.uid ? 'bg-yellow-500/10 border-l-2 border-l-yellow-500' : ''}`}
                                        >
                                            <TableCell className="font-medium text-center">
                                                <div className="flex justify-center">{getRankIcon(index)}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className={`font-semibold ${index === 0 ? 'text-yellow-400' : 'text-gray-200'}`}>
                                                        {leader.displayName || "Anonymous Hero"}
                                                    </span>
                                                    <span className="text-xs text-gray-500">Lvl {leader.level}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-yellow-500/80">
                                                {leader.xp.toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>

                <div className="flex justify-center mt-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={fetchLeaders}
                        className="text-gray-500 hover:text-white hover:bg-white/10"
                    >
                        Refresh Board
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
