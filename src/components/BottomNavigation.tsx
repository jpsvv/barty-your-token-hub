import { Home, UtensilsCrossed, Ticket, User } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/menu', icon: UtensilsCrossed, label: 'Cardápio' },
  { to: '/tickets', icon: Ticket, label: 'Fichas' },
  { to: '/profile', icon: User, label: 'Perfil' },
];

export function BottomNavigation() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-col items-center justify-center w-full h-full text-muted-foreground transition-colors"
            activeClassName="text-primary"
          >
            <div className="relative">
              <Icon className="h-6 w-6" />
              {to === '/menu' && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
