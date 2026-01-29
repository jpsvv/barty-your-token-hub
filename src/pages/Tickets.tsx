import { useState, useMemo, useEffect } from 'react';
import { 
  Ticket as TicketIcon, History, Clock, Gift, QrCode, 
  ChevronRight, AlertTriangle, X, Send, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useTickets } from '@/contexts/TicketsContext';
import { useToast } from '@/hooks/use-toast';
import { Ticket } from '@/types';
import { cn } from '@/lib/utils';

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}min`;
  }
  return `${minutes}min`;
}

function TicketCard({ 
  ticket, 
  isSelected, 
  onSelect, 
  onSendToProduction,
  onGift 
}: { 
  ticket: Ticket;
  isSelected: boolean;
  onSelect: () => void;
  onSendToProduction: () => void;
  onGift: () => void;
}) {
  const isAvailable = ticket.status === 'available';
  const isReady = ticket.status === 'ready';
  const isInProduction = ticket.status === 'sent_to_production' || ticket.status === 'in_production';
  const needsProduction = ticket.product.requiresPreparation && isAvailable;
  const canSelect = !needsProduction && ['available', 'sent_to_production', 'in_production', 'ready'].includes(ticket.status);

  const timeElapsed = ticket.sentToProductionAt ? formatTime(ticket.sentToProductionAt) : null;
  const isPrepTimeExceeded = ticket.sentToProductionAt && 
    (new Date().getTime() - ticket.sentToProductionAt.getTime()) > ticket.product.prepTime * 60000;

  return (
    <Card 
      className={cn(
        "p-4 transition-all",
        canSelect && "cursor-pointer",
        isSelected && "border-primary ring-2 ring-primary/20"
      )}
      onClick={() => canSelect && onSelect()}
    >
      <div className="flex gap-3">
        <img 
          src={ticket.product.image} 
          alt={ticket.product.name}
          className="h-16 w-16 rounded-lg object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium">{ticket.product.name}</h3>
            {isReady && (
              <Badge className="bg-success text-success-foreground shrink-0">
                Pronto!
              </Badge>
            )}
            {isInProduction && (
              <Badge variant="secondary" className="shrink-0">
                Em preparo
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">
            R$ {ticket.product.price.toFixed(2)}
          </p>

          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            ~{ticket.product.prepTime} min
            {isInProduction && timeElapsed && (
              <span className={cn(
                "ml-2",
                isPrepTimeExceeded && "text-destructive font-medium"
              )}>
                • Decorrido: {timeElapsed}
              </span>
            )}
          </div>

          {isPrepTimeExceeded && isInProduction && (
            <p className="text-xs text-destructive mt-1 font-medium">
              ⚠️ Verifique no balcão
            </p>
          )}

          <p className="text-xs text-muted-foreground mt-1">
            Pedido #{ticket.orderNumber}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        {needsProduction && (
          <Button 
            size="sm" 
            className="flex-1 gradient-primary"
            onClick={(e) => {
              e.stopPropagation();
              onSendToProduction();
            }}
          >
            <Send className="h-4 w-4 mr-1" />
            Enviar para preparo
          </Button>
        )}
        {isAvailable && !needsProduction && (
          <Button 
            size="sm" 
            variant="outline"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onGift();
            }}
          >
            <Gift className="h-4 w-4 mr-1" />
            Presentear
          </Button>
        )}
      </div>

      {/* Selection indicator */}
      {canSelect && (
        <div className="absolute top-3 right-3">
          <div className={cn(
            "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
            isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
          )}>
            {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
          </div>
        </div>
      )}
    </Card>
  );
}

export default function Tickets() {
  const { toast } = useToast();
  const { tickets, orders, sendToProduction, useTickets: consumeTickets, giftTicket, getTicketsByEstablishment } = useTickets();
  
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showProductionAlert, setShowProductionAlert] = useState(false);
  const [ticketToProduction, setTicketToProduction] = useState<string | null>(null);
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [ticketToGift, setTicketToGift] = useState<string | null>(null);
  const [giftPhone, setGiftPhone] = useState('');
  const [openEstablishments, setOpenEstablishments] = useState<string[]>([]);

  const ticketsByEstablishment = getTicketsByEstablishment();
  const activeTickets = tickets.filter(t => 
    ['available', 'sent_to_production', 'in_production', 'ready'].includes(t.status)
  );
  const hasManufacturedInSelection = selectedTickets.some(id => {
    const ticket = tickets.find(t => t.id === id);
    return ticket?.status === 'sent_to_production' || ticket?.status === 'in_production';
  });

  const toggleTicket = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSendToProduction = (ticketId: string) => {
    setTicketToProduction(ticketId);
    setShowProductionAlert(true);
  };

  const confirmSendToProduction = () => {
    if (ticketToProduction) {
      sendToProduction(ticketToProduction);
      toast({ title: 'Enviado!', description: 'Seu pedido foi enviado para preparo.' });
    }
    setShowProductionAlert(false);
    setTicketToProduction(null);
  };

  const handleGift = (ticketId: string) => {
    setTicketToGift(ticketId);
    setShowGiftDialog(true);
  };

  const confirmGift = () => {
    if (ticketToGift && giftPhone) {
      giftTicket(ticketToGift, giftPhone);
      toast({ title: 'Ficha enviada!', description: `A ficha foi enviada para ${giftPhone}.` });
    }
    setShowGiftDialog(false);
    setTicketToGift(null);
    setGiftPhone('');
  };

  const handleGenerateQR = () => {
    if (selectedTickets.length === 0) {
      toast({ title: 'Selecione fichas', description: 'Escolha as fichas que deseja usar.' });
      return;
    }
    setShowQRCode(true);
  };

  const handleUseTickets = () => {
    consumeTickets(selectedTickets);
    setShowQRCode(false);
    setSelectedTickets([]);
    toast({ title: 'Fichas utilizadas! 🎉', description: 'Aproveite!' });
  };

  const toggleEstablishment = (establishmentId: string) => {
    setOpenEstablishments(prev =>
      prev.includes(establishmentId)
        ? prev.filter(id => id !== establishmentId)
        : [...prev, establishmentId]
    );
  };

  // Auto-open first establishment
  useEffect(() => {
    const keys = Array.from(ticketsByEstablishment.keys());
    if (keys.length > 0 && openEstablishments.length === 0) {
      setOpenEstablishments([keys[0]]);
    }
  }, [ticketsByEstablishment]);

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container py-4">
          <h1 className="text-2xl font-bold">Minhas Fichas</h1>
        </div>
      </header>

      <main className="container py-4">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <TicketIcon className="h-4 w-4" />
              Fichas
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeTickets.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                  <TicketIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold mb-2">Nenhuma ficha</h2>
                <p className="text-muted-foreground">
                  Compre fichas em um estabelecimento para começar
                </p>
              </div>
            ) : (
              Array.from(ticketsByEstablishment.entries()).map(([establishmentId, estTickets]: [string, Ticket[]]) => {
                const establishment = estTickets[0]?.establishment;
                const isOpen = openEstablishments.includes(establishmentId);

                return (
                  <Collapsible 
                    key={establishmentId}
                    open={isOpen}
                    onOpenChange={() => toggleEstablishment(establishmentId)}
                  >
                    <CollapsibleTrigger asChild>
                      <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <img 
                            src={establishment?.logo} 
                            alt={establishment?.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{establishment?.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {estTickets.length} ficha{estTickets.length > 1 ? 's' : ''}
                            </p>
                          </div>
                          <ChevronRight className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform",
                            isOpen && "rotate-90"
                          )} />
                        </div>
                      </Card>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 mt-3">
                      {estTickets.map(ticket => (
                        <div key={ticket.id} className="relative">
                          <TicketCard
                            ticket={ticket}
                            isSelected={selectedTickets.includes(ticket.id)}
                            onSelect={() => toggleTicket(ticket.id)}
                            onSendToProduction={() => handleSendToProduction(ticket.id)}
                            onGift={() => handleGift(ticket.id)}
                          />
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                  <History className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold mb-2">Sem histórico</h2>
                <p className="text-muted-foreground">
                  Suas compras aparecerão aqui
                </p>
              </div>
            ) : (
              orders.map(order => (
                <Card key={order.id} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={order.establishment.logo}
                      alt={order.establishment.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{order.establishment.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {order.createdAt.toLocaleDateString('pt-BR')} às {order.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Badge variant="secondary">#{order.orderNumber}</Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-muted-foreground">
                        <span>{item.quantity}x {item.productName}</span>
                        <span>R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-medium mt-2 pt-2 border-t border-border">
                    <span>Total</span>
                    <span>R$ {order.total.toFixed(2)}</span>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Generate QR Button */}
      {selectedTickets.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 bg-card border-t border-border p-4">
          <Button 
            className="w-full h-12 text-lg gradient-primary"
            onClick={handleGenerateQR}
          >
            <QrCode className="h-5 w-5 mr-2" />
            Gerar QR Code ({selectedTickets.length} ficha{selectedTickets.length > 1 ? 's' : ''})
          </Button>
        </div>
      )}

      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code de Retirada</DialogTitle>
            <DialogDescription>
              Mostre este código ao staff para retirar seus produtos
            </DialogDescription>
          </DialogHeader>
          
          {hasManufacturedInSelection && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Atenção: há produtos em preparo nesta seleção</span>
            </div>
          )}

          <div className="flex flex-col items-center py-6">
            <div className="h-48 w-48 bg-white rounded-lg flex items-center justify-center p-4">
              <QrCode className="h-full w-full text-black" />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {selectedTickets.length} ficha{selectedTickets.length > 1 ? 's' : ''} selecionada{selectedTickets.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-2">
            {selectedTickets.map(id => {
              const ticket = tickets.find(t => t.id === id);
              return ticket && (
                <div key={id} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-success" />
                  <span>{ticket.product.name}</span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowQRCode(false)}>
              Fechar
            </Button>
            <Button className="flex-1 gradient-primary" onClick={handleUseTickets}>
              Simular leitura
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Production Alert */}
      <AlertDialog open={showProductionAlert} onOpenChange={setShowProductionAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enviar para preparo?</AlertDialogTitle>
            <AlertDialogDescription>
              Uma vez enviado, você terá <strong>4 horas</strong> para retirar o produto, 
              ou a ficha será perdida. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSendToProduction} className="gradient-primary">
              Confirmar envio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Gift Dialog */}
      <Dialog open={showGiftDialog} onOpenChange={setShowGiftDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Presentear ficha</DialogTitle>
            <DialogDescription>
              Digite o telefone da pessoa que receberá esta ficha
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="(11) 99999-9999"
            value={giftPhone}
            onChange={(e) => setGiftPhone(e.target.value)}
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowGiftDialog(false)}>
              Cancelar
            </Button>
            <Button 
              className="flex-1 gradient-primary" 
              onClick={confirmGift}
              disabled={!giftPhone}
            >
              <Gift className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
}
