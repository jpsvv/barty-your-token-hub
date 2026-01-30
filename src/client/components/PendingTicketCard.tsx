import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Clock, ChefHat, Package } from "lucide-react";
import { PendingTicket } from "@/types/client";

interface PendingTicketCardProps {
  ticket: PendingTicket;
  requiresPreparation: boolean;
  onSendToProduction: (ticketId: string) => void;
  onMarkPickup: (ticketId: string) => void;
}

const PendingTicketCard = ({
  ticket,
  requiresPreparation,
  onSendToProduction,
  onMarkPickup,
}: PendingTicketCardProps) => {
  const getStatusBadge = () => {
    switch (ticket.status) {
      case "not_sent":
        return <Badge variant="secondary">Aguardando</Badge>;
      case "in_production":
        return <Badge className="bg-yellow-500 text-yellow-950">Em Produção</Badge>;
      case "ready":
        return <Badge className="bg-green-500 text-green-950">Pronto</Badge>;
    }
  };

  const timeSincePurchase = () => {
    const now = new Date();
    const purchased = new Date(ticket.purchasedAt);
    const diffMinutes = Math.floor((now.getTime() - purchased.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes} min atrás`;
    const hours = Math.floor(diffMinutes / 60);
    return `${hours}h ${diffMinutes % 60}min atrás`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{ticket.userName}</span>
              {getStatusBadge()}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {ticket.userPhone}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeSincePurchase()}
              </div>
            </div>

            <p className="text-sm font-medium">{ticket.productName}</p>
          </div>

          <div className="flex gap-2">
            {ticket.status === "not_sent" && requiresPreparation && (
              <Button
                size="sm"
                onClick={() => onSendToProduction(ticket.ticketId)}
              >
                <ChefHat className="h-4 w-4 mr-1" />
                Produção
              </Button>
            )}
            {(ticket.status === "not_sent" && !requiresPreparation) ||
            ticket.status === "ready" ? (
              <Button
                size="sm"
                variant={ticket.status === "ready" ? "default" : "outline"}
                onClick={() => onMarkPickup(ticket.ticketId)}
              >
                <Package className="h-4 w-4 mr-1" />
                Retirar
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingTicketCard;
