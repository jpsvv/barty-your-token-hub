import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartItem, Product, ProductAddon } from '@/types';

interface CartContextType {
  items: CartItem[];
  currentEstablishmentId: string | null;
  addItem: (product: Product, quantity: number, addons?: { addon: ProductAddon; quantity: number }[], notes?: string) => boolean;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  hasConflict: (establishmentId: string) => boolean;
  forceAddItem: (product: Product, quantity: number, addons?: { addon: ProductAddon; quantity: number }[], notes?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currentEstablishmentId, setCurrentEstablishmentId] = useState<string | null>(null);

  const hasConflict = useCallback((establishmentId: string): boolean => {
    return currentEstablishmentId !== null && currentEstablishmentId !== establishmentId && items.length > 0;
  }, [currentEstablishmentId, items.length]);

  const addItem = useCallback((
    product: Product, 
    quantity: number, 
    addons: { addon: ProductAddon; quantity: number }[] = [],
    notes?: string
  ): boolean => {
    if (hasConflict(product.establishmentId)) {
      return false; // Conflict detected
    }

    setCurrentEstablishmentId(product.establishmentId);
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && 
        JSON.stringify(item.addons) === JSON.stringify(addons) &&
        item.notes === notes
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }

      return [...prev, {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity,
        addons,
        notes,
        establishmentId: product.establishmentId,
      }];
    });

    return true;
  }, [hasConflict]);

  const forceAddItem = useCallback((
    product: Product, 
    quantity: number, 
    addons: { addon: ProductAddon; quantity: number }[] = [],
    notes?: string
  ) => {
    setItems([{
      id: `${product.id}-${Date.now()}`,
      product,
      quantity,
      addons,
      notes,
      establishmentId: product.establishmentId,
    }]);
    setCurrentEstablishmentId(product.establishmentId);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => {
      const updated = prev.filter(item => item.id !== itemId);
      if (updated.length === 0) {
        setCurrentEstablishmentId(null);
      }
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setCurrentEstablishmentId(null);
  }, []);

  const getTotal = useCallback((): number => {
    return items.reduce((total, item) => {
      const itemTotal = item.product.price * item.quantity;
      const addonsTotal = item.addons.reduce(
        (sum, { addon, quantity }) => sum + addon.price * quantity * item.quantity, 
        0
      );
      return total + itemTotal + addonsTotal;
    }, 0);
  }, [items]);

  const getItemCount = useCallback((): number => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider value={{
      items,
      currentEstablishmentId,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount,
      hasConflict,
      forceAddItem,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
