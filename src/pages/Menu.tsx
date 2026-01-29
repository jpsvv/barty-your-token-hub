import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/BottomNavigation';

export default function Menu() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container py-4">
          <h1 className="text-2xl font-bold">Cardápio</h1>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <UtensilsCrossed className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Nenhum estabelecimento selecionado</h2>
        <p className="text-muted-foreground mb-6">
          Escolha um estabelecimento na Home para ver o cardápio
        </p>
        <Button onClick={() => navigate('/home')} className="gradient-primary">
          Explorar estabelecimentos
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
}
