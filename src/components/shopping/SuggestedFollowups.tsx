import { MessageCircle } from 'lucide-react';

interface SuggestedFollowupsProps {
  followUps: string[];
  onClick: (prompt: string) => void;
}

export default function SuggestedFollowups({ followUps, onClick }: SuggestedFollowupsProps) {
  if (!followUps || followUps.length === 0) return null;
  
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {followUps.map((text, i) => (
        <button
          key={i}
          onClick={() => onClick(text)}
          className="flex items-center gap-2 text-xs font-medium bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {text}
        </button>
      ))}
    </div>
  );
}
