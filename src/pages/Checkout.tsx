import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Wallet, QrCode, Banknote, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/contexts/TicketsContext';
import { useToast } from '@/hooks/use-toast';
import { establishments } from '@/data/mockData';
import { cn } from '@/lib/utils';

type PaymentMethod = 'credit_card' | 'pix' | 'cash' | 'wallet';

const paymentMethods = [
  { id: 'credit_card' as PaymentMethod, label: 'Cartão de Crédito', icon: CreditCard },
  { id: 'pix' as PaymentMethod, label: 'PIX', icon: QrCode },
  { id: 'cash' as PaymentMethod, label: 'Dinheiro', icon: Banknote },
  { id: 'wallet' as PaymentMethod, label: 'Carteira Barty', icon: Wallet },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, currentEstablishmentId, getTotal, clearCart } = useCart();
  const { user, deductFromWallet, isAuthenticated } = useAuth();
  const { createOrder } = useTickets();

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getTotal();
  const establishment = establishments.find(e => e.id === currentEstablishmentId);
  const canUseWallet = isAuthenticated && user && user.walletBalance >= total;

  const handlePayment = async () => {
    if (!currentEstablishmentId) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (selectedPayment === 'wallet') {
      if (!canUseWallet) {
        toast({ 
          title: 'Saldo insuficiente', 
          description: 'Adicione saldo à sua carteira ou escolha outro método.',
          variant: 'destructive'
        });
        setIsProcessing(false);
        return;
      }
      deductFromWallet(total);
    }

    // Create order and tickets
    const orderItems = items.map(item => ({
      product: item.product,
      quantity: item.quantity,
      addons: item.addons.map(a => ({
        name: a.addon.name,
        price: a.addon.price,
        quantity: a.quantity,
      })),
    }));

    createOrder(orderItems, currentEstablishmentId, selectedPayment, total);

    clearCart();
    setIsProcessing(false);

    toast({ 
      title: 'Pagamento confirmado! 🎉', 
      description: 'Suas fichas já estão disponíveis.'
    });

    navigate('/tickets');
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Pagamento</h1>
        </div>
      </header>

      <main className="container py-4 space-y-6">
        {/* Order Summary */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Resumo do pedido</h2>
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.product.name}
                </span>
                <span>
                  R$ {(
                    (item.product.price + item.addons.reduce((sum, a) => sum + a.addon.price * a.quantity, 0)) * 
                    item.quantity
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-lg">R$ {total.toFixed(2)}</span>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">Forma de pagamento</h2>
          <RadioGroup 
            value={selectedPayment} 
            onValueChange={(v) => setSelectedPayment(v as PaymentMethod)}
            className="space-y-3"
          >
            {paymentMethods.map(method => {
              const Icon = method.icon;
              const isWallet = method.id === 'wallet';
              const isDisabled = isWallet && !canUseWallet;

              return (
                <div key={method.id}>
                  <Label
                    htmlFor={method.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedPayment === method.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50",
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <RadioGroupItem value={method.id} id={method.id} disabled={isDisabled} />
                    <Icon className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{method.label}</p>
                      {isWallet && isAuthenticated && (
                        <p className={cn(
                          "text-xs",
                          canUseWallet ? "text-success" : "text-destructive"
                        )}>
                          Saldo: R$ {user?.walletBalance.toFixed(2)}
                          {!canUseWallet && " (insuficiente)"}
                        </p>
                      )}
                    </div>
                    {selectedPayment === method.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </Card>

        {/* Credit Card Selection (if applicable) */}
        {selectedPayment === 'credit_card' && isAuthenticated && user?.savedCards.length > 0 && (
          <Card className="p-4">
            <h2 className="font-semibold mb-3">Cartão salvo</h2>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-primary bg-primary/5">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">
                  {user.savedCards[0].brand} •••• {user.savedCards[0].last4}
                </p>
                <p className="text-xs text-muted-foreground">
                  Expira {user.savedCards[0].expiryMonth}/{user.savedCards[0].expiryYear}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* PIX Info */}
        {selectedPayment === 'pix' && (
          <Card className="p-4 bg-primary/5 border-primary/20">
            <p className="text-sm text-muted-foreground">
              Após confirmar, você receberá um QR Code PIX para pagamento instantâneo.
            </p>
          </Card>
        )}

        {/* Cash Info */}
        {selectedPayment === 'cash' && (
          <Card className="p-4 bg-accent/10 border-accent/20">
            <p className="text-sm text-muted-foreground">
              Seu pedido ficará em espera. Dirija-se ao caixa do estabelecimento para efetuar o pagamento.
            </p>
          </Card>
        )}
      </main>

      {/* Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <Button 
          className="w-full h-12 text-lg gradient-primary"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            `Pagar R$ ${total.toFixed(2)}`
          )}
        </Button>
      </div>
    </div>
  );
}
