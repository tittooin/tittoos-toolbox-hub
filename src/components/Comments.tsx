
import React from 'react';
import CommentSection from './comments/CommentSection';

// This wrapper replaces the old Giscus/Disqus component so imports in ToolTemplate don't break
const Comments = () => {
    return (
        <div id="comments-wrapper">
            <CommentSection />
        </div>
    );
};

export default Comments;
