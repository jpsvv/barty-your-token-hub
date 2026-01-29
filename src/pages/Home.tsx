import { useState, useMemo } from 'react';
import { Search, MapPin, ChevronDown, Wallet, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BottomNavigation } from '@/components/BottomNavigation';
import { EstablishmentCard } from '@/components/EstablishmentCard';
import { useAuth } from '@/contexts/AuthContext';
import { cities, establishments } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

type SortOption = 'distance' | 'rating';

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('distance');

  const favoriteEstablishments = useMemo(() => {
    if (!isAuthenticated || !user) return [];
    return establishments.filter(e => user.favoriteEstablishments.includes(e.id));
  }, [isAuthenticated, user]);

  const filteredEstablishments = useMemo(() => {
    let filtered = establishments.filter(e => e.cityId === selectedCity.id);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = establishments.filter(e => 
        e.name.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'distance') {
        return (a.distance || 0) - (b.distance || 0);
      }
      return b.rating - a.rating;
    });
  }, [selectedCity.id, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gradient">Barty</h1>
              {isAuthenticated && user && (
                <p className="text-sm text-muted-foreground">Olá, {user.name.split(' ')[0]}</p>
              )}
            </div>
            <ThemeToggle />
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0">
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedCity.name}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {cities.map(city => (
                  <DropdownMenuItem 
                    key={city.id}
                    onClick={() => setSelectedCity(city)}
                  >
                    {city.name}, {city.state}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar estabelecimentos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container py-4 space-y-6">
        {/* Favorites Carousel */}
        {isAuthenticated && favoriteEstablishments.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Favoritos</h2>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-3">
                {favoriteEstablishments.map(establishment => (
                  <button
                    key={establishment.id}
                    onClick={() => navigate(`/establishment/${establishment.id}`)}
                    className="shrink-0 flex flex-col items-center gap-2 group"
                  >
                    <div className="h-16 w-16 rounded-full overflow-hidden ring-2 ring-primary/50 group-hover:ring-primary transition-all">
                      <img 
                        src={establishment.logo} 
                        alt={establishment.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground max-w-16 truncate">
                      {establishment.name}
                    </span>
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>
        )}

        {/* Wallet Card */}
        {isAuthenticated && (
          <Card 
            className="p-4 gradient-primary cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => navigate('/profile')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/80">Carteira Barty</p>
                  <p className="text-xl font-bold text-white">
                    R$ {user?.walletBalance.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                Depositar
              </Button>
            </div>
          </Card>
        )}

        {/* Establishments List */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">
              {searchQuery ? 'Resultados' : 'Estabelecimentos'}
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <ArrowDownUp className="h-4 w-4 mr-1" />
                  {sortBy === 'distance' ? 'Distância' : 'Avaliação'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('distance')}>
                  Por distância
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('rating')}>
                  Por avaliação
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {filteredEstablishments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhum estabelecimento encontrado</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredEstablishments.map(establishment => (
                <EstablishmentCard 
                  key={establishment.id} 
                  establishment={establishment} 
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
