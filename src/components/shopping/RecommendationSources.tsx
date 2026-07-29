import { Quote } from 'lucide-react';

interface RecommendationSourcesProps {
  sources: string[];
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
        {sources.map((source, i) => (
          <div key={i} className="text-xs bg-secondary/30 border border-border px-2 py-1 rounded-md text-secondary-foreground">
            {source}
          </div>
        ))}
      </div>
    </div>
  );
}
