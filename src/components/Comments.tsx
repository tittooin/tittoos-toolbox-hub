
import React from 'react';
import Giscus from '@giscus/react';
import { useLocation } from 'react-router-dom';

const Comments = () => {
    const location = useLocation();

    // TODO: Replace with user's actual Giscus configuration
    // You can get these values from https://giscus.app/
    const REPO = "tittooin/tittoos-toolbox-hub"; // Assuming this is the repo based on previous git context
    const REPO_ID = "R_kgDpnZw2"; // PLACEHOLDER
    const CATEGORY = "General";
    const CATEGORY_ID = "DIC_kwDpnZw2"; // PLACEHOLDER

    return (
        <div className="mt-16 pt-8 border-t" id="comments-section">
            <h2 className="text-2xl font-bold mb-6">Discussion</h2>
            <div className="min-h-[200px] bg-background">
                <Giscus
                    id="comments"
                    repo={REPO as any}
                    repoId={REPO_ID}
                    category={CATEGORY}
                    categoryId={CATEGORY_ID}
                    mapping="pathname"
                    term={location.pathname}
                    reactionsEnabled="1"
                    emitMetadata="0"
                    inputPosition="top"
                    theme="preferred_color_scheme"
                    lang="en"
                    loading="lazy"
                />
            </div>
        </div>
    );
};

export default Comments;
