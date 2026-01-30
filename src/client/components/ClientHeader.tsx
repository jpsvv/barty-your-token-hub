import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClientAuth } from '@/client/contexts/ClientAuthContext';

interface ClientHeaderProps {
  title: string;
  subtitle?: string;
}

export function ClientHeader({ title, subtitle }: ClientHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { client } = useClientAuth();

  return (
    <header className="flex items-center justify-between border-b bg-card px-6 py-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Status do estabelecimento */}
        <Badge variant={client?.isOpen ? 'default' : 'secondary'} className="gap-1.5">
          <span
            className={`h-2 w-2 rounded-full ${
              client?.isOpen ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          {client?.isOpen ? 'Aberto' : 'Fechado'}
        </Badge>

        {/* Notificações */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
            3
          </span>
        </Button>

        {/* Tema */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </div>
    </header>
  );
}
