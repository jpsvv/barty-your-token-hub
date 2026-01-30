import { useState } from "react";
import { ClientLayout } from "../layouts/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  DollarSign,
  Ticket,
  TrendingUp,
  Gift,
} from "lucide-react";
import { ClientCustomer, ClientProduct } from "@/types/client";
import CustomerCard from "../components/CustomerCard";
import CustomerDetails from "../components/CustomerDetails";
import GiftItemForm from "../components/GiftItemForm";
import { toast } from "sonner";

// Mock data
const mockCustomers: ClientCustomer[] = [
  {
    id: "c1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-1234",
    cpf: "123.456.789-00",
    totalSpent: 1250.0,
    totalOrders: 15,
    lastOrderAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    availableTickets: [
      {
        ticketId: "tk1",
        productName: "Chope Pilsen 500ml",
        status: "available",
        purchasedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // Expires today
      },
      {
        ticketId: "tk2",
        productName: "Batata Frita Grande",
        status: "in_production",
        purchasedAt: new Date(Date.now() - 30 * 60 * 1000),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ],
    orderHistory: [
      {
        orderId: "o1",
        orderNumber: "1234",
        total: 85.0,
        itemsCount: 3,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        orderId: "o2",
        orderNumber: "1198",
        total: 120.0,
        itemsCount: 5,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "c2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(11) 99999-5678",
    cpf: "987.654.321-00",
    totalSpent: 890.0,
    totalOrders: 12,
    lastOrderAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    availableTickets: [
      {
        ticketId: "tk3",
        productName: "Caipirinha",
        status: "ready",
        purchasedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ],
    orderHistory: [
      {
        orderId: "o3",
        orderNumber: "1233",
        total: 95.0,
        itemsCount: 4,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "c3",
    name: "Pedro Lima",
    email: "pedro.lima@email.com",
    phone: "(11) 99999-9012",
    cpf: "456.789.123-00",
    totalSpent: 650.0,
    totalOrders: 8,
    lastOrderAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    availableTickets: [],
    orderHistory: [
      {
        orderId: "o4",
        orderNumber: "1220",
        total: 75.0,
        itemsCount: 2,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "c4",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(11) 99999-3456",
    cpf: "321.654.987-00",
    totalSpent: 2100.0,
    totalOrders: 28,
    lastOrderAt: new Date(),
    availableTickets: [
      {
        ticketId: "tk4",
        productName: "Porção de Carne",
        status: "available",
        purchasedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        ticketId: "tk5",
        productName: "Chope Pilsen 500ml",
        status: "available",
        purchasedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        ticketId: "tk6",
        productName: "Batata Frita Grande",
        status: "available",
        purchasedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ],
    orderHistory: [
      {
        orderId: "o5",
        orderNumber: "1240",
        total: 180.0,
        itemsCount: 6,
        createdAt: new Date(),
      },
    ],
  },
  {
    id: "c5",
    name: "Carlos Souza",
    email: "carlos.souza@email.com",
    phone: "(11) 99999-7890",
    cpf: "654.987.321-00",
    totalSpent: 450.0,
    totalOrders: 5,
    lastOrderAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    availableTickets: [],
    orderHistory: [
      {
        orderId: "o6",
        orderNumber: "1150",
        total: 65.0,
        itemsCount: 2,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ],
  },
];

const mockProducts: ClientProduct[] = [
  {
    id: "p1",
    clientId: "1",
    categoryId: "cat1",
    name: "Chope Pilsen 500ml",
    description: "Chope artesanal gelado",
    price: 15.0,
    prepTime: 0,
    order: 1,
    ticketValidity: { type: "1_week" },
    tags: [],
    addons: [],
    addonsRequired: false,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "p2",
    clientId: "1",
    categoryId: "cat1",
    name: "Batata Frita Grande",
    description: "Porção de batata frita crocante",
    price: 25.0,
    prepTime: 15,
    order: 2,
    ticketValidity: { type: "1_day" },
    tags: [],
    addons: [],
    addonsRequired: false,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "p3",
    clientId: "1",
    categoryId: "cat1",
    name: "Caipirinha",
    description: "Caipirinha tradicional",
    price: 18.0,
    prepTime: 5,
    order: 3,
    ticketValidity: { type: "1_day" },
    tags: [],
    addons: [],
    addonsRequired: false,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "p4",
    clientId: "1",
    categoryId: "cat2",
    name: "Porção de Carne",
    description: "Carne na brasa com farofa",
    price: 45.0,
    prepTime: 20,
    order: 4,
    ticketValidity: { type: "1_day" },
    tags: [],
    addons: [],
    addonsRequired: false,
    isActive: true,
    createdAt: new Date(),
  },
];

const ClientCustomers = () => {
  const [customers] = useState<ClientCustomer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "spent" | "orders" | "recent">("recent");
  const [selectedCustomer, setSelectedCustomer] = useState<ClientCustomer | null>(null);
  const [isGiftFormOpen, setIsGiftFormOpen] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState<{
    id: string;
    name: string;
    phone: string;
  } | null>(null);

  // Stats
  const totalCustomers = customers.length;
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalActiveTickets = customers.reduce(
    (sum, c) => sum + c.availableTickets.length,
    0
  );
  const avgTicket = totalSpent / customers.reduce((sum, c) => sum + c.totalOrders, 0) || 0;

  // Filter and sort
  const filteredCustomers = customers
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "spent":
          return b.totalSpent - a.totalSpent;
        case "orders":
          return b.totalOrders - a.totalOrders;
        case "recent":
          return (
            (b.lastOrderAt?.getTime() || 0) - (a.lastOrderAt?.getTime() || 0)
          );
        default:
          return 0;
      }
    });

  const handleViewDetails = (customer: ClientCustomer) => {
    setSelectedCustomer(customer);
  };

  const handleGiftItem = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (customer) {
      setGiftRecipient({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
      });
      setIsGiftFormOpen(true);
      setSelectedCustomer(null);
    }
  };

  const handleMakeOrder = (customerId: string) => {
    toast.info("Funcionalidade de fazer pedido será implementada em breve");
  };

  const handleSendGift = (data: {
    productId: string;
    quantity: number;
    recipientPhone?: string;
    message?: string;
  }) => {
    const product = mockProducts.find((p) => p.id === data.productId);
    toast.success(
      `Presente enviado! ${data.quantity}x ${product?.name} para ${giftRecipient?.name || data.recipientPhone}`
    );
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie seus clientes e acompanhe o relacionamento
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setGiftRecipient(null);
              setIsGiftFormOpen(true);
            }}
          >
            <Gift className="h-4 w-4 mr-2" />
            Enviar Cortesia
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Clientes</p>
                  <p className="text-xl font-bold">{totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Gasto</p>
                  <p className="text-xl font-bold">
                    R$ {totalSpent.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Ticket className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fichas Ativas</p>
                  <p className="text-xl font-bold">{totalActiveTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ticket Médio</p>
                  <p className="text-xl font-bold">R$ {avgTicket.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, telefone ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais Recentes</SelectItem>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="spent">Maior Gasto</SelectItem>
                  <SelectItem value="orders">Mais Pedidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customer List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-12">
                <p className="text-muted-foreground text-center">
                  Nenhum cliente encontrado
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </div>

        {/* Customer Details Modal */}
        <CustomerDetails
          customer={selectedCustomer}
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onGiftItem={handleGiftItem}
          onMakeOrder={handleMakeOrder}
        />

        {/* Gift Item Form Modal */}
        <GiftItemForm
          isOpen={isGiftFormOpen}
          onClose={() => {
            setIsGiftFormOpen(false);
            setGiftRecipient(null);
          }}
          onGift={handleSendGift}
          products={mockProducts}
          recipientName={giftRecipient?.name}
          recipientPhone={giftRecipient?.phone}
        />
      </div>
    </ClientLayout>
  );
};

export default ClientCustomers;
