import { useState } from 'react';
import {
  Building2,
  Clock,
  Star,
  Users,
  Upload,
  Save,
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { ClientHeader } from '@/client/components/ClientHeader';
import { ClientLayout } from '@/client/layouts/ClientLayout';
import { ReviewCard } from '@/client/components/ReviewCard';
import { TeamMemberForm } from '@/client/components/TeamMemberForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
import { useClientAuth } from '@/client/contexts/ClientAuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  mockOperatingHours,
  mockReviews,
  mockEmployees,
} from '@/data/mockClientData';
import type { ClientEmployee, OperatingHours } from '@/types/client';

const DAYS_OF_WEEK = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export default function ClientSettings() {
  const { client, updateClient } = useClientAuth();
  const { toast } = useToast();

  // Establishment data
  const [name, setName] = useState(client?.name || '');
  const [tradingName, setTradingName] = useState(client?.tradingName || '');
  const [cnpj, setCnpj] = useState(client?.cnpj || '');
  const [phone, setPhone] = useState(client?.phone || '');
  const [website, setWebsite] = useState(client?.website || '');
  const [address, setAddress] = useState(client?.address || '');
  const [description, setDescription] = useState(client?.description || '');

  // Operating hours
  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>(mockOperatingHours);

  // Reviews
  const [reviews, setReviews] = useState(mockReviews);

  // Team
  const [employees, setEmployees] = useState<ClientEmployee[]>(mockEmployees);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingMember, setEditingMember] = useState<ClientEmployee | null>(null);

  const handleSaveEstablishment = () => {
    updateClient({
      name,
      tradingName,
      cnpj,
      phone,
      website,
      address,
      description,
    });
    toast({
      title: 'Configurações salvas',
      description: 'Os dados do estabelecimento foram atualizados.',
    });
  };

  const handleToggleDay = (dayOfWeek: number) => {
    setOperatingHours((prev) =>
      prev.map((oh) =>
        oh.dayOfWeek === dayOfWeek ? { ...oh, isActive: !oh.isActive } : oh
      )
    );
  };

  const handleUpdateHours = (dayOfWeek: number, field: 'openTime' | 'closeTime', value: string) => {
    setOperatingHours((prev) =>
      prev.map((oh) =>
        oh.dayOfWeek === dayOfWeek ? { ...oh, [field]: value } : oh
      )
    );
  };

  const handleSaveHours = () => {
    toast({
      title: 'Horários salvos',
      description: 'Os horários de funcionamento foram atualizados.',
    });
  };

  const handleReplyReview = (reviewId: string, reply: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, reply, repliedAt: new Date() } : r
      )
    );
    toast({
      title: 'Resposta enviada',
      description: 'Sua resposta foi publicada.',
    });
  };

  const handleSaveMember = (memberData: Partial<ClientEmployee>) => {
    if (memberData.id) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === memberData.id ? { ...e, ...memberData } : e))
      );
      toast({ title: 'Membro atualizado' });
    } else {
      const newMember: ClientEmployee = {
        id: `emp-${Date.now()}`,
        clientId: client?.id || '',
        name: memberData.name || '',
        email: memberData.email || '',
        phone: memberData.phone || '',
        role: memberData.role || 'custom',
        permissions: memberData.permissions || [],
        isActive: true,
        createdAt: new Date(),
      };
      setEmployees((prev) => [...prev, newMember]);
      toast({ title: 'Membro adicionado' });
    }
    setEditingMember(null);
  };

  const handleDeleteMember = (memberId: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== memberId));
    toast({ title: 'Membro removido' });
  };

  const handleToggleMemberStatus = (memberId: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === memberId ? { ...e, isActive: !e.isActive } : e))
    );
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      manager: 'Gerente',
      cashier: 'Caixa',
      kitchen: 'Cozinha',
      custom: 'Personalizado',
    };
    return labels[role] || role;
  };

  return (
    <ClientLayout>
      <ClientHeader title="Configurações" subtitle="Gerencie seu estabelecimento" />

      <div className="p-6">
        <Tabs defaultValue="establishment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none">
            <TabsTrigger value="establishment" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Estabelecimento</span>
            </TabsTrigger>
            <TabsTrigger value="hours" className="gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Funcionamento</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Avaliações</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Equipe</span>
            </TabsTrigger>
          </TabsList>

          {/* Estabelecimento */}
          <TabsContent value="establishment">
            <Card>
              <CardHeader>
                <CardTitle>Dados do Estabelecimento</CardTitle>
                <CardDescription>
                  Informações que aparecerão no cardápio do app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo e Capa */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                        {client?.logo ? (
                          <img
                            src={client.logo}
                            alt="Logo"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Alterar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Imagem de Fundo</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-32 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                        {client?.coverImage ? (
                          <img
                            src={client.coverImage}
                            alt="Capa"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Alterar
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Razão Social</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tradingName">Nome Fantasia</Label>
                    <Input
                      id="tradingName"
                      value={tradingName}
                      onChange={(e) => setTradingName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contato</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Link (Site ou Instagram)</Label>
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://instagram.com/seubar"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Localização</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Breve descrição do seu estabelecimento..."
                  />
                </div>

                <Button onClick={handleSaveEstablishment}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Funcionamento */}
          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle>Horários de Funcionamento</CardTitle>
                <CardDescription>
                  Configure os dias e horários em que seu estabelecimento estará aberto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operatingHours.map((oh) => (
                    <div
                      key={oh.id}
                      className="flex items-center gap-4 rounded-lg border p-4"
                    >
                      <Switch
                        checked={oh.isActive}
                        onCheckedChange={() => handleToggleDay(oh.dayOfWeek)}
                      />
                      <div className="w-32">
                        <span className={oh.isActive ? 'font-medium' : 'text-muted-foreground'}>
                          {DAYS_OF_WEEK[oh.dayOfWeek]}
                        </span>
                      </div>
                      {oh.isActive && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={oh.openTime}
                            onChange={(e) =>
                              handleUpdateHours(oh.dayOfWeek, 'openTime', e.target.value)
                            }
                            className="w-28"
                          />
                          <span className="text-muted-foreground">até</span>
                          <Input
                            type="time"
                            value={oh.closeTime}
                            onChange={(e) =>
                              handleUpdateHours(oh.dayOfWeek, 'closeTime', e.target.value)
                            }
                            className="w-28"
                          />
                        </div>
                      )}
                      {!oh.isActive && (
                        <span className="text-sm text-muted-foreground">Fechado</span>
                      )}
                    </div>
                  ))}
                </div>

                <Button className="mt-6" onClick={handleSaveHours}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Horários
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Avaliações */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Avaliações dos Clientes</CardTitle>
                <CardDescription>
                  Veja e responda às avaliações recebidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Nenhuma avaliação recebida ainda.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        onReply={handleReplyReview}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipe */}
          <TabsContent value="team">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Equipe</CardTitle>
                  <CardDescription>
                    Gerencie os membros e permissões de acesso
                  </CardDescription>
                </div>
                <Button onClick={() => setShowTeamForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Membro
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                            {getRoleLabel(member.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.isActive ? 'outline' : 'secondary'}>
                            {member.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
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
                                  setEditingMember(member);
                                  setShowTeamForm(true);
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleMemberStatus(member.id)}
                              >
                                {member.isActive ? 'Desativar' : 'Ativar'}
                              </DropdownMenuItem>
                              {member.role !== 'admin' && (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteMember(member.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remover
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <TeamMemberForm
        open={showTeamForm}
        onOpenChange={(open) => {
          setShowTeamForm(open);
          if (!open) setEditingMember(null);
        }}
        member={editingMember}
        onSave={handleSaveMember}
      />
    </ClientLayout>
  );
}
