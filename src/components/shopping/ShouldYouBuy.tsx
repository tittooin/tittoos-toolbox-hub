import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { ShouldYouBuy as ShouldYouBuyType } from '@/types/shopping';
import { cn } from '@/lib/utils';

interface ShouldYouBuyProps {
  data: ShouldYouBuyType;
}

export default function ShouldYouBuy({ data }: ShouldYouBuyProps) {
  const isYes = data.decision === 'Yes';
  const isWait = data.decision === 'Wait';
  const isSkip = data.decision === 'Skip';

  return (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-xl border mt-4",
      isYes && "bg-green-500/10 border-green-500/20",
      isWait && "bg-amber-500/10 border-amber-500/20",
      isSkip && "bg-destructive/10 border-destructive/20"
    )}>
      <div className="mt-0.5">
        {isYes && <CheckCircle2 className="w-5 h-5 text-green-600" />}
        {isWait && <Clock className="w-5 h-5 text-amber-600" />}
        {isSkip && <XCircle className="w-5 h-5 text-destructive" />}
      </div>
      <div>
        <h4 className={cn(
          "font-semibold text-sm mb-1",
          isYes && "text-green-700 dark:text-green-500",
          isWait && "text-amber-700 dark:text-amber-500",
          isSkip && "text-destructive"
        )}>
          {data.decision === 'Yes' ? 'Recommended to Buy Now' : 
           data.decision === 'Wait' ? 'Wait for Better Deals' : 'Not Recommended'}
        </h4>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {data.reason}
        </p>
      </div>
    </div>
  );
}
