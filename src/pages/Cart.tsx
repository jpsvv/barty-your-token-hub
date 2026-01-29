import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, Clock, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useCart } from '@/contexts/CartContext';
import { establishments } from '@/data/mockData';

export default function Cart() {
  const navigate = useNavigate();
  const { items, currentEstablishmentId, updateQuantity, removeItem, clearCart, getTotal } = useCart();

  const establishment = establishments.find(e => e.id === currentEstablishmentId);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="container py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Carrinho</h1>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Carrinho vazio</h2>
          <p className="text-muted-foreground mb-6">
            Adicione produtos para começar seu pedido
          </p>
          <Button onClick={() => navigate('/home')} className="gradient-primary">
            Explorar estabelecimentos
          </Button>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Carrinho</h1>
                {establishment && (
                  <p className="text-sm text-muted-foreground">{establishment.name}</p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={clearCart}>
              Limpar
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-4 space-y-4">
        {items.map(item => (
          <Card key={item.id} className="p-4">
            <div className="flex gap-3">
              <img 
                src={item.product.image} 
                alt={item.product.name}
                className="h-20 w-20 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive shrink-0"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {item.addons.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    + {item.addons.map(a => a.addon.name).join(', ')}
                  </p>
                )}
                
                {item.notes && (
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    "{item.notes}"
                  </p>
                )}

                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <Clock className="h-3 w-3" />
                  {item.product.prepTime} min
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-semibold w-6 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="font-semibold">
                    R$ {(
                      (item.product.price + item.addons.reduce((sum, a) => sum + a.addon.price * a.quantity, 0)) * 
                      item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate(`/establishment/${currentEstablishmentId}`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar mais itens
        </Button>
      </main>

      {/* Checkout Footer */}
      <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="text-2xl font-bold">R$ {getTotal().toFixed(2)}</span>
        </div>
        <Button 
          className="w-full h-12 text-lg gradient-primary"
          onClick={() => navigate('/checkout')}
        >
          Finalizar pedido
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
}
