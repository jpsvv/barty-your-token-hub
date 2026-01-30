import { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  ClientProduct,
  ClientCategory,
  PrintSector,
  ProductTag,
  ClientProductAddon,
  TicketValidityType,
} from '@/types/client';

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ClientProduct | null;
  categories: ClientCategory[];
  printSectors: PrintSector[];
  onSave: (product: Partial<ClientProduct>) => void;
}

const AVAILABLE_TAGS: { value: ProductTag; label: string }[] = [
  { value: 'vegan', label: 'Vegano' },
  { value: 'vegetarian', label: 'Vegetariano' },
  { value: 'gluten_free', label: 'Sem Glúten' },
  { value: 'fit', label: 'Fit' },
  { value: 'spicy', label: 'Picante' },
  { value: 'new', label: 'Novidade' },
  { value: 'bestseller', label: 'Mais Vendido' },
];

const VALIDITY_OPTIONS: { value: TicketValidityType; label: string }[] = [
  { value: '1_day', label: '1 dia' },
  { value: '1_week', label: '1 semana' },
  { value: '1_month', label: '1 mês' },
  { value: '1_year', label: '1 ano' },
  { value: 'custom', label: 'Personalizado' },
];

export function ProductForm({
  open,
  onOpenChange,
  product,
  categories,
  printSectors,
  onSave,
}: ProductFormProps) {
  // Basic
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<ProductTag[]>([]);

  // Price
  const [price, setPrice] = useState('');
  const [hasPromotion, setHasPromotion] = useState(false);
  const [promotionalPrice, setPromotionalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');

  // Production
  const [prepTime, setPrepTime] = useState('0');
  const [printSectorId, setPrintSectorId] = useState<string>('');
  const [order, setOrder] = useState('1');
  const [validityType, setValidityType] = useState<TicketValidityType>('1_day');
  const [customDays, setCustomDays] = useState('7');

  // Addons
  const [addons, setAddons] = useState<ClientProductAddon[]>([]);
  const [addonsRequired, setAddonsRequired] = useState(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategoryId(product.categoryId);
      setDescription(product.description);
      setTags(product.tags);
      setPrice(product.price.toString());
      setHasPromotion(!!product.promotionalPrice);
      setPromotionalPrice(product.promotionalPrice?.toString() || '');
      setDiscountPercent(product.discountPercent?.toString() || '');
      setPrepTime(product.prepTime.toString());
      setPrintSectorId(product.printSectorId || '');
      setOrder(product.order.toString());
      setValidityType(product.ticketValidity.type);
      setCustomDays(product.ticketValidity.customDays?.toString() || '7');
      setAddons(product.addons);
      setAddonsRequired(product.addonsRequired);
    } else {
      resetForm();
    }
    setErrors({});
  }, [product, open]);

  const resetForm = () => {
    setName('');
    setCategoryId(categories[0]?.id || '');
    setDescription('');
    setTags([]);
    setPrice('');
    setHasPromotion(false);
    setPromotionalPrice('');
    setDiscountPercent('');
    setPrepTime('0');
    setPrintSectorId('');
    setOrder('1');
    setValidityType('1_day');
    setCustomDays('7');
    setAddons([]);
    setAddonsRequired(false);
  };

  const handlePriceChange = (value: string) => {
    setPrice(value);
    if (hasPromotion && discountPercent) {
      const priceNum = parseFloat(value) || 0;
      const discount = parseFloat(discountPercent) || 0;
      setPromotionalPrice((priceNum * (1 - discount / 100)).toFixed(2));
    }
  };

  const handleDiscountChange = (value: string) => {
    setDiscountPercent(value);
    const priceNum = parseFloat(price) || 0;
    const discount = parseFloat(value) || 0;
    if (discount > 0 && discount <= 100) {
      setPromotionalPrice((priceNum * (1 - discount / 100)).toFixed(2));
    }
  };

  const handlePromotionalPriceChange = (value: string) => {
    setPromotionalPrice(value);
    const priceNum = parseFloat(price) || 0;
    const promoNum = parseFloat(value) || 0;
    if (priceNum > 0 && promoNum > 0) {
      setDiscountPercent((((priceNum - promoNum) / priceNum) * 100).toFixed(0));
    }
  };

  const toggleTag = (tag: ProductTag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addAddon = () => {
    setAddons((prev) => [
      ...prev,
      { id: `addon-${Date.now()}`, name: '', price: 0 },
    ]);
  };

  const updateAddon = (id: string, field: keyof ClientProductAddon, value: string | number) => {
    setAddons((prev) =>
      prev.map((addon) =>
        addon.id === id ? { ...addon, [field]: value } : addon
      )
    );
  };

  const removeAddon = (id: string) => {
    setAddons((prev) => prev.filter((addon) => addon.id !== id));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'Nome é obrigatório';
    } else if (trimmedName.length > 100) {
      newErrors.name = 'Nome deve ter no máximo 100 caracteres';
    }

    if (!categoryId) {
      newErrors.categoryId = 'Selecione uma categoria';
    }

    if (description.length > 500) {
      newErrors.description = 'Descrição deve ter no máximo 500 caracteres';
    }

    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Preço deve ser maior que 0';
    } else if (priceNum > 99999) {
      newErrors.price = 'Preço muito alto';
    }

    if (hasPromotion) {
      const promoNum = parseFloat(promotionalPrice);
      if (!promotionalPrice || isNaN(promoNum) || promoNum <= 0) {
        newErrors.promotionalPrice = 'Preço promocional inválido';
      } else if (promoNum >= priceNum) {
        newErrors.promotionalPrice = 'Preço promocional deve ser menor que o preço original';
      }
    }

    const prepTimeNum = parseInt(prepTime);
    if (isNaN(prepTimeNum) || prepTimeNum < 0) {
      newErrors.prepTime = 'Tempo de preparo inválido';
    } else if (prepTimeNum > 999) {
      newErrors.prepTime = 'Tempo de preparo muito alto';
    }

    // Validate addons
    addons.forEach((addon, index) => {
      if (!addon.name.trim()) {
        newErrors[`addon_${index}_name`] = 'Nome do adicional é obrigatório';
      }
      if (addon.price < 0) {
        newErrors[`addon_${index}_price`] = 'Preço inválido';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const productData: Partial<ClientProduct> = {
      id: product?.id,
      name: name.trim(),
      categoryId,
      description: description.trim(),
      price: parseFloat(price),
      promotionalPrice: hasPromotion ? parseFloat(promotionalPrice) : undefined,
      discountPercent: hasPromotion ? parseInt(discountPercent) : undefined,
      prepTime: parseInt(prepTime),
      printSectorId: printSectorId || undefined,
      order: parseInt(order),
      ticketValidity: {
        type: validityType,
        customDays: validityType === 'custom' ? parseInt(customDays) : undefined,
      },
      tags,
      addons: addons.filter((a) => a.name.trim()),
      addonsRequired,
      isActive: product?.isActive ?? true,
    };

    onSave(productData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          <DialogDescription>
            {product ? 'Altere os dados do produto' : 'Adicione um novo produto ao cardápio'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="price">Preço</TabsTrigger>
            <TabsTrigger value="production">Produção</TabsTrigger>
            <TabsTrigger value="addons">Adicionais</TabsTrigger>
          </TabsList>

          {/* Básico */}
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Chope Pilsen 500ml"
                maxLength={100}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((c) => c.isActive)
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">{errors.categoryId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o produto..."
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/500 caracteres
              </p>
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Imagem</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                  {product?.image ? (
                    <img
                      src={product.image}
                      alt="Produto"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => (
                  <Badge
                    key={tag.value}
                    variant={tags.includes(tag.value) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag.value)}
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Preço */}
          <TabsContent value="price" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço *</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">R$</span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="0,00"
                  className="w-32"
                />
              </div>
              {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasPromotion"
                checked={hasPromotion}
                onCheckedChange={setHasPromotion}
              />
              <Label htmlFor="hasPromotion">Aplicar promoção</Label>
            </div>

            {hasPromotion && (
              <div className="rounded-lg border bg-muted/50 p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountPercent">Desconto %</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="discountPercent"
                        type="number"
                        min="1"
                        max="99"
                        value={discountPercent}
                        onChange={(e) => handleDiscountChange(e.target.value)}
                        placeholder="0"
                        className="w-20"
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="promotionalPrice">Preço Promocional</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">R$</span>
                      <Input
                        id="promotionalPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={promotionalPrice}
                        onChange={(e) => handlePromotionalPriceChange(e.target.value)}
                        placeholder="0,00"
                        className="w-28"
                      />
                    </div>
                  </div>
                </div>
                {errors.promotionalPrice && (
                  <p className="text-sm text-destructive">{errors.promotionalPrice}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  O preço promocional será exibido no cardápio
                </p>
              </div>
            )}
          </TabsContent>

          {/* Produção */}
          <TabsContent value="production" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prepTime">Tempo médio de preparo (minutos)</Label>
              <Input
                id="prepTime"
                type="number"
                min="0"
                max="999"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-24"
              />
              <p className="text-xs text-muted-foreground">
                0 = disponível para retirada imediata
              </p>
              {errors.prepTime && <p className="text-sm text-destructive">{errors.prepTime}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="printSector">Setor de Impressão</Label>
              <Select value={printSectorId} onValueChange={setPrintSectorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Nenhum (não imprime)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {printSectors
                    .filter((s) => s.isActive)
                    .map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Selecione onde o pedido será impresso
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Ordem no Menu</Label>
              <Input
                id="order"
                type="number"
                min="1"
                max="999"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validity">Validade da Ficha</Label>
              <Select
                value={validityType}
                onValueChange={(v) => setValidityType(v as TicketValidityType)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VALIDITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {validityType === 'custom' && (
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">dias</span>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Adicionais */}
          <TabsContent value="addons" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="addonsRequired"
                checked={addonsRequired}
                onCheckedChange={(checked) => setAddonsRequired(checked as boolean)}
              />
              <Label htmlFor="addonsRequired">
                Adicionais obrigatórios (cliente deve escolher ao menos um)
              </Label>
            </div>

            <div className="space-y-3">
              {addons.map((addon, index) => (
                <div
                  key={addon.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="flex-1 space-y-1">
                    <Input
                      value={addon.name}
                      onChange={(e) => updateAddon(addon.id, 'name', e.target.value)}
                      placeholder="Nome do adicional"
                      maxLength={50}
                    />
                    {errors[`addon_${index}_name`] && (
                      <p className="text-xs text-destructive">
                        {errors[`addon_${index}_name`]}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={addon.price}
                      onChange={(e) =>
                        updateAddon(addon.id, 'price', parseFloat(e.target.value) || 0)
                      }
                      className="w-24"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAddon(addon.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addAddon}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Item
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Produto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
