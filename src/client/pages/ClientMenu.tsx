import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Search,
  Tag,
  Percent,
} from 'lucide-react';
import { ClientHeader } from '@/client/components/ClientHeader';
import { ClientLayout } from '@/client/layouts/ClientLayout';
import { CategoryForm } from '@/client/components/CategoryForm';
import { ProductForm } from '@/client/components/ProductForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { mockCategories, mockProducts, mockPrintSectors } from '@/data/mockClientData';
import type { ClientCategory, ClientProduct } from '@/types/client';

const TAG_LABELS: Record<string, string> = {
  vegan: 'Vegano',
  vegetarian: 'Vegetariano',
  gluten_free: 'Sem Glúten',
  fit: 'Fit',
  spicy: 'Picante',
  new: 'Novidade',
  bestseller: 'Mais Vendido',
};

export default function ClientMenu() {
  const { toast } = useToast();

  // Categories state
  const [categories, setCategories] = useState<ClientCategory[]>(mockCategories);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ClientCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ClientCategory | null>(null);

  // Products state
  const [products, setProducts] = useState<ClientProduct[]>(mockProducts);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ClientProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ClientProduct | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Print sectors
  const [printSectors] = useState(mockPrintSectors);

  // Category handlers
  const handleSaveCategory = (categoryData: Partial<ClientCategory>) => {
    if (categoryData.id) {
      setCategories((prev) =>
        prev.map((c) => (c.id === categoryData.id ? { ...c, ...categoryData } : c))
      );
      toast({ title: 'Categoria atualizada' });
    } else {
      const newCategory: ClientCategory = {
        id: `cat-${Date.now()}`,
        clientId: 'client-1',
        name: categoryData.name || '',
        order: categoryData.order || 1,
        isActive: true,
        productCount: 0,
      };
      setCategories((prev) => [...prev, newCategory].sort((a, b) => a.order - b.order));
      toast({ title: 'Categoria criada' });
    }
    setEditingCategory(null);
  };

  const handleToggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleDeleteCategory = () => {
    if (!deletingCategory) return;

    const hasProducts = products.some((p) => p.categoryId === deletingCategory.id);
    if (hasProducts) {
      toast({
        title: 'Não é possível excluir',
        description: 'Esta categoria possui produtos vinculados',
        variant: 'destructive',
      });
    } else {
      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      toast({ title: 'Categoria excluída' });
    }
    setDeletingCategory(null);
  };

  // Product handlers
  const handleSaveProduct = (productData: Partial<ClientProduct>) => {
    if (productData.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productData.id ? { ...p, ...productData } : p))
      );
      toast({ title: 'Produto atualizado' });
    } else {
      const newProduct: ClientProduct = {
        id: `prod-${Date.now()}`,
        clientId: 'client-1',
        categoryId: productData.categoryId || '',
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || 0,
        promotionalPrice: productData.promotionalPrice,
        discountPercent: productData.discountPercent,
        prepTime: productData.prepTime || 0,
        printSectorId: productData.printSectorId,
        order: productData.order || 1,
        ticketValidity: productData.ticketValidity || { type: '1_day' },
        tags: productData.tags || [],
        addons: productData.addons || [],
        addonsRequired: productData.addonsRequired || false,
        isActive: true,
        createdAt: new Date(),
      };
      setProducts((prev) => [...prev, newProduct]);
      toast({ title: 'Produto criado' });

      // Update category product count
      setCategories((prev) =>
        prev.map((c) =>
          c.id === newProduct.categoryId
            ? { ...c, productCount: (c.productCount || 0) + 1 }
            : c
        )
      );
    }
    setEditingProduct(null);
  };

  const handleToggleProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handleDeleteProduct = () => {
    if (!deletingProduct) return;

    setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));

    // Update category product count
    setCategories((prev) =>
      prev.map((c) =>
        c.id === deletingProduct.categoryId
          ? { ...c, productCount: Math.max(0, (c.productCount || 0) - 1) }
          : c
      )
    );

    toast({ title: 'Produto excluído' });
    setDeletingProduct(null);
  };

  // Filtered products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || product.categoryId === filterCategory;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && product.isActive) ||
      (filterStatus === 'inactive' && !product.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name || '-';

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <ClientLayout>
      <ClientHeader title="Cardápio" subtitle="Gerencie categorias e produtos" />

      <div className="p-6">
        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
          </TabsList>

          {/* Categorias */}
          <TabsContent value="categories">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Categorias</CardTitle>
                  <CardDescription>
                    Organize os produtos em categorias
                  </CardDescription>
                </div>
                <Button onClick={() => setShowCategoryForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Categoria
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Ordem</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="w-24">Produtos</TableHead>
                      <TableHead className="w-24">Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories
                      .sort((a, b) => a.order - b.order)
                      .map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">
                            {category.order}
                          </TableCell>
                          <TableCell className="font-medium">
                            {category.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {category.productCount || 0}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={category.isActive}
                              onCheckedChange={() => handleToggleCategory(category.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingCategory(category);
                                    setShowCategoryForm(true);
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => setDeletingCategory(category)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                {categories.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    Nenhuma categoria cadastrada.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Produtos */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Produtos</CardTitle>
                  <CardDescription>
                    {filteredProducts.length} produto(s) encontrado(s)
                  </CardDescription>
                </div>
                <Button onClick={() => setShowProductForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Produto
                </Button>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="mb-6 flex flex-wrap gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar produto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="inactive">Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Imagem</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="w-28">Preço</TableHead>
                      <TableHead className="w-24">Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="h-12 w-12 overflow-hidden rounded-lg bg-muted">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                Sem img
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.promotionalPrice && (
                                <Badge variant="destructive" className="gap-1 text-xs">
                                  <Percent className="h-3 w-3" />
                                  {product.discountPercent}%
                                </Badge>
                              )}
                              {product.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {TAG_LABELS[tag] || tag}
                                </Badge>
                              ))}
                              {product.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{product.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                        <TableCell>
                          {product.promotionalPrice ? (
                            <div>
                              <p className="text-xs text-muted-foreground line-through">
                                {formatCurrency(product.price)}
                              </p>
                              <p className="font-semibold text-green-600">
                                {formatCurrency(product.promotionalPrice)}
                              </p>
                            </div>
                          ) : (
                            <p className="font-medium">{formatCurrency(product.price)}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={product.isActive}
                            onCheckedChange={() => handleToggleProduct(product.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowProductForm(true);
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeletingProduct(product)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredProducts.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                      ? 'Nenhum produto encontrado com os filtros aplicados.'
                      : 'Nenhum produto cadastrado.'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Category Form */}
      <CategoryForm
        open={showCategoryForm}
        onOpenChange={(open) => {
          setShowCategoryForm(open);
          if (!open) setEditingCategory(null);
        }}
        category={editingCategory}
        existingCategories={categories}
        onSave={handleSaveCategory}
      />

      {/* Product Form */}
      <ProductForm
        open={showProductForm}
        onOpenChange={(open) => {
          setShowProductForm(open);
          if (!open) setEditingProduct(null);
        }}
        product={editingProduct}
        categories={categories}
        printSectors={printSectors}
        onSave={handleSaveProduct}
      />

      {/* Delete Category Confirmation */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={() => setDeletingCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "{deletingCategory?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Product Confirmation */}
      <AlertDialog
        open={!!deletingProduct}
        onOpenChange={() => setDeletingProduct(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{deletingProduct?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ClientLayout>
  );
}
