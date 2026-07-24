import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, Tag } from 'lucide-react';

interface BotBadgeProps {
  className?: string;
}

export const BotBadge: React.FC<BotBadgeProps> = ({ className = '' }) => {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {/* AXEVORA BOT */}
      <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border-none">
        <Bot className="w-3 h-3 text-indigo-200" />
        <span>AXEVORA BOT</span>
      </Badge>

      {/* AUTOMATED */}
      <Badge variant="outline" className="border-indigo-300 bg-indigo-50/80 text-indigo-700 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
        <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
        <span>AUTOMATED</span>
      </Badge>

      {/* PARTNER OFFER */}
      <Badge variant="outline" className="border-emerald-300 bg-emerald-50/80 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
        <Tag className="w-2.5 h-2.5 text-emerald-600" />
        <span>PARTNER OFFER</span>
      </Badge>
    </div>
  );
};
