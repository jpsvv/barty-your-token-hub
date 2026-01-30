import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ClientCategory } from '@/types/client';

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: ClientCategory | null;
  existingCategories: ClientCategory[];
  onSave: (category: Partial<ClientCategory>) => void;
}

export function CategoryForm({
  open,
  onOpenChange,
  category,
  existingCategories,
  onSave,
}: CategoryFormProps) {
  const [name, setName] = useState('');
  const [order, setOrder] = useState(1);
  const [errors, setErrors] = useState<{ name?: string; order?: string }>({});

  useEffect(() => {
    if (category) {
      setName(category.name);
      setOrder(category.order);
    } else {
      setName('');
      // Set next order number
      const maxOrder = Math.max(0, ...existingCategories.map((c) => c.order));
      setOrder(maxOrder + 1);
    }
    setErrors({});
  }, [category, existingCategories, open]);

  const validate = (): boolean => {
    const newErrors: { name?: string; order?: string } = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'Nome é obrigatório';
    } else if (trimmedName.length > 50) {
      newErrors.name = 'Nome deve ter no máximo 50 caracteres';
    } else {
      // Check for duplicate names
      const duplicate = existingCategories.find(
        (c) => c.name.toLowerCase() === trimmedName.toLowerCase() && c.id !== category?.id
      );
      if (duplicate) {
        newErrors.name = 'Já existe uma categoria com este nome';
      }
    }

    if (order < 1) {
      newErrors.order = 'Ordem deve ser maior que 0';
    } else if (order > 100) {
      newErrors.order = 'Ordem deve ser no máximo 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      id: category?.id,
      name: name.trim(),
      order,
      isActive: category?.isActive ?? true,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          <DialogDescription>
            {category
              ? 'Altere os dados da categoria'
              : 'Adicione uma nova categoria ao cardápio'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Categoria *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Bebidas, Porções, Pratos..."
              maxLength={50}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Ordem no Cardápio</Label>
            <Input
              id="order"
              type="number"
              min={1}
              max={100}
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
            />
            {errors.order && (
              <p className="text-sm text-destructive">{errors.order}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Define a posição da categoria no cardápio (1 = primeira)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
