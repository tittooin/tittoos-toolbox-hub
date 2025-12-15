import React, { useState, useEffect, useRef } from 'react';
import ToolTemplate from '@/components/ToolTemplate';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gamepad2, RotateCcw, ChevronRight, Trophy } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Types ---
type Level = {
    id: number;
    width: number;
    height: number;
    anchors: Record<number, number>; // index -> number (1, 2, 3...)
};

// --- Levels Data ---
const LEVELS: Level[] = [
    {
        id: 1,
        width: 3,
        height: 3,
        anchors: { 0: 1, 2: 2, 8: 3 }
    },
    {
        id: 2,
        width: 4,
        height: 4,
        anchors: { 0: 1, 3: 2, 12: 3, 15: 4 }
    },
    {
        id: 3,
        width: 5,
        height: 5,
        anchors: { 0: 1, 4: 2, 12: 3, 24: 4 }
    },
    {
        id: 4,
        width: 5,
        height: 6,
        anchors: { 2: 1, 14: 2, 25: 3 } // 25 is validation check, max index is 29
    },
    {
        id: 5,
        width: 6,
        height: 6,
        anchors: { 0: 1, 5: 2, 30: 3, 35: 4 } // Corners
    }
];

const NumberFlow = () => {
    const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
    const [path, setPath] = useState<number[]>([]); // Array of grid indices
    const [isDragging, setIsDragging] = useState(false);
    const [isLevelComplete, setIsLevelComplete] = useState(false);
    const [lastReachedAnchor, setLastReachedAnchor] = useState(1);

    // Derived state
    const level = LEVELS[currentLevelIdx];
    const maxNumber = Math.max(...Object.values(level.anchors));

    // Reset when level changes
    useEffect(() => {
        resetLevel();
    }, [currentLevelIdx]);

    const resetLevel = () => {
        // Find index of '1'
        const startIdx = parseInt(Object.keys(level.anchors).find(key => level.anchors[Number(key)] === 1) || "0");
        setPath([startIdx]);
        setLastReachedAnchor(1);
        setIsLevelComplete(false);
        setIsDragging(false);
    };

    const getCoord = (index: number) => ({ x: index % level.width, y: Math.floor(index / level.width) });
    const getIndex = (x: number, y: number) => y * level.width + x;

    const isAdjacent = (idx1: number, idx2: number) => {
        const c1 = getCoord(idx1);
        const c2 = getCoord(idx2);
        return Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y) === 1;
    };

    const handleInteractionStart = (index: number) => {
        if (isLevelComplete) return;

        // If clicking the head of the path, start dragging
        if (index === path[path.length - 1]) {
            setIsDragging(true);
            return;
        }

        // If clicking anywhere else on the path, cut the path back to that point
        const pathIndex = path.indexOf(index);
        if (pathIndex !== -1) {
            // Recalculate last reached anchor up to this point
            let maxAnchor = 1;
            const newPath = path.slice(0, pathIndex + 1);
            newPath.forEach(pIdx => {
                if (level.anchors[pIdx] && level.anchors[pIdx] > maxAnchor) {
                    maxAnchor = level.anchors[pIdx];
                }
            });

            setPath(newPath);
            setLastReachedAnchor(maxAnchor);
            setIsDragging(true);
        }
    };

    const handleInteractionMove = (index: number) => {
        if (!isDragging || isLevelComplete) return;

        const currentHead = path[path.length - 1];
        if (index === currentHead) return; // Still on same cell

        // If moving back to previous cell (undo)
        if (path.length > 1 && index === path[path.length - 2]) {
            const newPath = path.slice(0, -1);
            setPath(newPath);

            // Check if we stepped back from an anchor
            const steppedBackFrom = currentHead;
            if (level.anchors[steppedBackFrom]) {
                // Re-evaluate max anchor (simplified: just decrement if we just left the max)
                if (level.anchors[steppedBackFrom] === lastReachedAnchor) {
                    // scan path to find new max
                    let maxAnchor = 1;
                    newPath.forEach(pIdx => {
                        if (level.anchors[pIdx] && level.anchors[pIdx] > maxAnchor) {
                            maxAnchor = level.anchors[pIdx];
                        }
                    });
                    setLastReachedAnchor(maxAnchor);
                }
            }
            return;
        }

        // Validate move
        if (!isAdjacent(currentHead, index)) return;
        if (path.includes(index)) return; // No self-intersection (handled by backtrack above)

        // Check anchor logic
        const anchorVal = level.anchors[index];
        if (anchorVal) {
            // If it's an anchor, it MUST be the next number in sequence
            if (anchorVal !== lastReachedAnchor + 1) return;
            setLastReachedAnchor(anchorVal);
        }

        const newPath = [...path, index];
        setPath(newPath);

        // Check Win Condition
        if (newPath.length === level.width * level.height && anchorVal === maxNumber) {
            setIsLevelComplete(true);
            setIsDragging(false);
            toast.success("Level Complete! 🎉");
        }
    };

    const handleInteractionEnd = () => {
        setIsDragging(false);
    };

    const nextLevel = () => {
        if (currentLevelIdx < LEVELS.length - 1) {
            setCurrentLevelIdx(prev => prev + 1);
        } else {
            toast.success("All levels completed! Starting over.");
            setCurrentLevelIdx(0);
        }
    };

    // --- Render Helpers ---
    const getCellClass = (index: number) => {
        const isPath = path.includes(index);
        const isHead = path[path.length - 1] === index;
        const anchor = level.anchors[index];

        let classes = "w-full h-full rounded-md flex items-center justify-center text-lg font-bold select-none transition-all duration-200 border-2 ";

        if (anchor) {
            // Anchor styles
            if (isPath) {
                // Reached anchor
                classes += "bg-primary text-primary-foreground border-primary scale-105 z-10 shadow-lg";
            } else {
                // Unreached anchor
                classes += "bg-muted text-muted-foreground border-muted-foreground/30";
            }
        } else {
            // Empty cell styles
            if (isPath) {
                classes += "bg-primary/50 border-primary/50";
                if (isHead && !isLevelComplete) classes += " ring-2 ring-primary ring-offset-2 bg-primary/80";
            } else {
                classes += "bg-card hover:bg-muted/50 border-border";
            }
        }

        return classes;
    };

    return (
        <ToolTemplate
            title="Number Flow"
            description="Connect the numbers in order from 1 to End. You must fill every single square on the grid to win!"
            icon={Gamepad2}
        >
            <div className="flex flex-col items-center justify-center space-y-8 py-8 touch-none" onPointerUp={handleInteractionEnd} onMouseLeave={handleInteractionEnd}>

                {/* Header / Stats */}
                <div className="flex items-center justify-between w-full max-w-md px-4">
                    <div className="text-xl font-bold">Level {currentLevelIdx + 1}</div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={resetLevel} title="Reset Level">
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={isLevelComplete ? "default" : "outline"}
                            size="icon"
                            onClick={nextLevel}
                            disabled={!isLevelComplete && currentLevelIdx < LEVELS.length - 1}
                            className={cn(isLevelComplete && "animate-pulse")}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Game Grid */}
                <Card className="p-4 shadow-xl bg-muted/20 border-2">
                    <div
                        className="grid gap-2"
                        style={{
                            gridTemplateColumns: `repeat(${level.width}, minmax(3rem, 1fr))`,
                            width: 'fit-content'
                        }}
                    >
                        {Array.from({ length: level.width * level.height }).map((_, idx) => (
                            <div
                                key={idx}
                                className="w-12 h-12 sm:w-16 sm:h-16 relative"
                                onPointerDown={() => handleInteractionStart(idx)}
                                onPointerEnter={() => handleInteractionMove(idx)}
                            >
                                <div className={getCellClass(idx)}>
                                    {level.anchors[idx]}
                                </div>

                                {/* Connector Lines (Visual Only) */}
                                {path.includes(idx) && path.indexOf(idx) < path.length - 1 && (() => {
                                    const nextIdx = path[path.indexOf(idx) + 1];
                                    const nextCoord = getCoord(nextIdx);
                                    const currCoord = getCoord(idx);

                                    // Determine direction
                                    const dx = nextCoord.x - currCoord.x;
                                    const dy = nextCoord.y - currCoord.y;

                                    let lineClass = "absolute bg-primary z-0 ";
                                    if (dx === 1) lineClass += "h-2 w-8 top-1/2 -right-4 -translate-y-1/2"; // Right
                                    if (dx === -1) lineClass += "h-2 w-8 top-1/2 -left-4 -translate-y-1/2"; // Left
                                    if (dy === 1) lineClass += "w-2 h-8 left-1/2 -bottom-4 -translate-x-1/2"; // Down
                                    if (dy === -1) lineClass += "w-2 h-8 left-1/2 -top-4 -translate-x-1/2"; // Up

                                    return <div className={lineClass} />;
                                })()}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Instructions */}
                <div className="text-center text-muted-foreground max-w-md px-4">
                    <p className="mb-2">
                        {isLevelComplete
                            ? <span className="text-green-600 font-bold flex items-center justify-center gap-2"><Trophy className="w-5 h-5" /> Perfect! Next level unlocked.</span>
                            : "Click & Drag from '1' to connect numbers in order."
                        }
                    </p>
                    <p className="text-sm opacity-75">Rule: You must cover every single empty square!</p>
                </div>

            </div>
        </ToolTemplate>
    );
};

export default NumberFlow;
