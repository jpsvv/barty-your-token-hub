import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, CheckCircle, Package, AlertTriangle } from "lucide-react";
import { ProductionItem } from "@/types/client";
import { cn } from "@/lib/utils";

interface ProductionItemCardProps {
  item: ProductionItem;
  onStartProduction: (id: string) => void;
  onMarkReady: (id: string) => void;
  onMarkDelivered: (id: string) => void;
}

const ProductionItemCard = ({
  item,
  onStartProduction,
  onMarkReady,
  onMarkDelivered,
}: ProductionItemCardProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const sentAt = new Date(item.sentToProductionAt);
      const elapsed = Math.floor((now.getTime() - sentAt.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [item.sentToProductionAt]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const expectedTimeInSeconds = item.prepTime * 60;
  const isOverdue = elapsedTime > expectedTimeInSeconds && item.status !== "ready";
  const progress = Math.min((elapsedTime / expectedTimeInSeconds) * 100, 100);

  const getStatusColor = () => {
    if (item.status === "ready") return "bg-green-500/20 border-green-500";
    if (isOverdue) return "bg-destructive/20 border-destructive";
    if (item.status === "in_production") return "bg-yellow-500/20 border-yellow-500";
    return "bg-muted border-border";
  };

  const getStatusBadge = () => {
    switch (item.status) {
      case "pending":
        return <Badge variant="secondary">Aguardando</Badge>;
      case "in_production":
        return <Badge className="bg-yellow-500 text-yellow-950">Em Preparo</Badge>;
      case "ready":
        return <Badge className="bg-green-500 text-green-950">Pronto</Badge>;
    }
  };

  return (
    <Card className={cn("border-2 transition-all", getStatusColor())}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">#{item.orderNumber}</span>
          {getStatusBadge()}
        </div>

        {/* Customer */}
        <p className="text-sm text-muted-foreground">{item.customerName}</p>

        {/* Product */}
        <div>
          <p className="font-semibold">{item.productName}</p>
          {item.addons.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.addons.map((addon, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  + {addon.name} {addon.quantity > 1 && `(${addon.quantity}x)`}
                </Badge>
              ))}
            </div>
          )}
          {item.observation && (
            <p className="text-xs text-muted-foreground mt-1 italic">
              Obs: {item.observation}
            </p>
          )}
        </div>

        {/* Timer */}
        {item.status !== "ready" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className={cn(isOverdue && "text-destructive font-bold")}>
                  {formatTime(elapsedTime)}
                </span>
              </div>
              <span className="text-muted-foreground">
                Estimado: {item.prepTime} min
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  isOverdue ? "bg-destructive" : "bg-primary"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>

            {isOverdue && (
              <div className="flex items-center gap-1 text-destructive text-xs">
                <AlertTriangle className="h-3 w-3" />
                <span>Tempo excedido!</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="pt-2">
          {item.status === "pending" && (
            <Button
              onClick={() => onStartProduction(item.id)}
              className="w-full"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Iniciar Preparo
            </Button>
          )}
          {item.status === "in_production" && (
            <Button
              onClick={() => onMarkReady(item.id)}
              className="w-full bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar Pronto
            </Button>
          )}
          {item.status === "ready" && (
            <Button
              onClick={() => onMarkDelivered(item.id)}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <Package className="h-4 w-4 mr-2" />
              Entregue
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionItemCard;
