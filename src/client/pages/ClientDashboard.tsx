import { useState } from 'react';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Clock,
  ChefHat,
  CheckCircle,
  Package,
  QrCode,
  Power,
  PowerOff,
} from 'lucide-react';
import { ClientHeader } from '@/client/components/ClientHeader';
import { ClientLayout } from '@/client/layouts/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useClientAuth } from '@/client/contexts/ClientAuthContext';
import { mockDashboardData } from '@/data/mockClientData';

function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; positive: boolean };
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <p
            className={`mt-1 text-xs ${
              trend.positive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trend.positive ? '+' : ''}
            {trend.value}% em relação a ontem
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ProductionStatusCard({
  title,
  count,
  icon: Icon,
  color,
}: {
  title: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-4 ${color}`}
    >
      <Icon className="h-8 w-8" />
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const { client, updateClient } = useClientAuth();
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [closeTime, setCloseTime] = useState('15');

  const data = mockDashboardData;

  const handleToggleOpen = () => {
    if (client?.isOpen) {
      setShowCloseDialog(true);
    } else {
      updateClient({ isOpen: true, temporaryClosedUntil: undefined });
    }
  };

  const handleConfirmClose = () => {
    const minutes = parseInt(closeTime);
    const closedUntil = new Date(Date.now() + minutes * 60000);
    updateClient({ isOpen: false, temporaryClosedUntil: closedUntil });
    setShowCloseDialog(false);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <ClientLayout>
      <ClientHeader
        title="Dashboard"
        subtitle={`Período: ${data.periodStart.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${data.periodEnd.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} (Hoje)`}
      />

      <div className="p-6">
        {/* Ações Rápidas */}
        <div className="mb-6 flex gap-3">
          <Button
            variant={client?.isOpen ? 'destructive' : 'default'}
            onClick={handleToggleOpen}
          >
            {client?.isOpen ? (
              <>
                <PowerOff className="mr-2 h-4 w-4" />
                Fechar Estabelecimento
              </>
            ) : (
              <>
                <Power className="mr-2 h-4 w-4" />
                Abrir Estabelecimento
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => setShowQRDialog(true)}>
            <QrCode className="mr-2 h-4 w-4" />
            Gerar QR Code
          </Button>
        </div>

        {/* Métricas Principais */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Faturamento"
            value={formatCurrency(data.totalRevenue)}
            icon={DollarSign}
            trend={{ value: 12, positive: true }}
          />
          <DashboardCard
            title="Nº de Pedidos"
            value={data.totalOrders.toString()}
            icon={ShoppingCart}
            trend={{ value: 8, positive: true }}
          />
          <DashboardCard
            title="Ticket Médio"
            value={formatCurrency(data.averageTicket)}
            icon={TrendingUp}
          />
          <DashboardCard
            title="Formas de Pagamento"
            value={`${data.paymentBreakdown.length} tipos`}
            subtitle={`${data.paymentBreakdown[0]?.method}: ${formatCurrency(data.paymentBreakdown[0]?.amount || 0)}`}
            icon={DollarSign}
          />
        </div>

        {/* Status da Produção */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Status dos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <ProductionStatusCard
                title="Em Aberto"
                count={data.productionStats.pending}
                icon={Clock}
                color="border-yellow-500/50 bg-yellow-500/10"
              />
              <ProductionStatusCard
                title="Em Preparo"
                count={data.productionStats.inProduction}
                icon={ChefHat}
                color="border-blue-500/50 bg-blue-500/10"
              />
              <ProductionStatusCard
                title="Prontos"
                count={data.productionStats.ready}
                icon={CheckCircle}
                color="border-green-500/50 bg-green-500/10"
              />
              <ProductionStatusCard
                title="Entregues"
                count={data.productionStats.delivered}
                icon={Package}
                color="border-muted bg-muted/50"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Produtos Mais Vendidos */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <Badge variant="secondary">{product.quantity} un</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Clientes */}
          <Card>
            <CardHeader>
              <CardTitle>Top Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.topCustomers.map((customer, index) => (
                  <div
                    key={customer.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                    <span className="font-semibold text-primary">
                      {formatCurrency(customer.spent)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fichas Não Utilizadas */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Fichas Não Utilizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {data.unsoldTickets.map((ticket) => (
                <Badge
                  key={ticket.productName}
                  variant="outline"
                  className="px-3 py-1.5 text-sm"
                >
                  {ticket.productName}: {ticket.count} fichas
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog: Fechar Estabelecimento */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fechar Temporariamente</DialogTitle>
            <DialogDescription>
              Por quanto tempo deseja fechar o estabelecimento?
            </DialogDescription>
          </DialogHeader>
          <Select value={closeTime} onValueChange={setCloseTime}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tempo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutos</SelectItem>
              <SelectItem value="30">30 minutos</SelectItem>
              <SelectItem value="60">1 hora</SelectItem>
              <SelectItem value="120">2 horas</SelectItem>
              <SelectItem value="0">Até reabrir manualmente</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmClose}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: QR Code */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle>QR Code do Cardápio</DialogTitle>
            <DialogDescription>
              Escaneie para acessar o cardápio do {client?.tradingName}
            </DialogDescription>
          </DialogHeader>
          <div className="mx-auto my-4 flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed">
            <QrCode className="h-32 w-32 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            barty.app/{client?.id}
          </p>
          <DialogFooter className="sm:justify-center">
            <Button variant="outline" onClick={() => setShowQRDialog(false)}>
              Fechar
            </Button>
            <Button>Baixar QR Code</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
}
