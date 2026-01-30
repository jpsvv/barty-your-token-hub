import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Banknote } from "lucide-react";
import { CashierTransaction } from "@/types/client";

interface PendingPaymentsProps {
  transactions: CashierTransaction[];
  onApprove: (id: string) => void;
  onCancel: (id: string) => void;
}

const PendingPayments = ({
  transactions,
  onApprove,
  onCancel,
}: PendingPaymentsProps) => {
  const pendingCashPayments = transactions.filter(
    (t) => t.paymentMethod === "cash" && t.paymentStatus === "pending"
  );

  if (pendingCashPayments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Pagamentos Pendentes (Dinheiro)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Nenhum pagamento em dinheiro pendente
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-yellow-500/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Banknote className="h-5 w-5" />
          Pagamentos Pendentes (Dinheiro)
          <Badge variant="secondary" className="ml-2">
            {pendingCashPayments.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingCashPayments.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-mono font-bold">
                  #{transaction.orderNumber}
                </TableCell>
                <TableCell>{transaction.userName}</TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {transaction.items.length} item(s)
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  R$ {transaction.total.toFixed(2)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(transaction.createdAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => onApprove(transaction.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onCancel(transaction.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PendingPayments;
