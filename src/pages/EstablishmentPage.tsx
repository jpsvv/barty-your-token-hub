import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Clock, MapPin, CreditCard, Star, 
  ChevronRight, Share2, Plus, Minus, X, ShoppingCart, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { StarRating } from '@/components/StarRating';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { establishments, categories, products, reviews } from '@/data/mockData';
import { Product, ProductAddon } from '@/types';
import { cn } from '@/lib/utils';

export default function EstablishmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isFavorite, toggleFavorite } = useAuth();
  const { addItem, hasConflict, forceAddItem, getItemCount } = useCart();

  const establishment = establishments.find(e => e.id === id);
  const establishmentCategories = categories.filter(c => c.establishmentId === id);
  const establishmentProducts = products.filter(p => p.establishmentId === id);
  const establishmentReviews = reviews.filter(r => r.establishmentId === id);
  const highlightProducts = establishmentProducts.filter(p => p.isHighlight);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [productNotes, setProductNotes] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<Map<string, number>>(new Map());
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<{ product: Product; quantity: number } | null>(null);

  const isFav = isAuthenticated && establishment && isFavorite(establishment.id);
  const cartItemCount = getItemCount();

  const displayedProducts = useMemo(() => {
    if (!selectedCategory) return establishmentProducts;
    return establishmentProducts.filter(p => p.categoryId === selectedCategory);
  }, [selectedCategory, establishmentProducts]);

  if (!establishment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Estabelecimento não encontrado</p>
      </div>
    );
  }

  const handleFavorite = () => {
    if (isAuthenticated) {
      toggleFavorite(establishment.id);
    } else {
      toast({ title: 'Faça login', description: 'Entre para favoritar estabelecimentos.' });
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const addons = Array.from(selectedAddons.entries())
      .filter(([_, qty]) => qty > 0)
      .map(([addonId, quantity]) => {
        const addon = selectedProduct.addons?.find(a => a.id === addonId)!;
        return { addon, quantity };
      });

    const success = addItem(selectedProduct, productQuantity, addons, productNotes || undefined);
    
    if (!success) {
      setPendingProduct({ product: selectedProduct, quantity: productQuantity });
      setShowConflictDialog(true);
      return;
    }

    toast({ title: 'Adicionado!', description: `${selectedProduct.name} foi adicionado ao carrinho.` });
    closeProductModal();
  };

  const handleForceAdd = () => {
    if (!pendingProduct || !selectedProduct) return;

    const addons = Array.from(selectedAddons.entries())
      .filter(([_, qty]) => qty > 0)
      .map(([addonId, quantity]) => {
        const addon = selectedProduct.addons?.find(a => a.id === addonId)!;
        return { addon, quantity };
      });

    forceAddItem(selectedProduct, productQuantity, addons, productNotes || undefined);
    toast({ title: 'Carrinho atualizado!', description: 'O carrinho foi limpo e o novo item adicionado.' });
    setShowConflictDialog(false);
    closeProductModal();
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setProductQuantity(1);
    setProductNotes('');
    setSelectedAddons(new Map());
  };

  const getProductTotal = () => {
    if (!selectedProduct) return 0;
    let total = selectedProduct.price * productQuantity;
    selectedAddons.forEach((qty, addonId) => {
      const addon = selectedProduct.addons?.find(a => a.id === addonId);
      if (addon) {
        total += addon.price * qty * productQuantity;
      }
    });
    return total;
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(addonId) || 0;
      newMap.set(addonId, current > 0 ? 0 : 1);
      return newMap;
    });
  };

  const getValidityText = () => {
    if (!establishment) return '';
    const validity = establishment.ticketValidity;
    
    switch (validity.type) {
      case 'same_day':
        return 'Válido apenas no dia da compra';
      case 'fixed_date':
        const date = new Date(validity.fixedDate + 'T00:00:00');
        return `Válido até ${date.toLocaleDateString('pt-BR')}`;
      case 'days':
      default:
        return `Válido por ${validity.days || 30} dias após a compra`;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative">
        <img 
          src={establishment.coverImage} 
          alt={establishment.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-background/80 backdrop-blur-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-background/80 backdrop-blur-sm"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "bg-background/80 backdrop-blur-sm",
                isFav && "text-destructive"
              )}
              onClick={handleFavorite}
            >
              <Heart className={cn("h-5 w-5", isFav && "fill-current")} />
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end gap-4">
            <img 
              src={establishment.logo} 
              alt={establishment.name}
              className="h-20 w-20 rounded-xl object-cover border-4 border-background shadow-lg"
            />
            <div className="flex-1 mb-1">
              <h1 className="text-xl font-bold">{establishment.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={establishment.rating} size="sm" showValue />
                <span className="text-xs text-muted-foreground">
                  ({establishment.reviewCount} avaliações)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container py-4 space-y-6">
        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div className="text-sm">
              <p className="text-muted-foreground">Horário</p>
              <p className="font-medium text-xs">{establishment.openingHours.split('|')[0]}</p>
            </div>
          </Card>
          <Card className="p-3 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div className="text-sm">
              <p className="text-muted-foreground">Local</p>
              <p className="font-medium text-xs truncate">{establishment.address.split('-')[0]}</p>
            </div>
          </Card>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground">{establishment.description}</p>

        {/* Highlights */}
        {highlightProducts.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Destaques 🔥</h2>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-3">
                {highlightProducts.map(product => (
                  <Card 
                    key={product.id}
                    className="shrink-0 w-40 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-2">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            R$ {product.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className={cn(
                          "text-sm font-semibold",
                          product.discountPercent && "text-success"
                        )}>
                          R$ {product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>
        )}

        {/* Categories Navigation */}
        <section>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "gradient-primary" : ""}
              >
                Todos
              </Button>
              {establishmentCategories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "gradient-primary" : ""}
                >
                  {category.name}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        {/* Products List */}
        <section className="space-y-3">
          {displayedProducts.map(product => (
            <Card 
              key={product.id}
              className="flex gap-3 p-3 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setSelectedProduct(product)}
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="h-20 w-20 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium">{product.name}</h3>
                  {product.discountPercent && (
                    <Badge className="bg-success text-success-foreground shrink-0">
                      -{product.discountPercent}%
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {product.prepTime} min
                  </div>
                  <div className="flex items-center gap-2">
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        R$ {product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className={cn(
                      "font-semibold",
                      product.discountPercent && "text-success"
                    )}>
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </section>
      </main>

      {/* Cart FAB */}
      {cartItemCount > 0 && (
        <Button
          className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-glow gradient-primary"
          onClick={() => navigate('/cart')}
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
              {cartItemCount > 9 ? '9+' : cartItemCount}
            </span>
          </div>
        </Button>
      )}

      {/* Product Modal */}
      <Drawer open={!!selectedProduct} onOpenChange={(open) => !open && closeProductModal()}>
        <DrawerContent className="max-h-[90vh]">
          {selectedProduct && (
            <>
              <DrawerHeader className="p-0">
                <div className="relative">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
                    onClick={closeProductModal}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </DrawerHeader>
              
              <ScrollArea className="flex-1 max-h-[50vh]">
                <div className="p-4 space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <DrawerTitle className="text-xl">{selectedProduct.name}</DrawerTitle>
                      {selectedProduct.discountPercent && (
                        <Badge className="bg-success text-success-foreground">
                          -{selectedProduct.discountPercent}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Tempo de preparo: ~{selectedProduct.prepTime} min
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {getValidityText()}
                    </div>
                    <p className="text-muted-foreground mt-2">{selectedProduct.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedProduct.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        R$ {selectedProduct.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className={cn(
                      "text-2xl font-bold",
                      selectedProduct.discountPercent && "text-success"
                    )}>
                      R$ {selectedProduct.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Addons */}
                  {selectedProduct.addons && selectedProduct.addons.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Adicionais</h4>
                      <div className="space-y-2">
                        {selectedProduct.addons.map(addon => (
                          <Card 
                            key={addon.id}
                            className={cn(
                              "flex items-center justify-between p-3 cursor-pointer transition-colors",
                              (selectedAddons.get(addon.id) || 0) > 0 && "border-primary"
                            )}
                            onClick={() => toggleAddon(addon.id)}
                          >
                            <div>
                              <p className="font-medium">{addon.name}</p>
                              <p className="text-sm text-success">+ R$ {addon.price.toFixed(2)}</p>
                            </div>
                            <div className={cn(
                              "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                              (selectedAddons.get(addon.id) || 0) > 0 
                                ? "border-primary bg-primary" 
                                : "border-muted-foreground"
                            )}>
                              {(selectedAddons.get(addon.id) || 0) > 0 && (
                                <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <h4 className="font-semibold mb-2">Observações</h4>
                    <Textarea
                      placeholder="Ex: Sem cebola, sem gelo..."
                      value={productNotes}
                      onChange={(e) => setProductNotes(e.target.value)}
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="p-4 border-t border-border space-y-3">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-semibold w-8 text-center">{productQuantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setProductQuantity(productQuantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  className="w-full h-12 text-lg gradient-primary"
                  onClick={handleAddToCart}
                >
                  Adicionar • R$ {getProductTotal().toFixed(2)}
                </Button>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* Conflict Dialog */}
      <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Limpar carrinho?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Seu carrinho contém produtos de outro estabelecimento. 
            Deseja limpar o carrinho e adicionar este item?
          </p>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowConflictDialog(false)}>
              Cancelar
            </Button>
            <Button className="flex-1 gradient-primary" onClick={handleForceAdd}>
              Limpar e adicionar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
}
