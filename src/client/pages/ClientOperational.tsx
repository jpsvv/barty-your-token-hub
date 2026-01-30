import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClientLayout } from "../layouts/ClientLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChefHat,
  Clock,
  DollarSign,
  Plus,
  Settings,
  Volume2,
  VolumeX,
  Trash2,
  Edit,
  TrendingUp,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react";
import { ProductionItem, PrintSector, PendingProduct, PendingTicket, CashierTransaction } from "@/types/client";
import ProductionSectorCard from "../components/ProductionSectorCard";
import PrintSectorForm from "../components/PrintSectorForm";
import PendingTicketCard from "../components/PendingTicketCard";
import TransactionList from "../components/TransactionList";
import TransactionDetails from "../components/TransactionDetails";
import PendingPayments from "../components/PendingPayments";
import useProductionSound from "../hooks/useProductionSound";
import { toast } from "sonner";

// Mock data for production
const mockSectors: PrintSector[] = [
  { id: "1", clientId: "1", name: "Cozinha", isActive: true },
  { id: "2", clientId: "1", name: "Bar", isActive: true },
  { id: "3", clientId: "1", name: "Churrasqueira", isActive: true },
];

const mockProductionItems: ProductionItem[] = [
  {
    id: "1",
    ticketId: "t1",
    orderNumber: "1234",
    customerName: "João Silva",
    productId: "p1",
    productName: "Batata Frita Grande",
    addons: [{ name: "Bacon", quantity: 1 }, { name: "Cheddar", quantity: 1 }],
    observation: "Sem sal",
    printSectorId: "1",
    status: "pending",
    sentToProductionAt: new Date(Date.now() - 5 * 60 * 1000),
    prepTime: 15,
    isOverdue: false,
  },
  {
    id: "2",
    ticketId: "t2",
    orderNumber: "1235",
    customerName: "Maria Santos",
    productId: "p2",
    productName: "Porção de Carne",
    addons: [],
    printSectorId: "1",
    status: "in_production",
    sentToProductionAt: new Date(Date.now() - 12 * 60 * 1000),
    prepTime: 10,
    isOverdue: true,
  },
  {
    id: "3",
    ticketId: "t3",
    orderNumber: "1236",
    customerName: "Pedro Lima",
    productId: "p3",
    productName: "Fritas Pequena",
    addons: [],
    printSectorId: "1",
    status: "ready",
    sentToProductionAt: new Date(Date.now() - 8 * 60 * 1000),
    readyAt: new Date(),
    prepTime: 10,
    isOverdue: false,
  },
  {
    id: "4",
    ticketId: "t4",
    orderNumber: "1237",
    customerName: "Ana Costa",
    productId: "p4",
    productName: "Caipirinha",
    addons: [{ name: "Limão extra", quantity: 1 }],
    printSectorId: "2",
    status: "pending",
    sentToProductionAt: new Date(Date.now() - 2 * 60 * 1000),
    prepTime: 5,
    isOverdue: false,
  },
  {
    id: "5",
    ticketId: "t5",
    orderNumber: "1238",
    customerName: "Carlos Souza",
    productId: "p5",
    productName: "Chope Pilsen 500ml",
    addons: [],
    printSectorId: "2",
    status: "in_production",
    sentToProductionAt: new Date(Date.now() - 3 * 60 * 1000),
    prepTime: 3,
    isOverdue: false,
  },
];

const mockPendingProducts: PendingProduct[] = [
  { productId: "p1", productName: "Chope Pilsen 500ml", pendingCount: 12, requiresPreparation: false },
  { productId: "p2", productName: "Batata Frita Grande", pendingCount: 8, requiresPreparation: true },
  { productId: "p3", productName: "Caipirinha", pendingCount: 5, requiresPreparation: true },
  { productId: "p4", productName: "Porção de Carne", pendingCount: 3, requiresPreparation: true },
];

const mockPendingTickets: PendingTicket[] = [
  {
    ticketId: "t10",
    userId: "u1",
    userName: "João Silva",
    userPhone: "(11) 99999-1234",
    productId: "p1",
    productName: "Chope Pilsen 500ml",
    purchasedAt: new Date(Date.now() - 30 * 60 * 1000),
    status: "not_sent",
  },
  {
    ticketId: "t11",
    userId: "u2",
    userName: "Maria Santos",
    userPhone: "(11) 99999-5678",
    productId: "p1",
    productName: "Chope Pilsen 500ml",
    purchasedAt: new Date(Date.now() - 45 * 60 * 1000),
    status: "not_sent",
  },
  {
    ticketId: "t12",
    userId: "u3",
    userName: "Pedro Lima",
    userPhone: "(11) 99999-9012",
    productId: "p2",
    productName: "Batata Frita Grande",
    purchasedAt: new Date(Date.now() - 20 * 60 * 1000),
    status: "not_sent",
  },
  {
    ticketId: "t13",
    userId: "u4",
    userName: "Ana Costa",
    userPhone: "(11) 99999-3456",
    productId: "p2",
    productName: "Batata Frita Grande",
    purchasedAt: new Date(Date.now() - 15 * 60 * 1000),
    status: "in_production",
  },
  {
    ticketId: "t14",
    userId: "u5",
    userName: "Carlos Souza",
    userPhone: "(11) 99999-7890",
    productId: "p3",
    productName: "Caipirinha",
    purchasedAt: new Date(Date.now() - 10 * 60 * 1000),
    status: "ready",
  },
];

const mockTransactions: CashierTransaction[] = [
  {
    id: "tx1",
    orderNumber: "1234",
    userId: "u1",
    userName: "João Silva",
    items: [
      { productName: "Chope Pilsen 500ml", quantity: 2, price: 15 },
      { productName: "Batata Frita Grande", quantity: 1, price: 25 },
    ],
    total: 55,
    paymentMethod: "credit_card",
    paymentStatus: "approved",
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: "tx2",
    orderNumber: "1235",
    userId: "u2",
    userName: "Maria Santos",
    items: [
      { productName: "Caipirinha", quantity: 2, price: 18 },
      { productName: "Porção de Carne", quantity: 1, price: 45 },
    ],
    total: 81,
    paymentMethod: "pix",
    paymentStatus: "approved",
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: "tx3",
    orderNumber: "1236",
    userId: "u3",
    userName: "Pedro Lima",
    items: [
      { productName: "Chope Pilsen 500ml", quantity: 3, price: 15 },
    ],
    total: 45,
    paymentMethod: "cash",
    paymentStatus: "pending",
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "tx4",
    orderNumber: "1237",
    userId: "u4",
    userName: "Ana Costa",
    items: [
      { productName: "Batata Frita Grande", quantity: 2, price: 25 },
      { productName: "Caipirinha", quantity: 1, price: 18 },
    ],
    total: 68,
    paymentMethod: "debit_card",
    paymentStatus: "approved",
    createdAt: new Date(Date.now() - 3 * 60 * 1000),
  },
  {
    id: "tx5",
    orderNumber: "1238",
    userId: "u5",
    userName: "Carlos Souza",
    items: [
      { productName: "Porção de Carne", quantity: 1, price: 45 },
      { productName: "Chope Pilsen 500ml", quantity: 2, price: 15 },
    ],
    total: 75,
    paymentMethod: "cash",
    paymentStatus: "pending",
    createdAt: new Date(Date.now() - 1 * 60 * 1000),
  },
  {
    id: "tx6",
    orderNumber: "1239",
    userId: "u6",
    userName: "Fernanda Oliveira",
    items: [
      { productName: "Caipirinha", quantity: 3, price: 18 },
    ],
    total: 54,
    paymentMethod: "wallet",
    paymentStatus: "approved",
    createdAt: new Date(),
  },
];

const ClientOperational = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("production");
  const [sectors, setSectors] = useState<PrintSector[]>(mockSectors);
  const [productionItems, setProductionItems] = useState<ProductionItem[]>(mockProductionItems);
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>(mockPendingProducts);
  const [pendingTickets, setPendingTickets] = useState<PendingTicket[]>(mockPendingTickets);
  const [transactions, setTransactions] = useState<CashierTransaction[]>(mockTransactions);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isSectorFormOpen, setIsSectorFormOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<PrintSector | undefined>();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<CashierTransaction | null>(null);

  const { playNewOrderSound, playReadySound, toggleSound } = useProductionSound();

  // Determine active tab from URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/pending")) setActiveTab("pending");
    else if (path.includes("/cashier")) setActiveTab("cashier");
    else setActiveTab("production");
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "production") navigate("/client/operational");
    else navigate(`/client/operational/${tab}`);
  };

  const handleToggleSound = () => {
    const enabled = toggleSound();
    setSoundEnabled(enabled);
    toast.success(enabled ? "Som ativado" : "Som desativado");
  };

  const handleStartProduction = (id: string) => {
    setProductionItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "in_production" as const } : item
      )
    );
    toast.success("Preparo iniciado!");
  };

  const handleMarkReady = (id: string) => {
    setProductionItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "ready" as const, readyAt: new Date() }
          : item
      )
    );
    playReadySound();
    toast.success("Item marcado como pronto!");
  };

  const handleMarkDelivered = (id: string) => {
    setProductionItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item entregue!");
  };

  const handleSaveSector = (sectorData: Partial<PrintSector>) => {
    if (sectorData.id) {
      setSectors((prev) =>
        prev.map((s) => (s.id === sectorData.id ? { ...s, ...sectorData } : s))
      );
      toast.success("Setor atualizado!");
    } else {
      const newSector: PrintSector = {
        id: Date.now().toString(),
        clientId: "1",
        name: sectorData.name || "",
        isActive: sectorData.isActive ?? true,
      };
      setSectors((prev) => [...prev, newSector]);
      toast.success("Setor criado!");
    }
    setEditingSector(undefined);
  };

  const handleDeleteSector = (id: string) => {
    setSectors((prev) => prev.filter((s) => s.id !== id));
    toast.success("Setor removido!");
  };

  const handleSendToProduction = (ticketId: string) => {
    setPendingTickets((prev) =>
      prev.map((t) =>
        t.ticketId === ticketId ? { ...t, status: "in_production" as const } : t
      )
    );
    toast.success("Ficha enviada para produção!");
    playNewOrderSound();
  };

  const handleMarkPickup = (ticketId: string) => {
    setPendingTickets((prev) => prev.filter((t) => t.ticketId !== ticketId));
    toast.success("Retirada confirmada!");
  };

  const handleApproveTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, paymentStatus: "approved" as const } : t
      )
    );
    toast.success("Pagamento aprovado!");
  };

  const handleCancelTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, paymentStatus: "cancelled" as const } : t
      )
    );
    toast.success("Pedido cancelado!");
  };

  const filteredTickets = selectedProduct
    ? pendingTickets.filter((t) => t.productId === selectedProduct)
    : [];

  // Calculate cashier stats
  const todayTransactions = transactions.filter((t) => t.paymentStatus === "approved");
  const todayTotal = todayTransactions.reduce((sum, t) => sum + t.total, 0);
  const pendingCashPayments = transactions.filter(
    (t) => t.paymentMethod === "cash" && t.paymentStatus === "pending"
  );

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Operacional</h1>
            <p className="text-muted-foreground">
              Gerencie a produção, fichas pendentes e caixa
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleSound}
              title={soundEnabled ? "Desativar som" : "Ativar som"}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="production" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Produção
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pendentes
              <Badge variant="secondary" className="ml-1">
                {pendingProducts.reduce((sum, p) => sum + p.pendingCount, 0)}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="cashier" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Caixa
              {pendingCashPayments.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {pendingCashPayments.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Production Tab */}
          <TabsContent value="production" className="space-y-6">
            {/* Sector Management */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Setores de Produção
                  </CardTitle>
                  <Button size="sm" onClick={() => setIsSectorFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Setor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {sectors.map((sector) => (
                    <div
                      key={sector.id}
                      className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2"
                    >
                      <span className="font-medium">{sector.name}</span>
                      {!sector.isActive && (
                        <Badge variant="outline" className="text-xs">
                          Inativo
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          setEditingSector(sector);
                          setIsSectorFormOpen(true);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteSector(sector.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Production Sectors */}
            {sectors
              .filter((s) => s.isActive)
              .map((sector) => (
                <ProductionSectorCard
                  key={sector.id}
                  sector={sector}
                  items={productionItems.filter(
                    (item) => item.printSectorId === sector.id
                  )}
                  onStartProduction={handleStartProduction}
                  onMarkReady={handleMarkReady}
                  onMarkDelivered={handleMarkDelivered}
                />
              ))}
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="space-y-6">
            {/* Pending Products Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pendingProducts.map((product) => (
                <Card
                  key={product.productId}
                  className={`cursor-pointer transition-all ${
                    selectedProduct === product.productId
                      ? "ring-2 ring-primary"
                      : "hover:shadow-md"
                  }`}
                  onClick={() =>
                    setSelectedProduct(
                      selectedProduct === product.productId
                        ? null
                        : product.productId
                    )
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{product.productName}</p>
                        {product.requiresPreparation && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Preparo
                          </Badge>
                        )}
                      </div>
                      <Badge className="text-lg px-3 py-1">
                        {product.pendingCount}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Product Tickets */}
            {selectedProduct && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>
                      Clientes com Fichas:{" "}
                      {
                        pendingProducts.find((p) => p.productId === selectedProduct)
                          ?.productName
                      }
                    </span>
                    <Badge variant="secondary">
                      {filteredTickets.length} fichas
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredTickets.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhuma ficha pendente encontrada para este produto
                    </p>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredTickets.map((ticket) => (
                        <PendingTicketCard
                          key={ticket.ticketId}
                          ticket={ticket}
                          requiresPreparation={
                            pendingProducts.find(
                              (p) => p.productId === ticket.productId
                            )?.requiresPreparation ?? false
                          }
                          onSendToProduction={handleSendToProduction}
                          onMarkPickup={handleMarkPickup}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {!selectedProduct && (
              <Card>
                <CardContent className="py-12">
                  <p className="text-muted-foreground text-center">
                    Clique em um produto acima para ver os clientes com fichas pendentes
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Cashier Tab */}
          <TabsContent value="cashier" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Faturamento</p>
                      <p className="text-xl font-bold">
                        R$ {todayTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cartões</p>
                      <p className="text-xl font-bold">
                        {
                          transactions.filter(
                            (t) =>
                              (t.paymentMethod === "credit_card" ||
                                t.paymentMethod === "debit_card") &&
                              t.paymentStatus === "approved"
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Smartphone className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">PIX</p>
                      <p className="text-xl font-bold">
                        {
                          transactions.filter(
                            (t) =>
                              t.paymentMethod === "pix" &&
                              t.paymentStatus === "approved"
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <Banknote className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pendentes</p>
                      <p className="text-xl font-bold text-yellow-500">
                        {pendingCashPayments.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Cash Payments */}
            <PendingPayments
              transactions={transactions}
              onApprove={handleApproveTransaction}
              onCancel={handleCancelTransaction}
            />

            {/* All Transactions */}
            <TransactionList
              transactions={transactions}
              onApprove={handleApproveTransaction}
              onCancel={handleCancelTransaction}
              onViewDetails={setSelectedTransaction}
            />
          </TabsContent>
        </Tabs>

        {/* Sector Form Modal */}
        <PrintSectorForm
          sector={editingSector}
          isOpen={isSectorFormOpen}
          onClose={() => {
            setIsSectorFormOpen(false);
            setEditingSector(undefined);
          }}
          onSave={handleSaveSector}
        />

        {/* Transaction Details Modal */}
        <TransactionDetails
          transaction={selectedTransaction}
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      </div>
    </ClientLayout>
  );
};

export default ClientOperational;
