
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    deleteDoc,
    doc,
    updateDoc,
    increment
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MessageSquare } from 'lucide-react';

import AuthButton from './AuthButton';
import CommentList from './CommentList';
import { Comment } from './types';

const CommentSection = () => {
    const location = useLocation();
    const toolId = location.pathname; // Using current path as tool ID

    const [user, setUser] = useState<User | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState<{ id: string, name: string } | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Comments Listener
    useEffect(() => {
        const q = query(
            collection(db, "comments"),
            where("toolId", "==", toolId),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Comment[];
            setComments(commentsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [toolId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, "comments"), {
                toolId: toolId,
                text: newComment,
                userId: user.uid,
                userName: user.displayName || "Anonymous",
                userPhoto: user.photoURL || "",
                createdAt: serverTimestamp(),
                likes: 0,
                parentId: replyTo ? replyTo.id : null
            });
            setNewComment("");
            setReplyTo(null);
        } catch (error) {
            console.error("Error adding comment: ", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;
        try {
            await deleteDoc(doc(db, "comments", commentId));
        } catch (error) {
            console.error("Error deleting comment: ", error);
        }
    };

    const handleLike = async (commentId: string) => {
        // Simple client-side like increment (not ensuring uniqueness per user for this MVP to keep rules simple)
        // For production, you'd use a subcollection 'likes' to track userIds.
        try {
            const commentRef = doc(db, "comments", commentId);
            await updateDoc(commentRef, {
                likes: increment(1)
            });
        } catch (error) {
            console.error("Error liking comment: ", error);
        }
    };

    return (
        <Card className="mt-12 border-none shadow-none bg-transparent">
            <CardHeader className="px-0 flex flex-row items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <CardTitle className="text-xl">Discussion ({comments.length})</CardTitle>
                </div>
                <AuthButton user={user} />
            </CardHeader>
            <CardContent className="px-0 pt-6">

                {/* Input Area */}
                <div className="mb-8">
                    {!user ? (
                        <div className="p-6 text-center border rounded-lg bg-muted/20">
                            <p className="text-muted-foreground mb-4">Sign in to join the conversation</p>
                            <AuthButton user={user} />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {replyTo && (
                                <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                                    <span>Replying to <strong>{replyTo.name}</strong></span>
                                    <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>Cancel</Button>
                                </div>
                            )}
                            <div className="flex gap-4">
                                <Avatar className="h-10 w-10 hidden sm:block">
                                    <AvatarImage src={user.photoURL || ''} />
                                    <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <Textarea
                                        placeholder={replyTo ? "Write a reply..." : "What are your thoughts?"}
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="min-h-[100px] resize-none"
                                    />
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={submitting || !newComment.trim()}>
                                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {replyTo ? "Post Reply" : "Post Comment"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <CommentList
                        comments={comments}
                        currentUser={user}
                        onReply={(id, name) => setReplyTo({ id, name })}
                        onDelete={handleDelete}
                        onLike={handleLike}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default CommentSection;
