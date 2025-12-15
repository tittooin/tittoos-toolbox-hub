
import React from 'react';
import { Comments as HyvorComments } from '@hyvor/hyvor-talk-react';
import { useLocation } from 'react-router-dom';

const Comments = () => {
    const location = useLocation();

    // Website ID provided by Hyvor Talk
    // TODO: Replace with user's actual website ID
    const WEBSITE_ID = 11187; // Placeholder ID, or use env variable

    return (
        <div className="mt-16 pt-8 border-t" id="comments-section">
            <h2 className="text-2xl font-bold mb-6">Discussion</h2>
            <div className="min-h-[200px]">
                <HyvorComments
                    website-id={WEBSITE_ID}
                    page-id={location.pathname}
                />
            </div>
        </div>
    );
};

export default Comments;
