import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Phone,
  Mail,
  CreditCard,
  ShoppingBag,
  Ticket,
  Gift,
  Clock,
  AlertTriangle,
  ChefHat,
  CheckCircle,
} from "lucide-react";
import { ClientCustomer, CustomerTicket } from "@/types/client";

interface CustomerDetailsProps {
  customer: ClientCustomer | null;
  isOpen: boolean;
  onClose: () => void;
  onGiftItem: (customerId: string) => void;
  onMakeOrder: (customerId: string) => void;
}

const CustomerDetails = ({
  customer,
  isOpen,
  onClose,
  onGiftItem,
  onMakeOrder,
}: CustomerDetailsProps) => {
  const [activeTab, setActiveTab] = useState("tickets");

  if (!customer) return null;

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpiringSoon = (expiresAt: Date) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffHours = (expires.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24 && diffHours > 0;
  };

  const isExpired = (expiresAt: Date) => {
    return new Date(expiresAt) < new Date();
  };

  const getTicketStatusBadge = (ticket: CustomerTicket) => {
    if (isExpired(ticket.expiresAt)) {
      return <Badge variant="destructive">Expirada</Badge>;
    }
    switch (ticket.status) {
      case "available":
        return <Badge variant="secondary">Disponível</Badge>;
      case "in_production":
        return <Badge className="bg-yellow-500 text-yellow-950">Em Produção</Badge>;
      case "ready":
        return <Badge className="bg-green-500 text-green-950">Pronto</Badge>;
    }
  };

  const getTicketStatusIcon = (ticket: CustomerTicket) => {
    switch (ticket.status) {
      case "available":
        return <Ticket className="h-4 w-4 text-muted-foreground" />;
      case "in_production":
        return <ChefHat className="h-4 w-4 text-yellow-500" />;
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const activeTickets = customer.availableTickets.filter(
    (t) => !isExpired(t.expiresAt)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
        </DialogHeader>

        {/* Customer Header */}
        <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-xl font-bold">{customer.name}</h2>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {customer.email}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {customer.phone}
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                CPF: {customer.cpf}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-500/10 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              R$ {customer.totalSpent.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Total Gasto</p>
          </div>
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <p className="text-2xl font-bold text-primary">
              {customer.totalOrders}
            </p>
            <p className="text-sm text-muted-foreground">Pedidos</p>
          </div>
          <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {activeTickets.length}
            </p>
            <p className="text-sm text-muted-foreground">Fichas Ativas</p>
          </div>
        </div>

        <Separator />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Fichas ({activeTickets.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Histórico ({customer.orderHistory.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            {activeTickets.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Este cliente não possui fichas ativas
              </p>
            ) : (
              <div className="space-y-3">
                {activeTickets.map((ticket) => (
                  <div
                    key={ticket.ticketId}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getTicketStatusIcon(ticket)}
                      <div>
                        <p className="font-medium">{ticket.productName}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Compra: {formatDate(ticket.purchasedAt)}</span>
                          <span>•</span>
                          <span
                            className={
                              isExpiringSoon(ticket.expiresAt)
                                ? "text-yellow-600 font-medium"
                                : ""
                            }
                          >
                            Expira: {formatDate(ticket.expiresAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isExpiringSoon(ticket.expiresAt) && (
                        <div className="flex items-center gap-1 text-yellow-600 text-xs">
                          <AlertTriangle className="h-3 w-3" />
                          Expira hoje!
                        </div>
                      )}
                      {getTicketStatusBadge(ticket)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {customer.orderHistory.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Este cliente ainda não fez nenhum pedido
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-center">Itens</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customer.orderHistory.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell className="font-mono font-bold">
                        #{order.orderNumber}
                      </TableCell>
                      <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                      <TableCell className="text-center">
                        {order.itemsCount}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {order.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>

        <Separator />

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onGiftItem(customer.id)}>
            <Gift className="h-4 w-4 mr-2" />
            Presentear Item
          </Button>
          <Button onClick={() => onMakeOrder(customer.id)}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Fazer Pedido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetails;
