import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Ticket, Order, Product, Establishment, WalletTransaction } from '@/types';
import { establishments, products } from '@/data/mockData';

interface TicketsContextType {
  tickets: Ticket[];
  orders: Order[];
  transactions: WalletTransaction[];
  createOrder: (
    items: { product: Product; quantity: number; addons: { name: string; price: number; quantity: number }[] }[],
    establishmentId: string,
    paymentMethod: 'credit_card' | 'pix' | 'cash' | 'wallet',
    total: number
  ) => Order;
  sendToProduction: (ticketId: string) => void;
  markAsReady: (ticketId: string) => void;
  useTickets: (ticketIds: string[]) => void;
  giftTicket: (ticketId: string, phoneNumber: string) => void;
  getTicketsByEstablishment: () => Map<string, Ticket[]>;
  addTransaction: (transaction: Omit<WalletTransaction, 'id' | 'createdAt'>) => void;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  const createOrder = useCallback((
    items: { product: Product; quantity: number; addons: { name: string; price: number; quantity: number }[] }[],
    establishmentId: string,
    paymentMethod: 'credit_card' | 'pix' | 'cash' | 'wallet',
    total: number
  ): Order => {
    const orderNumber = `${Date.now().toString().slice(-6)}`;
    const establishment = establishments.find(e => e.id === establishmentId)!;
    
    const order: Order = {
      id: Date.now().toString(),
      orderNumber,
      userId: '1',
      establishmentId,
      establishment,
      items: items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        addons: item.addons,
      })),
      total,
      paymentMethod,
      status: 'paid',
      createdAt: new Date(),
    };

    setOrders(prev => [order, ...prev]);

    // Create tickets for each item
    const newTickets: Ticket[] = [];
    items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        const ticket: Ticket = {
          id: `${Date.now()}-${item.product.id}-${i}`,
          productId: item.product.id,
          product: item.product,
          establishmentId,
          establishment,
          orderId: order.id,
          orderNumber,
          status: 'available',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          createdAt: new Date(),
        };
        newTickets.push(ticket);
      }
    });

    setTickets(prev => [...newTickets, ...prev]);

    // Add transaction
    addTransaction({
      userId: '1',
      type: 'purchase',
      amount: -total,
      description: `Compra em ${establishment.name}`,
      establishmentName: establishment.name,
      orderNumber,
    });

    return order;
  }, []);

  const sendToProduction = useCallback((ticketId: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId && ticket.status === 'available') {
        return {
          ...ticket,
          status: 'sent_to_production' as const,
          sentToProductionAt: new Date(),
          expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        };
      }
      return ticket;
    }));
  }, []);

  const markAsReady = useCallback((ticketId: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId && (ticket.status === 'sent_to_production' || ticket.status === 'in_production')) {
        return {
          ...ticket,
          status: 'ready' as const,
          readyAt: new Date(),
        };
      }
      return ticket;
    }));
  }, []);

  const useTickets = useCallback((ticketIds: string[]) => {
    setTickets(prev => prev.map(ticket => {
      if (ticketIds.includes(ticket.id)) {
        return {
          ...ticket,
          status: 'used' as const,
          usedAt: new Date(),
        };
      }
      return ticket;
    }));
  }, []);

  const giftTicket = useCallback((ticketId: string, phoneNumber: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId && ticket.status === 'available') {
        return {
          ...ticket,
          status: 'gifted' as const,
          giftedTo: phoneNumber,
        };
      }
      return ticket;
    }));
  }, []);

  const getTicketsByEstablishment = useCallback((): Map<string, Ticket[]> => {
    const map = new Map<string, Ticket[]>();
    tickets
      .filter(t => ['available', 'sent_to_production', 'in_production', 'ready'].includes(t.status))
      .forEach(ticket => {
        const existing = map.get(ticket.establishmentId) || [];
        map.set(ticket.establishmentId, [...existing, ticket]);
      });
    return map;
  }, [tickets]);

  const addTransaction = useCallback((transaction: Omit<WalletTransaction, 'id' | 'createdAt'>) => {
    setTransactions(prev => [{
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date(),
    }, ...prev]);
  }, []);

  return (
    <TicketsContext.Provider value={{
      tickets,
      orders,
      transactions,
      createOrder,
      sendToProduction,
      markAsReady,
      useTickets,
      giftTicket,
      getTicketsByEstablishment,
      addTransaction,
    }}>
      {children}
    </TicketsContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketsContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketsProvider');
  }
  return context;
}
