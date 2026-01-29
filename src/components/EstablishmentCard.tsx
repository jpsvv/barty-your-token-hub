import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Establishment } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface EstablishmentCardProps {
  establishment: Establishment;
}

export function EstablishmentCard({ establishment }: EstablishmentCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isFavorite, toggleFavorite } = useAuth();
  const isFav = isAuthenticated && isFavorite(establishment.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuthenticated) {
      toggleFavorite(establishment.id);
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-200 animate-fade-in"
      onClick={() => navigate(`/establishment/${establishment.id}`)}
    >
      <div className="relative">
        <img 
          src={establishment.coverImage} 
          alt={establishment.name}
          className="w-full h-32 object-cover"
        />
        {establishment.hasPromotion && (
          <Badge className="absolute top-2 left-2 bg-success text-success-foreground">
            Promoção
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background",
            isFav && "text-destructive"
          )}
          onClick={handleFavorite}
        >
          <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
        </Button>
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img 
            src={establishment.logo} 
            alt={`${establishment.name} logo`}
            className="w-12 h-12 rounded-full object-cover border-2 border-border"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{establishment.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={establishment.rating} size="sm" showValue />
              <span className="text-xs text-muted-foreground">
                ({establishment.reviewCount})
              </span>
            </div>
            {establishment.distance && (
              <p className="text-xs text-muted-foreground mt-1">
                {establishment.distance.toFixed(1)} km
              </p>
            )}
          </div>
        </div>
        {establishment.hasPromotion && establishment.promotionText && (
          <p className="text-xs text-success mt-3 line-clamp-1">
            🔥 {establishment.promotionText}
          </p>
        )}
      </div>
    </Card>
  );
}
