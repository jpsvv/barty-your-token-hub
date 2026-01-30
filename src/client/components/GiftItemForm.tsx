import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gift, User, Package } from "lucide-react";
import { ClientProduct } from "@/types/client";

interface GiftItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onGift: (data: {
    productId: string;
    quantity: number;
    recipientPhone?: string;
    message?: string;
  }) => void;
  products: ClientProduct[];
  recipientName?: string;
  recipientPhone?: string;
}

const GiftItemForm = ({
  isOpen,
  onClose,
  onGift,
  products,
  recipientName,
  recipientPhone: initialPhone,
}: GiftItemFormProps) => {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [recipientPhone, setRecipientPhone] = useState(initialPhone || "");
  const [message, setMessage] = useState("");

  const selectedProduct = products.find((p) => p.id === productId);

  const handleSubmit = () => {
    if (!productId) return;

    onGift({
      productId,
      quantity,
      recipientPhone: recipientPhone || undefined,
      message: message || undefined,
    });

    // Reset form
    setProductId("");
    setQuantity(1);
    setRecipientPhone(initialPhone || "");
    setMessage("");
    onClose();
  };

  const handleClose = () => {
    setProductId("");
    setQuantity(1);
    setRecipientPhone(initialPhone || "");
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Presentear Item
          </DialogTitle>
          <DialogDescription>
            {recipientName
              ? `Enviar um presente para ${recipientName}`
              : "Envie um item como cortesia para um cliente"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Recipient (if not pre-selected) */}
          {!recipientName && (
            <div className="space-y-2">
              <Label htmlFor="recipientPhone">Telefone do Destinatário</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="recipientPhone"
                  placeholder="(11) 99999-9999"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          )}

          {/* Product Selection */}
          <div className="space-y-2">
            <Label>Produto</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {products
                  .filter((p) => p.isActive)
                  .map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>{product.name}</span>
                        <span className="text-muted-foreground">
                          R$ {product.price.toFixed(2)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem (opcional)</Label>
            <Textarea
              id="message"
              placeholder="Uma cortesia especial para você!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
            />
          </div>

          {/* Summary */}
          {selectedProduct && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4" />
                <span className="font-medium">Resumo do Presente:</span>
              </div>
              <div className="mt-2 text-sm">
                <p>
                  {quantity}x {selectedProduct.name}
                </p>
                <p className="text-muted-foreground">
                  Valor: R$ {(selectedProduct.price * quantity).toFixed(2)} (cortesia)
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!productId}>
            <Gift className="h-4 w-4 mr-2" />
            Enviar Presente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GiftItemForm;
