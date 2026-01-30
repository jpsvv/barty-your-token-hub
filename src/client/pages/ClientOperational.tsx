import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClientLayout } from "../layouts/ClientLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "lucide-react";
import { ProductionItem, PrintSector, PendingProduct, PendingTicket } from "@/types/client";
import ProductionSectorCard from "../components/ProductionSectorCard";
import PrintSectorForm from "../components/PrintSectorForm";
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
];

const ClientOperational = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("production");
  const [sectors, setSectors] = useState<PrintSector[]>(mockSectors);
  const [productionItems, setProductionItems] = useState<ProductionItem[]>(mockProductionItems);
  const [pendingProducts] = useState<PendingProduct[]>(mockPendingProducts);
  const [pendingTickets] = useState<PendingTicket[]>(mockPendingTickets);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isSectorFormOpen, setIsSectorFormOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<PrintSector | undefined>();
  const [soundEnabled, setSoundEnabled] = useState(true);

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
    toast.success("Ficha enviada para produção!");
    playNewOrderSound();
  };

  const handleMarkPickup = (ticketId: string) => {
    toast.success("Retirada confirmada!");
  };

  const filteredTickets = selectedProduct
    ? pendingTickets.filter((t) => t.productId === selectedProduct)
    : [];

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
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pending Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fichas Não Utilizadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingProducts.map((product) => (
                        <TableRow key={product.productId}>
                          <TableCell className="font-medium">
                            {product.productName}
                            {product.requiresPreparation && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Preparo
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">
                              {product.pendingCount}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setSelectedProduct(
                                  selectedProduct === product.productId
                                    ? null
                                    : product.productId
                                )
                              }
                            >
                              {selectedProduct === product.productId
                                ? "Fechar"
                                : "Ver"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Client Tickets */}
              {selectedProduct && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Clientes com Fichas:{" "}
                      {
                        pendingProducts.find((p) => p.productId === selectedProduct)
                          ?.productName
                      }
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredTickets.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        Nenhuma ficha pendente encontrada
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Compra</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTickets.map((ticket) => (
                            <TableRow key={ticket.ticketId}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{ticket.userName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {ticket.userPhone}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                {new Date(ticket.purchasedAt).toLocaleTimeString(
                                  "pt-BR",
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {pendingProducts.find(
                                    (p) => p.productId === ticket.productId
                                  )?.requiresPreparation ? (
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleSendToProduction(ticket.ticketId)
                                      }
                                    >
                                      Produção
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleMarkPickup(ticket.ticketId)
                                      }
                                    >
                                      Retirar
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Cashier Tab */}
          <TabsContent value="cashier" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Caixa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  A funcionalidade de caixa será implementada na Fase 5.
                </p>
              </CardContent>
            </Card>
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
      </div>
    </ClientLayout>
  );
};

export default ClientOperational;
