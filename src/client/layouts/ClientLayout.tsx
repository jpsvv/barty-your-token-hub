import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ClientSidebar } from '@/client/components/ClientSidebar';
import { useClientAuth } from '@/client/contexts/ClientAuthContext';

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { isAuthenticated, isLoading } = useClientAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/client" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <ClientSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
