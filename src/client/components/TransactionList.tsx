import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  Eye,
  XCircle,
  CheckCircle,
  Printer,
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
} from "lucide-react";
import { CashierTransaction } from "@/types/client";

interface TransactionListProps {
  transactions: CashierTransaction[];
  onApprove: (id: string) => void;
  onCancel: (id: string) => void;
  onViewDetails: (transaction: CashierTransaction) => void;
}

const TransactionList = ({
  transactions,
  onApprove,
  onCancel,
  onViewDetails,
}: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    type: "approve" | "cancel";
    transaction: CashierTransaction | null;
  }>({ type: "approve", transaction: null });

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "credit_card":
      case "debit_card":
        return <CreditCard className="h-4 w-4" />;
      case "pix":
        return <Smartphone className="h-4 w-4" />;
      case "cash":
        return <Banknote className="h-4 w-4" />;
      case "wallet":
        return <Wallet className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Crédito";
      case "debit_card":
        return "Débito";
      case "pix":
        return "PIX";
      case "cash":
        return "Dinheiro";
      case "wallet":
        return "Carteira";
      default:
        return method;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 text-green-950">Aprovado</Badge>;
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmAction = () => {
    if (!confirmDialog.transaction) return;

    if (confirmDialog.type === "approve") {
      onApprove(confirmDialog.transaction.id);
    } else {
      onCancel(confirmDialog.transaction.id);
    }
    setConfirmDialog({ type: "approve", transaction: null });
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Transações em Tempo Real</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por pedido ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">
                      Nenhuma transação encontrada
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentIcon(transaction.paymentMethod)}
                        <span className="text-sm">
                          {getPaymentLabel(transaction.paymentMethod)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.paymentStatus)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewDetails(transaction)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          {transaction.paymentStatus === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  setConfirmDialog({
                                    type: "approve",
                                    transaction,
                                  })
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Aprovar Pagamento
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  setConfirmDialog({
                                    type: "cancel",
                                    transaction,
                                  })
                                }
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancelar Pedido
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>
                            <Printer className="h-4 w-4 mr-2" />
                            Imprimir Fichas
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={!!confirmDialog.transaction}
        onOpenChange={() => setConfirmDialog({ type: "approve", transaction: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === "approve"
                ? "Aprovar Pagamento"
                : "Cancelar Pedido"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === "approve"
                ? `Confirma a aprovação do pagamento do pedido #${confirmDialog.transaction?.orderNumber}?`
                : `Tem certeza que deseja cancelar o pedido #${confirmDialog.transaction?.orderNumber}? Esta ação não pode ser desfeita.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ type: "approve", transaction: null })}
            >
              Voltar
            </Button>
            <Button
              variant={confirmDialog.type === "cancel" ? "destructive" : "default"}
              onClick={handleConfirmAction}
            >
              {confirmDialog.type === "approve" ? "Aprovar" : "Cancelar Pedido"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionList;
