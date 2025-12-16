
import React from 'react';
import { Comment } from './types';
import CommentItem from './CommentItem';
import { User } from 'firebase/auth';

interface CommentListProps {
    comments: Comment[];
    currentUser: User | null;
    onReply: (commentId: string, userName: string) => void;
    onDelete: (commentId: string) => void;
    onLike: (commentId: string, currentLikes: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, currentUser, onReply, onDelete, onLike }) => {
    // Separate root comments and replies
    const rootComments = comments.filter(c => !c.parentId);
    const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

    // Recursively render comments (though we'll limit nesting depth visually in Item)
    const renderComments = (commentList: Comment[]) => {
        return commentList.map(comment => (
            <div key={comment.id}>
                <CommentItem
                    comment={comment}
                    currentUser={currentUser}
                    onReply={onReply}
                    onDelete={onDelete}
                    onLike={onLike}
                />
                {/* Render replies */}
                <div className="ml-8 border-l-2 pl-4 border-muted/30">
                    {renderComments(getReplies(comment.id))}
                </div>
            </div>
        ));
    };

    if (comments.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>No comments yet. Be the first to start the discussion!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {renderComments(rootComments)}
        </div>
    );
};

export default CommentList;
