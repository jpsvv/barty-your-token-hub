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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  CalendarIcon,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Download,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockSalesData = {
  totalRevenue: 125450.0,
  totalOrders: 1847,
  averageTicket: 67.9,
  salesByDay: [
    { date: "01/02", revenue: 4250, orders: 62 },
    { date: "02/02", revenue: 3800, orders: 55 },
    { date: "03/02", revenue: 5100, orders: 74 },
    { date: "04/02", revenue: 4600, orders: 68 },
    { date: "05/02", revenue: 6200, orders: 89 },
    { date: "06/02", revenue: 7500, orders: 108 },
    { date: "07/02", revenue: 8100, orders: 115 },
  ],
  salesByHour: [
    { hour: "18h", amount: 2500 },
    { hour: "19h", amount: 5800 },
    { hour: "20h", amount: 8200 },
    { hour: "21h", amount: 9500 },
    { hour: "22h", amount: 7800 },
    { hour: "23h", amount: 5200 },
    { hour: "00h", amount: 3500 },
    { hour: "01h", amount: 2100 },
  ],
  salesByPayment: [
    { method: "Cartão Crédito", amount: 52000, count: 680, color: "#8B5CF6" },
    { method: "PIX", amount: 38000, count: 520, color: "#10B981" },
    { method: "Cartão Débito", amount: 22000, count: 380, color: "#3B82F6" },
    { method: "Dinheiro", amount: 8450, count: 187, color: "#F59E0B" },
    { method: "Carteira Barty", amount: 5000, count: 80, color: "#EC4899" },
  ],
  productRanking: [
    { rank: 1, name: "Chope Pilsen 500ml", quantity: 450, revenue: 6750 },
    { rank: 2, name: "Batata Frita Grande", quantity: 380, revenue: 9500 },
    { rank: 3, name: "Caipirinha", quantity: 320, revenue: 5760 },
    { rank: 4, name: "Porção de Carne", quantity: 210, revenue: 9450 },
    { rank: 5, name: "Chope IPA 500ml", quantity: 180, revenue: 3600 },
    { rank: 6, name: "Hambúrguer Artesanal", quantity: 150, revenue: 5250 },
    { rank: 7, name: "Picanha na Brasa", quantity: 120, revenue: 7200 },
    { rank: 8, name: "Porção de Frango", quantity: 95, revenue: 2850 },
  ],
  categoryBreakdown: [
    { category: "Bebidas", revenue: 42000, percentage: 33.5 },
    { category: "Porções", revenue: 35000, percentage: 27.9 },
    { category: "Pratos", revenue: 28450, percentage: 22.7 },
    { category: "Sobremesas", revenue: 12000, percentage: 9.6 },
    { category: "Combos", revenue: 8000, percentage: 6.4 },
  ],
};

interface SalesReportTabProps {
  onExport: () => void;
}

const SalesReportTab = ({ onExport }: SalesReportTabProps) => {
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [category, setCategory] = useState<string>("all");

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtros:</span>
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

            {/* Category Filter */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                <SelectItem value="bebidas">Bebidas</SelectItem>
                <SelectItem value="porcoes">Porções</SelectItem>
                <SelectItem value="pratos">Pratos</SelectItem>
                <SelectItem value="sobremesas">Sobremesas</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={onExport} className="ml-auto">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Faturamento</p>
                <p className="text-2xl font-bold">
                  R$ {mockSalesData.totalRevenue.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nº de Vendas</p>
                <p className="text-2xl font-bold">
                  {mockSalesData.totalOrders.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold">
                  R$ {mockSalesData.averageTicket.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sales by Day */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vendas por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockSalesData.salesByDay}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [
                    `R$ ${value.toLocaleString("pt-BR")}`,
                    "Faturamento",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary) / 0.2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales by Hour */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vendas por Faixa de Horário</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockSalesData.salesByHour}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="hour" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [
                    `R$ ${value.toLocaleString("pt-BR")}`,
                    "Vendas",
                  ]}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods & Product Ranking */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Formas de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockSalesData.salesByPayment}
                  dataKey="amount"
                  nameKey="method"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {mockSalesData.salesByPayment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [
                    `R$ ${value.toLocaleString("pt-BR")}`,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Ranking */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ranking de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-center">Qtd</TableHead>
                  <TableHead className="text-right">Faturamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSalesData.productRanking.slice(0, 6).map((product) => (
                  <TableRow key={product.rank}>
                    <TableCell>
                      <Badge
                        variant={product.rank <= 3 ? "default" : "secondary"}
                        className="w-6 h-6 p-0 flex items-center justify-center"
                      >
                        {product.rank}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-center">{product.quantity}</TableCell>
                    <TableCell className="text-right">
                      R$ {product.revenue.toLocaleString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Faturamento por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSalesData.categoryBreakdown.map((cat) => (
              <div key={cat.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{cat.category}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      R$ {cat.revenue.toLocaleString("pt-BR")}
                    </span>
                    <Badge variant="outline">{cat.percentage}%</Badge>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesReportTab;
