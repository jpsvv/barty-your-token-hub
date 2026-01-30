import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CashierTransaction } from "@/types/client";

interface TransactionDetailsProps {
  transaction: CashierTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionDetails = ({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailsProps) => {
  if (!transaction) return null;

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Cartão de Crédito";
      case "debit_card":
        return "Cartão de Débito";
      case "pix":
        return "PIX";
      case "cash":
        return "Dinheiro";
      case "wallet":
        return "Carteira Barty";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Pedido #{transaction.orderNumber}</span>
            {getStatusBadge(transaction.paymentStatus)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Cliente</span>
              <p className="font-medium">{transaction.userName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Data/Hora</span>
              <p className="font-medium">
                {new Date(transaction.createdAt).toLocaleString("pt-BR")}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Forma de Pagamento</span>
              <p className="font-medium">
                {getPaymentLabel(transaction.paymentMethod)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">ID do Cliente</span>
              <p className="font-mono text-xs">{transaction.userId}</p>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h4 className="font-semibold mb-2">Itens do Pedido</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-center">Qtd</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaction.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      R$ {item.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span>R$ {transaction.total.toFixed(2)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetails;
