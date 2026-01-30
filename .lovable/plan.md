
# Plano: Corrigir Rotas Faltantes do Painel Cliente

## Problema Identificado

O sidebar (`ClientSidebar.tsx`) define links para sub-rotas que não existem no roteador (`App.tsx`), causando erro 404 quando o usuário clica nessas abas:

- `/client/operational/production` - Falta
- `/client/events/invites` - Falta  
- `/client/events/create` - Falta
- `/client/events/my-events` - Falta
- `/client/reports/sales` - Falta
- `/client/reports/financial` - Falta

## Solução

Registrar todas as sub-rotas faltantes no `App.tsx` e atualizar as páginas para interpretar a URL e ativar a aba correta automaticamente.

## Etapas de Implementação

### 1. Adicionar rotas faltantes no App.tsx

Registrar as sub-rotas apontando para os componentes existentes:

```text
/client/operational/production  → ClientOperational
/client/events/invites          → ClientEvents  
/client/events/create           → ClientEvents
/client/events/my-events        → ClientEvents
/client/reports/sales           → ClientReports
/client/reports/financial       → ClientReports
```

### 2. Atualizar ClientOperational.tsx

Usar `useLocation` do React Router para detectar a URL e definir a aba ativa inicial:

- `/client/operational` ou `/client/operational/production` → aba "production"
- `/client/operational/pending` → aba "pending"
- `/client/operational/cashier` → aba "cashier"

### 3. Atualizar ClientEvents.tsx

Sincronizar a URL com as abas internas:

- `/client/events` ou `/client/events/invites` → aba "invites"
- `/client/events/create` → aba "my-events" (com modal de criação aberto)
- `/client/events/my-events` → aba "my-events"

### 4. Atualizar ClientReports.tsx

Sincronizar a URL com as abas:

- `/client/reports` ou `/client/reports/sales` → aba "sales"
- `/client/reports/financial` → aba "financial"

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/App.tsx` | Adicionar 6 rotas faltantes |
| `src/client/pages/ClientOperational.tsx` | Sincronizar aba ativa com URL |
| `src/client/pages/ClientEvents.tsx` | Sincronizar aba ativa com URL |
| `src/client/pages/ClientReports.tsx` | Sincronizar aba ativa com URL |

## Detalhes Técnicos

### Lógica de sincronização URL → Aba

Cada página usará `useLocation` para extrair o pathname e determinar qual aba deve estar ativa:

```typescript
const location = useLocation();
const getInitialTab = () => {
  if (location.pathname.includes('/invites')) return 'invites';
  if (location.pathname.includes('/my-events')) return 'my-events';
  return 'invites'; // default
};
const [activeTab, setActiveTab] = useState(getInitialTab);
```

### Tratamento especial para "Produzir"

O link `/client/events/create` deve:
1. Navegar para a aba "my-events"
2. Abrir automaticamente o modal de criação de evento

Isso será feito verificando se a URL contém `/create` e chamando `setIsEventFormOpen(true)` no `useEffect`.
