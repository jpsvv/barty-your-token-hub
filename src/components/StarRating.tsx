import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  showValue = false,
  className 
}: StarRatingProps) {
  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizes[size],
            i < Math.floor(rating)
              ? 'fill-accent text-accent'
              : i < rating
              ? 'fill-accent/50 text-accent'
              : 'text-muted-foreground/30'
          )}
        />
      ))}
      {showValue && (
        <span className={cn(
          'ml-1 font-medium',
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
        )}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
