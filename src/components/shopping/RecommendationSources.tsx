import { Quote } from 'lucide-react';

interface SourceItem {
  id?: string;
  name?: string;
  url?: string;
  snippet?: string;
}

interface RecommendationSourcesProps {
  sources: (string | SourceItem)[];
}

export default function RecommendationSources({ sources }: RecommendationSourcesProps) {
  if (!sources || sources.length === 0) return null;
  
  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <Quote className="w-3 h-3" />
        Recommendation Sources
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, i) => {
          if (typeof source === 'object' && source !== null) {
            const name = source.name || 'Web Source';
            const url = source.url;
            return (
              <a
                key={source.id || i}
                href={url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-secondary/30 hover:bg-secondary/60 border border-border px-2 py-1 rounded-md text-secondary-foreground flex items-center gap-1 transition-colors"
              >
                🌐 {name}
              </a>
            );
          }
          return (
            <div key={i} className="text-xs bg-secondary/30 border border-border px-2 py-1 rounded-md text-secondary-foreground">
              {String(source)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
