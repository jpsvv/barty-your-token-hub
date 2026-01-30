import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  Download,
  Filter,
  Eye,
  CreditCard,
  Banknote,
  Building,
  Receipt,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialOrder, TransferBatch } from "@/types/client";

// Mock data
const mockOrders: FinancialOrder[] = [
  {
    orderId: "o1",
    orderNumber: "1234",
    total: 85.0,
    paymentMethod: "Cartão Crédito",
    discounts: 0,
    cardFee: 2.55,
    bartyFee: 0.85,
    eventFee: 0,
    netAmount: 81.6,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    orderId: "o2",
    orderNumber: "1235",
    total: 120.0,
    paymentMethod: "PIX",
    discounts: 5.0,
    cardFee: 0,
    bartyFee: 1.15,
    eventFee: 0,
    netAmount: 113.85,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    orderId: "o3",
    orderNumber: "1236",
    total: 45.0,
    paymentMethod: "Dinheiro",
    discounts: 0,
    cardFee: 0,
    bartyFee: 0,
    eventFee: 0,
    netAmount: 45.0,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    orderId: "o4",
    orderNumber: "1237",
    total: 180.0,
    paymentMethod: "Cartão Débito",
    discounts: 10.0,
    cardFee: 3.4,
    bartyFee: 1.7,
    eventFee: 4.5,
    netAmount: 160.4,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    orderId: "o5",
    orderNumber: "1238",
    total: 95.0,
    paymentMethod: "Carteira Barty",
    discounts: 0,
    cardFee: 0,
    bartyFee: 0.95,
    eventFee: 0,
    netAmount: 94.05,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
];

const mockTransfers: TransferBatch[] = [
  {
    id: "t1",
    batchNumber: "REP-001",
    periodStart: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    periodEnd: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    paymentDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    paymentMethod: "PIX",
    grossAmount: 12500.0,
    cardFees: 312.5,
    bartyFee: 125.0,
    eventFee: 0,
    netAmount: 12062.5,
    status: "completed",
    orders: ["o1", "o2", "o3"],
  },
  {
    id: "t2",
    batchNumber: "REP-002",
    periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    periodEnd: new Date(),
    paymentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    paymentMethod: "PIX",
    grossAmount: 8450.0,
    cardFees: 211.25,
    bartyFee: 84.5,
    eventFee: 42.25,
    netAmount: 8112.0,
    status: "pending",
    orders: ["o4", "o5"],
  },
  {
    id: "t3",
    batchNumber: "REP-003",
    periodStart: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    periodEnd: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    paymentDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    paymentMethod: "Transferência",
    grossAmount: 15800.0,
    cardFees: 395.0,
    bartyFee: 158.0,
    eventFee: 0,
    netAmount: 15247.0,
    status: "completed",
    orders: [],
  },
];

interface FinancialReportTabProps {
  onExport: () => void;
}

const FinancialReportTab = ({ onExport }: FinancialReportTabProps) => {
  const [activeSubTab, setActiveSubTab] = useState("orders");
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedTransfer, setSelectedTransfer] = useState<TransferBatch | null>(null);

  // Calculate totals
  const totalGross = mockOrders.reduce((sum, o) => sum + o.total, 0);
  const totalDiscounts = mockOrders.reduce((sum, o) => sum + o.discounts, 0);
  const totalCardFees = mockOrders.reduce((sum, o) => sum + o.cardFee, 0);
  const totalBartyFee = mockOrders.reduce((sum, o) => sum + o.bartyFee, 0);
  const totalEventFee = mockOrders.reduce((sum, o) => sum + o.eventFee, 0);
  const totalNet = mockOrders.reduce((sum, o) => sum + o.netAmount, 0);

  const pendingTransfers = mockTransfers.filter((t) => t.status === "pending");
  const completedTransfers = mockTransfers.filter((t) => t.status === "completed");
  const totalPending = pendingTransfers.reduce((sum, t) => sum + t.netAmount, 0);
  const totalPaid = completedTransfers.reduce((sum, t) => sum + t.netAmount, 0);

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("pt-BR");

  const formatDateTime = (date: Date) =>
    new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500 text-green-950">
            <CheckCircle className="h-3 w-3 mr-1" />
            Pago
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-yellow-500 text-yellow-950">Processando</Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Período:</span>
            </div>

            {/* Start Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(startDate, "dd/MM/yyyy", { locale: ptBR })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            <span className="text-muted-foreground">até</span>

            {/* End Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(endDate, "dd/MM/yyyy", { locale: ptBR })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" onClick={onExport} className="ml-auto">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bruto</p>
                <p className="text-xl font-bold">
                  R$ {totalGross.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/20 rounded-lg">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taxas</p>
                <p className="text-xl font-bold text-destructive">
                  - R$ {(totalCardFees + totalBartyFee + totalEventFee).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Banknote className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Líquido</p>
                <p className="text-xl font-bold">
                  R$ {totalNet.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">A Receber</p>
                <p className="text-xl font-bold text-yellow-600">
                  R$ {totalPending.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="transfers" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Repasses
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalhamento de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Forma Pgto</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Descontos</TableHead>
                    <TableHead className="text-right">Taxa Cartão</TableHead>
                    <TableHead className="text-right">Taxa Barty</TableHead>
                    <TableHead className="text-right">Taxa Evento</TableHead>
                    <TableHead className="text-right">Líquido</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell className="font-mono font-bold">
                        #{order.orderNumber}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDateTime(order.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {order.paymentMethod === "Dinheiro" ? (
                            <Banknote className="h-4 w-4" />
                          ) : (
                            <CreditCard className="h-4 w-4" />
                          )}
                          <span className="text-sm">{order.paymentMethod}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {order.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        {order.discounts > 0
                          ? `- R$ ${order.discounts.toFixed(2)}`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        {order.cardFee > 0
                          ? `- R$ ${order.cardFee.toFixed(2)}`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        {order.bartyFee > 0
                          ? `- R$ ${order.bartyFee.toFixed(2)}`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        {order.eventFee > 0
                          ? `- R$ ${order.eventFee.toFixed(2)}`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        R$ {order.netAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Totals */}
              <Separator className="my-4" />
              <div className="flex justify-end">
                <div className="w-96 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Bruto:</span>
                    <span>R$ {totalGross.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>Descontos:</span>
                    <span>- R$ {totalDiscounts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>Taxas Cartão:</span>
                    <span>- R$ {totalCardFees.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>Taxa Barty:</span>
                    <span>- R$ {totalBartyFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>Taxa Evento:</span>
                    <span>- R$ {totalEventFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total Líquido:</span>
                    <span>R$ {totalNet.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                * Pagamentos em Dinheiro não possuem taxas Barty ou de cartão
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transfers Tab */}
        <TabsContent value="transfers">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Histórico de Repasses</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Repasse</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Data Pagamento</TableHead>
                    <TableHead>Forma</TableHead>
                    <TableHead className="text-right">Bruto</TableHead>
                    <TableHead className="text-right">Taxas</TableHead>
                    <TableHead className="text-right">Líquido</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell className="font-mono font-bold">
                        {transfer.batchNumber}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(transfer.periodStart)} -{" "}
                        {formatDate(transfer.periodEnd)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(transfer.paymentDate)}
                      </TableCell>
                      <TableCell>{transfer.paymentMethod}</TableCell>
                      <TableCell className="text-right">
                        R$ {transfer.grossAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        - R${" "}
                        {(
                          transfer.cardFees +
                          transfer.bartyFee +
                          transfer.eventFee
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        R$ {transfer.netAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedTransfer(transfer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transfer Details Modal */}
      <Dialog
        open={!!selectedTransfer}
        onOpenChange={() => setSelectedTransfer(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>Repasse {selectedTransfer?.batchNumber}</span>
              {selectedTransfer && getStatusBadge(selectedTransfer.status)}
            </DialogTitle>
          </DialogHeader>

          {selectedTransfer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Período</p>
                  <p className="font-medium">
                    {formatDate(selectedTransfer.periodStart)} -{" "}
                    {formatDate(selectedTransfer.periodEnd)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data de Pagamento</p>
                  <p className="font-medium">
                    {formatDate(selectedTransfer.paymentDate)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Forma de Pagamento</p>
                  <p className="font-medium">{selectedTransfer.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pedidos Incluídos</p>
                  <p className="font-medium">
                    {selectedTransfer.orders.length || "187"} pedidos
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Valor Bruto:</span>
                  <span>R$ {selectedTransfer.grossAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-destructive">
                  <span>Taxa Cartão:</span>
                  <span>- R$ {selectedTransfer.cardFees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-destructive">
                  <span>Taxa Barty:</span>
                  <span>- R$ {selectedTransfer.bartyFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-destructive">
                  <span>Taxa Evento:</span>
                  <span>- R$ {selectedTransfer.eventFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Valor Líquido:</span>
                  <span>R$ {selectedTransfer.netAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialReportTab;
