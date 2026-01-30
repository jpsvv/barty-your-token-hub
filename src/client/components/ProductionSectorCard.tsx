import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductionItem, PrintSector } from "@/types/client";
import ProductionItemCard from "./ProductionItemCard";
import { Clock, ChefHat, CheckCircle } from "lucide-react";

interface ProductionSectorCardProps {
  sector: PrintSector;
  items: ProductionItem[];
  onStartProduction: (id: string) => void;
  onMarkReady: (id: string) => void;
  onMarkDelivered: (id: string) => void;
}

const ProductionSectorCard = ({
  sector,
  items,
  onStartProduction,
  onMarkReady,
  onMarkDelivered,
}: ProductionSectorCardProps) => {
  const pendingItems = items.filter((i) => i.status === "pending");
  const inProductionItems = items.filter((i) => i.status === "in_production");
  const readyItems = items.filter((i) => i.status === "ready");

  const columns = [
    {
      title: "Aguardando",
      icon: Clock,
      items: pendingItems,
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
    },
    {
      title: "Em Preparo",
      icon: ChefHat,
      items: inProductionItems,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Prontos",
      icon: CheckCircle,
      items: readyItems,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-bold uppercase tracking-wide">
            {sector.name}
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{pendingItems.length} aguardando</Badge>
            <Badge className="bg-yellow-500 text-yellow-950">
              {inProductionItems.length} em preparo
            </Badge>
            <Badge className="bg-green-500 text-green-950">
              {readyItems.length} prontos
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((column) => (
            <div key={column.title} className={`rounded-lg p-3 ${column.bgColor}`}>
              <div className={`flex items-center gap-2 mb-3 ${column.color}`}>
                <column.icon className="h-5 w-5" />
                <span className="font-semibold">{column.title}</span>
                <Badge variant="outline" className="ml-auto">
                  {column.items.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {column.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum item
                  </p>
                ) : (
                  column.items.map((item) => (
                    <ProductionItemCard
                      key={item.id}
                      item={item}
                      onStartProduction={onStartProduction}
                      onMarkReady={onMarkReady}
                      onMarkDelivered={onMarkDelivered}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionSectorCard;
