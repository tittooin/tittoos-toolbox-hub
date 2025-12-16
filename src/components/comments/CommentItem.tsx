
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Reply, Trash2, MoreVertical } from 'lucide-react';
import { Comment } from './types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface CommentItemProps {
    comment: Comment;
    currentUser: User | null;
    onReply: (commentId: string, userName: string) => void;
    onDelete: (commentId: string) => void;
    onLike: (commentId: string, currentLikes: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, currentUser, onReply, onDelete, onLike }) => {
    const isOwner = currentUser?.uid === comment.userId;
    const [liked, setLiked] = useState(false); // Optimistic UI local state could be enhanced with real check if user liked

    return (
        <div className={`flex gap-4 p-4 rounded-lg bg-card/50 border mb-3 ${comment.parentId ? 'ml-8' : ''}`}>
            <Avatar className="h-10 w-10 border">
                <AvatarImage src={comment.userPhoto} />
                <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="font-semibold text-sm">{comment.userName}</span>
                        <span className="text-xs text-muted-foreground">
                            {comment.createdAt ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                        </span>
                    </div>

                    {isOwner && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(comment.id)}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.text}</p>

                <div className="flex items-center gap-4 pt-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-auto p-0 hover:bg-transparent ${liked ? 'text-red-500' : 'text-muted-foreground'}`}
                        onClick={() => {
                            setLiked(!liked);
                            onLike(comment.id, comment.likes || 0);
                        }}
                    >
                        <Heart className={`h-4 w-4 mr-1.5 ${liked ? 'fill-current' : ''}`} />
                        <span className="text-xs">{comment.likes || 0}</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                        onClick={() => onReply(comment.id, comment.userName)}
                    >
                        <Reply className="h-4 w-4 mr-1.5" />
                        <span className="text-xs">Reply</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CommentItem;
