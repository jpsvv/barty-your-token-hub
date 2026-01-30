import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Client, ClientEmployee, ClientAuthState, ClientPermission } from '@/types/client';
import { mockClient, mockEmployee } from '@/data/mockClientData';

interface ClientAuthContextType extends ClientAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: ClientPermission) => boolean;
  updateClient: (data: Partial<Client>) => void;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ClientAuthState>({
    client: null,
    employee: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    // Simula autenticação com delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock: aceita qualquer email/senha para demo
    if (email && password) {
      setState({
        client: mockClient,
        employee: mockEmployee,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }

    setState((prev) => ({ ...prev, isLoading: false }));
    return false;
  }, []);

  const logout = useCallback(() => {
    setState({
      client: null,
      employee: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const hasPermission = useCallback(
    (permission: ClientPermission): boolean => {
      if (!state.employee) return false;
      if (state.employee.role === 'admin') return true;
      return state.employee.permissions.includes(permission);
    },
    [state.employee]
  );

  const updateClient = useCallback((data: Partial<Client>) => {
    setState((prev) => ({
      ...prev,
      client: prev.client ? { ...prev.client, ...data } : null,
    }));
  }, []);

  return (
    <ClientAuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        hasPermission,
        updateClient,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
}
