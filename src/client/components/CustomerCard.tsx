import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Mail, ShoppingBag, DollarSign, Eye } from "lucide-react";
import { ClientCustomer } from "@/types/client";

interface CustomerCardProps {
  customer: ClientCustomer;
  onViewDetails: (customer: ClientCustomer) => void;
}

const CustomerCard = ({ customer, onViewDetails }: CustomerCardProps) => {
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formatDate = (date?: Date) => {
    if (!date) return "Nunca";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold truncate">{customer.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{customer.phone}</span>
                </div>
              </div>
              {customer.availableTickets.length > 0 && (
                <Badge variant="secondary">
                  {customer.availableTickets.length} fichas
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="font-medium">
                  R$ {customer.totalSpent.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <ShoppingBag className="h-4 w-4" />
                <span>{customer.totalOrders} pedidos</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">
                Último pedido: {formatDate(customer.lastOrderAt)}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails(customer)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Detalhes
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
