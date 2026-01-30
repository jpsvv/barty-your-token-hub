import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClientLayout } from "../layouts/ClientLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Wallet,
} from "lucide-react";
import SalesReportTab from "../components/SalesReportTab";
import FinancialReportTab from "../components/FinancialReportTab";
import { toast } from "sonner";

const ClientReports = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sales");

  // Sync active tab from URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/financial")) setActiveTab("financial");
    else setActiveTab("sales");
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "sales") navigate("/client/reports/sales");
    else navigate("/client/reports/financial");
  };

  const handleExport = () => {
    toast.success("Relatório exportado com sucesso! Verifique seus downloads.");
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Analise as vendas e acompanhe o financeiro do seu estabelecimento
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Este Mês</p>
                  <p className="text-xl font-bold">R$ 125.450</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mês Anterior</p>
                  <p className="text-xl font-bold">R$ 118.320</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <DollarSign className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Crescimento</p>
                  <p className="text-xl font-bold text-green-500">+6.02%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Wallet className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">A Receber</p>
                  <p className="text-xl font-bold">R$ 8.112</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Vendas
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financeiros & Repasses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <SalesReportTab onExport={handleExport} />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialReportTab onExport={handleExport} />
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

export default ClientReports;
