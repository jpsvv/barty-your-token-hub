import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  UtensilsCrossed,
  Cog,
  Users,
  Calendar,
  BarChart3,
  ChevronDown,
  LogOut,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClientAuth } from '@/client/contexts/ClientAuthContext';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  children?: { title: string; href: string; permission?: string }[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/client/dashboard',
    icon: LayoutDashboard,
    permission: 'dashboard',
  },
  {
    title: 'Configurações',
    href: '/client/settings',
    icon: Settings,
    permission: 'settings',
  },
  {
    title: 'Cardápio',
    href: '/client/menu',
    icon: UtensilsCrossed,
    permission: 'menu',
    children: [
      { title: 'Categorias', href: '/client/menu/categories' },
      { title: 'Produtos', href: '/client/menu/products' },
    ],
  },
  {
    title: 'Operacional',
    href: '/client/operational',
    icon: Cog,
    permission: 'operational',
    children: [
      { title: 'Produção', href: '/client/operational/production', permission: 'production' },
      { title: 'Pendentes', href: '/client/operational/pending', permission: 'pending' },
      { title: 'Caixa', href: '/client/operational/cashier', permission: 'cashier' },
    ],
  },
  {
    title: 'Clientes',
    href: '/client/customers',
    icon: Users,
    permission: 'customers',
  },
  {
    title: 'Eventos',
    href: '/client/events',
    icon: Calendar,
    permission: 'events',
    children: [
      { title: 'Convites', href: '/client/events/invites' },
      { title: 'Produzir', href: '/client/events/create' },
      { title: 'Meus Eventos', href: '/client/events/my-events' },
    ],
  },
  {
    title: 'Relatórios',
    href: '/client/reports',
    icon: BarChart3,
    permission: 'reports',
    children: [
      { title: 'Vendas', href: '/client/reports/sales' },
      { title: 'Financeiro', href: '/client/reports/financial', permission: 'financial' },
    ],
  },
];

export function ClientSidebar() {
  const location = useLocation();
  const { client, employee, logout, hasPermission } = useClientAuth();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (item: NavItem) =>
    item.children?.some((child) => location.pathname === child.href) ||
    location.pathname === item.href;

  const filteredItems = navItems.filter(
    (item) => !item.permission || hasPermission(item.permission as any)
  );

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Store className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-semibold">{client?.tradingName || 'Barty Cliente'}</p>
          <p className="truncate text-xs text-muted-foreground">{employee?.name}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openMenus.includes(item.href) || isParentActive(item);

            if (hasChildren) {
              return (
                <li key={item.href}>
                  <Collapsible open={isOpen} onOpenChange={() => toggleMenu(item.href)}>
                    <CollapsibleTrigger asChild>
                      <button
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                          isParentActive(item)
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="flex-1 text-left">{item.title}</span>
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform',
                            isOpen && 'rotate-180'
                          )}
                        />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1 space-y-1 pl-8">
                      {item.children
                        ?.filter(
                          (child) =>
                            !child.permission || hasPermission(child.permission as any)
                        )
                        .map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={cn(
                              'block rounded-lg px-3 py-2 text-sm transition-colors',
                              isActive(child.href)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                          >
                            {child.title}
                          </Link>
                        ))}
                    </CollapsibleContent>
                  </Collapsible>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </Button>
      </div>
    </aside>
  );
}
