import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, SavedCard } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone: string, cpf: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addToWallet: (amount: number) => void;
  deductFromWallet: (amount: number) => boolean;
  addCard: (card: Omit<SavedCard, 'id'>) => void;
  removeCard: (cardId: string) => void;
  toggleFavorite: (establishmentId: string) => void;
  isFavorite: (establishmentId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: '1',
  name: 'João da Silva',
  email: 'joao@email.com',
  phone: '(11) 99999-9999',
  cpf: '123.456.789-00',
  walletBalance: 150.00,
  savedCards: [
    { id: '1', last4: '4242', brand: 'Visa', expiryMonth: 12, expiryYear: 2026 },
  ],
  favoriteEstablishments: ['1', '3'],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email && password) {
      setUser({ ...mockUser, email });
      return true;
    }
    return false;
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(mockUser);
    return true;
  }, []);

  const signup = useCallback(async (
    name: string, 
    email: string, 
    password: string, 
    phone: string, 
    cpf: string
  ): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (name && email && password && phone && cpf) {
      setUser({
        ...mockUser,
        id: Date.now().toString(),
        name,
        email,
        phone,
        cpf,
        walletBalance: 0,
        savedCards: [],
        favoriteEstablishments: [],
      });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  }, []);

  const addToWallet = useCallback((amount: number) => {
    setUser(prev => prev ? { ...prev, walletBalance: prev.walletBalance + amount } : null);
  }, []);

  const deductFromWallet = useCallback((amount: number): boolean => {
    if (!user || user.walletBalance < amount) return false;
    setUser(prev => prev ? { ...prev, walletBalance: prev.walletBalance - amount } : null);
    return true;
  }, [user]);

  const addCard = useCallback((card: Omit<SavedCard, 'id'>) => {
    setUser(prev => prev ? {
      ...prev,
      savedCards: [...prev.savedCards, { ...card, id: Date.now().toString() }]
    } : null);
  }, []);

  const removeCard = useCallback((cardId: string) => {
    setUser(prev => prev ? {
      ...prev,
      savedCards: prev.savedCards.filter(c => c.id !== cardId)
    } : null);
  }, []);

  const toggleFavorite = useCallback((establishmentId: string) => {
    setUser(prev => {
      if (!prev) return null;
      const isFav = prev.favoriteEstablishments.includes(establishmentId);
      return {
        ...prev,
        favoriteEstablishments: isFav
          ? prev.favoriteEstablishments.filter(id => id !== establishmentId)
          : [...prev.favoriteEstablishments, establishmentId]
      };
    });
  }, []);

  const isFavorite = useCallback((establishmentId: string): boolean => {
    return user?.favoriteEstablishments.includes(establishmentId) ?? false;
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      loginWithGoogle,
      signup,
      logout,
      updateProfile,
      addToWallet,
      deductFromWallet,
      addCard,
      removeCard,
      toggleFavorite,
      isFavorite,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
