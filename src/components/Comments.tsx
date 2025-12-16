
import React from 'react';
import { DiscussionEmbed } from 'disqus-react';
import { useLocation } from 'react-router-dom';

const Comments = ({ title }: { title: string }) => {
    const location = useLocation();
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    // Disqus Shortname
    // TODO: Replace with user's actual Disqus shortname
    const DISQUS_SHORTNAME = "tittoos-toolbox"; // Placeholder: often project name

    const disqusConfig = {
        url: currentUrl,
        identifier: location.pathname, // Unique ID for each page
        title: title, // Page title
        language: 'en_US' // Default language
    };

    return (
        <div className="mt-16 pt-8 border-t" id="comments-section">
            <h2 className="text-2xl font-bold mb-6">Discussion</h2>
            <div className="min-h-[200px] bg-background">
                <DiscussionEmbed
                    shortname={DISQUS_SHORTNAME}
                    config={disqusConfig}
                />
            </div>
        </div>
    );
};

export default Comments;
