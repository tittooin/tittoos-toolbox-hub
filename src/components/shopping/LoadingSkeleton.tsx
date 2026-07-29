import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoadingSkeleton() {
  return (
    <div className="flex w-full mt-4 space-x-3 max-w-3xl mx-auto">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
        </div>
      </div>
      <div className="flex-1 space-y-4 py-1">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="h-48 bg-muted rounded-xl animate-pulse"></div>
          <div className="h-48 bg-muted rounded-xl animate-pulse hidden sm:block"></div>
        </div>
      </div>
    </div>
  );
}
