import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, CreditCard, Wallet, History, LogOut, ChevronRight,
  Plus, Trash2, Copy, Check, ArrowLeft, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/contexts/TicketsContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, logout, addToWallet, addCard, removeCard } = useAuth();
  const { transactions } = useTickets();

  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState<'pix' | 'card'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="container py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Perfil</h1>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Entre na sua conta</h2>
          <p className="text-muted-foreground mb-6">
            Faça login para acessar seu perfil e carteira
          </p>
          <Button onClick={() => navigate('/')} className="gradient-primary">
            Entrar
          </Button>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      toast({ title: 'Valor inválido', description: 'Digite um valor válido.', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    addToWallet(amount);
    setIsProcessing(false);
    setShowDepositDialog(false);
    setDepositAmount('');
    toast({ title: 'Depósito realizado!', description: `R$ ${amount.toFixed(2)} adicionados à sua carteira.` });
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText('barty@pix.com.br');
    setCopiedPix(true);
    toast({ title: 'Chave copiada!' });
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleAddCard = async () => {
    if (!newCard.number || !newCard.expiry || !newCard.cvv || !newCard.name) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const [month, year] = newCard.expiry.split('/');
    addCard({
      last4: newCard.number.slice(-4),
      brand: 'Visa',
      expiryMonth: parseInt(month),
      expiryYear: parseInt(`20${year}`),
    });

    setIsProcessing(false);
    setShowAddCardDialog(false);
    setNewCard({ number: '', expiry: '', cvv: '', name: '' });
    toast({ title: 'Cartão adicionado!' });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({ title: 'Até logo!', description: 'Você saiu da sua conta.' });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Perfil</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container py-4 space-y-6">
        {/* User Info */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </Card>

        {/* Account Data */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold">Dados da conta</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">CPF</p>
              <p className="font-medium">{user.cpf}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Telefone</p>
              <p className="font-medium">{user.phone}</p>
            </div>
          </div>
        </Card>

        {/* Wallet */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carteira Barty</p>
                <p className="text-xl font-bold">R$ {user.walletBalance.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>
            <Button onClick={() => setShowDepositDialog(true)} className="gradient-primary">
              Depositar
            </Button>
          </div>
        </Card>

        {/* Saved Cards */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Cartões salvos</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowAddCardDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
          
          {user.savedCards.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum cartão cadastrado</p>
          ) : (
            <div className="space-y-2">
              {user.savedCards.map(card => (
                <div key={card.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{card.brand} •••• {card.last4}</p>
                      <p className="text-xs text-muted-foreground">
                        Expira {card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive"
                    onClick={() => removeCard(card.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Transactions History */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Histórico de transações</h3>
          </div>
          
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma transação ainda</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {transactions.slice(0, 10).map(tx => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.createdAt.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className={cn(
                    "font-semibold",
                    tx.amount > 0 ? "text-success" : "text-foreground"
                  )}>
                    {tx.amount > 0 ? '+' : ''}R$ {Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Logout */}
        <Button 
          variant="outline" 
          className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair da conta
        </Button>
      </main>

      {/* Deposit Dialog */}
      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Depositar na Carteira</DialogTitle>
            <DialogDescription>
              Adicione saldo à sua Carteira Barty
            </DialogDescription>
          </DialogHeader>

          <Tabs value={depositMethod} onValueChange={(v) => setDepositMethod(v as 'pix' | 'card')}>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="pix">PIX</TabsTrigger>
              <TabsTrigger value="card">Cartão</TabsTrigger>
            </TabsList>

            <TabsContent value="pix" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Valor do depósito</Label>
                <Input
                  type="text"
                  placeholder="R$ 0,00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>

              <div className="p-4 rounded-lg bg-muted space-y-2">
                <p className="text-sm font-medium">Chave PIX</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-background px-3 py-2 rounded">
                    barty@pix.com.br
                  </code>
                  <Button size="icon" variant="outline" onClick={handleCopyPix}>
                    {copiedPix ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full gradient-primary" 
                onClick={handleDeposit}
                disabled={isProcessing || !depositAmount}
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar depósito'}
              </Button>
            </TabsContent>

            <TabsContent value="card" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Valor do depósito</Label>
                <Input
                  type="text"
                  placeholder="R$ 0,00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>

              {user.savedCards.length > 0 ? (
                <div className="p-3 rounded-lg border border-primary bg-primary/5">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">
                        {user.savedCards[0].brand} •••• {user.savedCards[0].last4}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Adicione um cartão para usar esta opção
                </p>
              )}

              <Button 
                className="w-full gradient-primary" 
                onClick={handleDeposit}
                disabled={isProcessing || !depositAmount || user.savedCards.length === 0}
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar depósito'}
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add Card Dialog */}
      <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar cartão</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Número do cartão</Label>
              <Input
                placeholder="0000 0000 0000 0000"
                value={newCard.number}
                onChange={(e) => setNewCard(prev => ({ ...prev, number: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Validade</Label>
                <Input
                  placeholder="MM/AA"
                  value={newCard.expiry}
                  onChange={(e) => setNewCard(prev => ({ ...prev, expiry: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>CVV</Label>
                <Input
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  value={newCard.cvv}
                  onChange={(e) => setNewCard(prev => ({ ...prev, cvv: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nome no cartão</Label>
              <Input
                placeholder="NOME SOBRENOME"
                value={newCard.name}
                onChange={(e) => setNewCard(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
              />
            </div>

            <Button 
              className="w-full gradient-primary" 
              onClick={handleAddCard}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Adicionar cartão'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
}
