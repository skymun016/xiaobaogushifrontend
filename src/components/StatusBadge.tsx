import { STATUS_CONFIG } from '@/types/enums';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const colorMap = {
  pending: 'bg-status-pending-bg text-status-pending',
  processing: 'bg-status-processing-bg text-status-processing',
  success: 'bg-status-success-bg text-status-success',
  error: 'bg-status-error-bg text-status-error',
  cancelled: 'bg-status-cancelled-bg text-status-cancelled',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  if (!config) return <span className={className}>{status}</span>;
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
      colorMap[config.color],
      className
    )}>
      {config.label}
    </span>
  );
}
