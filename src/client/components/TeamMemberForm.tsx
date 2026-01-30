import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import type { ClientEmployee, ClientRole, ClientPermission } from '@/types/client';

interface TeamMemberFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: ClientEmployee | null;
  onSave: (member: Partial<ClientEmployee>) => void;
}

const PERMISSIONS: { value: ClientPermission; label: string }[] = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'settings', label: 'Configurações' },
  { value: 'menu', label: 'Cardápio' },
  { value: 'operational', label: 'Operacional' },
  { value: 'production', label: 'Produção' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'cashier', label: 'Caixa' },
  { value: 'customers', label: 'Clientes' },
  { value: 'events', label: 'Eventos' },
  { value: 'reports', label: 'Relatórios' },
  { value: 'financial', label: 'Financeiro' },
];

const ROLE_PRESETS: Record<ClientRole, ClientPermission[]> = {
  admin: PERMISSIONS.map((p) => p.value),
  manager: ['dashboard', 'menu', 'operational', 'production', 'pending', 'cashier', 'customers', 'reports'],
  cashier: ['dashboard', 'cashier', 'pending'],
  kitchen: ['production'],
  custom: [],
};

export function TeamMemberForm({ open, onOpenChange, member, onSave }: TeamMemberFormProps) {
  const [name, setName] = useState(member?.name || '');
  const [email, setEmail] = useState(member?.email || '');
  const [phone, setPhone] = useState(member?.phone || '');
  const [role, setRole] = useState<ClientRole>(member?.role || 'custom');
  const [permissions, setPermissions] = useState<ClientPermission[]>(
    member?.permissions || []
  );
  const [password, setPassword] = useState('');

  const handleRoleChange = (newRole: ClientRole) => {
    setRole(newRole);
    if (newRole !== 'custom') {
      setPermissions(ROLE_PRESETS[newRole]);
    }
  };

  const togglePermission = (permission: ClientPermission) => {
    setRole('custom');
    setPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSave = () => {
    onSave({
      id: member?.id,
      name,
      email,
      phone,
      role,
      permissions,
      isActive: true,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{member ? 'Editar Membro' : 'Novo Membro'}</DialogTitle>
          <DialogDescription>
            {member
              ? 'Altere os dados do membro da equipe'
              : 'Adicione um novo membro à equipe'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do funcionário"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          {!member && (
            <div className="space-y-2">
              <Label htmlFor="password">Senha inicial</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Perfil de acesso</Label>
            <Select value={role} onValueChange={(v) => handleRoleChange(v as ClientRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador (Acesso total)</SelectItem>
                <SelectItem value="manager">Gerente</SelectItem>
                <SelectItem value="cashier">Caixa</SelectItem>
                <SelectItem value="kitchen">Cozinha</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Permissões</Label>
            <div className="grid grid-cols-2 gap-2 rounded-lg border p-3">
              {PERMISSIONS.map((perm) => (
                <div key={perm.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={perm.value}
                    checked={permissions.includes(perm.value)}
                    onCheckedChange={() => togglePermission(perm.value)}
                    disabled={role === 'admin'}
                  />
                  <label
                    htmlFor={perm.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {perm.label}
                  </label>
                </div>
              ))}
            </div>
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
