import { Plus, MessageSquare, History, Settings, BrainCircuit, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ShoppingSidebarProps {
  onNewChat: () => void;
  className?: string;
}

export default function ShoppingSidebar({ onNewChat, className }: ShoppingSidebarProps) {
  return (
    <div className={cn("flex flex-col h-full bg-background border-r border-border", className)}>
      <div className="p-4">
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        <div>
          <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Recent Conversations
          </h3>
          <div className="space-y-1 opacity-50 pointer-events-none">
            {/* Placeholders for Phase 2 */}
            <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 text-sm font-normal">
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="truncate">Best TWS earbuds under 2000</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 text-sm font-normal">
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="truncate">MacBook Air M3 deals</span>
            </Button>
          </div>
        </div>

        <div>
          <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Ecosystem Integrations
          </h3>
          <div className="space-y-1 opacity-50 pointer-events-none">
            {/* Placeholders for Phase 2/3 */}
            <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 text-sm font-normal">
              <Users className="h-3.5 w-3.5" />
              <span>Community Knowledge</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 text-sm font-normal">
              <BrainCircuit className="h-3.5 w-3.5" />
              <span>AI Memory & Preferences</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border opacity-50 pointer-events-none">
        <Button variant="ghost" className="w-full justify-start gap-2 text-sm font-normal">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
