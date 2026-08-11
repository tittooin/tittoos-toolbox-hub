import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { RichTextComposer } from './RichTextComposer';

interface CommentComposerProps {
  postId: string;
  onCommentAdded: (comment: any) => void;
}

export const CommentComposer: React.FC<CommentComposerProps> = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (htmlContent: string) => {
    if (!user) {
      toast.error('You must be logged in to reply');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: htmlContent })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post reply');
      }

      const data = await res.json();
      toast.success('Reply posted successfully!');
      setContent('');
      onCommentAdded(data.comment);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-t-xl border-b-0">
        <h3 className="text-sm font-bold text-slate-700">Write a Reply</h3>
      </div>
      <RichTextComposer
        mode="comment"
        value={content}
        onChange={setContent}
        onSubmit={handleSubmit}
        disabled={!user}
        disabledReason={!user ? "Sign in to post a reply" : undefined}
        isSubmitting={isSubmitting}
        placeholder="Share your thoughts with the community..."
        submitLabel="Post Reply"
        minHeight="100px"
        maxHeight="250px"
        className="rounded-t-none border-t-0"
      />
    </div>
  );
};
