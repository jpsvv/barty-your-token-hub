
# Plano Atualizado - Barty Cliente (Backoffice Completo)

## Visão Geral

Aplicativo separado para estabelecimentos e eventos gerenciarem suas operações no ecossistema Barty, com funcionalidades completas de gestão de cardápio, operacional, eventos e relatórios financeiros.

---

## Estrutura de Menus

```text
+------------------------------------------+
|  BARTY CLIENTE                           |
+------------------------------------------+
|  1. DASHBOARD                            |
|  2. CONFIGURAÇÕES                        |
|  3. CARDÁPIO                             |
|     - Categorias                         |
|     - Produtos                           |
|  4. OPERACIONAL                          |
|     - Produção (Setores)                 |
|     - Pendentes                          |
|     - Caixa                              |
|  5. CLIENTES                             |
|  6. EVENTO                               |
|     - Aceitar Convite                    |
|     - Produzir Evento                    |
|     - Meus Eventos                       |
|  7. RELATÓRIOS                           |
|     - Vendas                             |
|     - Financeiros & Repasses             |
+------------------------------------------+
```

---

## Estrutura de Arquivos

```text
src/
├── client/
│   ├── pages/
│   │   ├── ClientLogin.tsx
│   │   ├── ClientSignup.tsx
│   │   ├── ClientDashboard.tsx
│   │   ├── ClientSettings.tsx
│   │   ├── ClientMenu.tsx
│   │   │   ├── CategoriesTab.tsx
│   │   │   └── ProductsTab.tsx
│   │   ├── ClientOperational.tsx
│   │   │   ├── ProductionTab.tsx
│   │   │   ├── PendingTab.tsx
│   │   │   └── CashierTab.tsx
│   │   ├── ClientCustomers.tsx
│   │   ├── ClientEvents.tsx
│   │   │   ├── AcceptInviteTab.tsx
│   │   │   ├── CreateEventTab.tsx
│   │   │   └── MyEventsTab.tsx
│   │   └── ClientReports.tsx
│   │       ├── SalesReportTab.tsx
│   │       └── FinancialReportTab.tsx
│   ├── components/
│   │   ├── ClientSidebar.tsx
│   │   ├── ClientHeader.tsx
│   │   ├── DashboardCard.tsx
│   │   ├── ProductForm.tsx
│   │   ├── CategoryForm.tsx
│   │   ├── ProductionSectorCard.tsx
│   │   ├── ProductionItemCard.tsx
│   │   ├── PendingTicketCard.tsx
│   │   ├── CustomerCard.tsx
│   │   ├── EventForm.tsx
│   │   ├── QRCodeGenerator.tsx
│   │   ├── QRScanner.tsx
│   │   ├── TeamMemberForm.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── SalesChart.tsx
│   │   └── TransactionList.tsx
│   ├── contexts/
│   │   ├── ClientAuthContext.tsx
│   │   ├── ClientEstablishmentContext.tsx
│   │   ├── ClientProductsContext.tsx
│   │   ├── ClientOperationalContext.tsx
│   │   ├── ClientEventsContext.tsx
│   │   └── ClientReportsContext.tsx
│   └── layouts/
│       └── ClientLayout.tsx
├── types/
│   └── client.ts
└── data/
    └── mockClientData.ts
```

---

## Tipos de Dados Completos

### `src/types/client.ts`

```typescript
// ==========================================
// ESTABELECIMENTO/CLIENTE
// ==========================================

export interface Client {
  id: string;
  type: 'establishment' | 'event';
  name: string;
  tradingName: string;
  email: string;
  phone: string;
  cnpj: string;
  logo?: string;
  coverImage?: string;
  address: string;
  cityId: string;
  website?: string;
  description: string;
  paymentMethods: string[];
  status: 'pending' | 'approved' | 'suspended';
  isOpen: boolean;
  temporaryClosedUntil?: Date;
  createdAt: Date;
}

export interface OperatingHours {
  id: string;
  clientId: string;
  dayOfWeek: number; // 0-6 (domingo-sábado)
  openTime: string;  // "19:00"
  closeTime: string; // "02:00"
  isActive: boolean;
}

// ==========================================
// EQUIPE E PERMISSÕES
// ==========================================

export type ClientRole = 'admin' | 'manager' | 'cashier' | 'kitchen' | 'custom';

export interface ClientEmployee {
  id: string;
  clientId: string;
  name: string;
  email: string;
  phone: string;
  role: ClientRole;
  permissions: ClientPermission[];
  isActive: boolean;
  createdAt: Date;
}

export type ClientPermission = 
  | 'dashboard'
  | 'settings'
  | 'menu'
  | 'operational'
  | 'production'
  | 'pending'
  | 'cashier'
  | 'customers'
  | 'events'
  | 'reports'
  | 'financial';

// ==========================================
// CARDÁPIO
// ==========================================

export interface ClientCategory {
  id: string;
  clientId: string;
  name: string;
  order: number;
  isActive: boolean;
  productCount?: number;
}

export interface PrintSector {
  id: string;
  clientId: string;
  name: string;
  isActive: boolean;
}

export type TicketValidityType = 
  | '1_day' 
  | '1_week' 
  | '1_month' 
  | '1_year' 
  | 'custom';

export interface ClientProduct {
  id: string;
  clientId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  promotionalPrice?: number;
  discountPercent?: number;
  image?: string;
  prepTime: number; // 0 = disponível para retirada imediata
  printSectorId?: string; // null = não imprime
  order: number;
  ticketValidity: {
    type: TicketValidityType;
    customDays?: number;
  };
  tags: ProductTag[];
  addons: ClientProductAddon[];
  addonsRequired: boolean;
  isActive: boolean;
  createdAt: Date;
}

export type ProductTag = 
  | 'vegan' 
  | 'vegetarian' 
  | 'gluten_free' 
  | 'fit' 
  | 'spicy'
  | 'new'
  | 'bestseller';

export interface ClientProductAddon {
  id: string;
  name: string;
  price: number;
  image?: string;
}

// ==========================================
// OPERACIONAL - PRODUÇÃO
// ==========================================

export interface ProductionItem {
  id: string;
  ticketId: string;
  orderNumber: string;
  customerName: string;
  productId: string;
  productName: string;
  addons: { name: string; quantity: number }[];
  observation?: string;
  printSectorId: string;
  status: 'pending' | 'in_production' | 'ready';
  sentToProductionAt: Date;
  readyAt?: Date;
  prepTime: number; // tempo estimado
  isOverdue: boolean;
}

// ==========================================
// OPERACIONAL - PENDENTES
// ==========================================

export interface PendingProduct {
  productId: string;
  productName: string;
  pendingCount: number;
  requiresPreparation: boolean;
}

export interface PendingTicket {
  ticketId: string;
  userId: string;
  userName: string;
  userPhone: string;
  productId: string;
  productName: string;
  purchasedAt: Date;
  status: 'not_sent' | 'in_production' | 'ready';
}

// ==========================================
// OPERACIONAL - CAIXA
// ==========================================

export interface CashierTransaction {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  items: { productName: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: 'credit_card' | 'debit_card' | 'pix' | 'cash' | 'wallet';
  paymentStatus: 'pending' | 'approved' | 'cancelled';
  createdAt: Date;
}

// ==========================================
// CLIENTES (USUÁRIOS)
// ==========================================

export interface ClientCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  totalSpent: number;
  totalOrders: number;
  lastOrderAt?: Date;
  availableTickets: CustomerTicket[];
  orderHistory: CustomerOrder[];
}

export interface CustomerTicket {
  ticketId: string;
  productName: string;
  status: 'available' | 'in_production' | 'ready';
  purchasedAt: Date;
  expiresAt: Date;
}

export interface CustomerOrder {
  orderId: string;
  orderNumber: string;
  total: number;
  itemsCount: number;
  createdAt: Date;
}

// ==========================================
// EVENTOS
// ==========================================

export interface ClientEvent {
  id: string;
  producerId: string; // ID do cliente que criou
  name: string;
  logo?: string;
  coverImage?: string;
  themeColor: string;
  location: string;
  description?: string;
  operatingHours: OperatingHours[];
  feeType: 'percentage' | 'fixed' | 'both';
  feePercentage?: number;
  feeFixed?: number;
  status: 'draft' | 'active' | 'cancelled' | 'finished';
  participants: EventParticipant[];
  createdAt: Date;
  startDate: Date;
  endDate: Date;
}

export interface EventParticipant {
  clientId: string;
  clientName: string;
  clientLogo?: string;
  inviteStatus: 'pending' | 'accepted' | 'declined';
  invitedAt: Date;
  respondedAt?: Date;
}

export interface EventInvite {
  id: string;
  eventId: string;
  eventName: string;
  eventDescription?: string;
  eventLocation: string;
  producerName: string;
  feeType: 'percentage' | 'fixed' | 'both';
  feePercentage?: number;
  feeFixed?: number;
  participants: { name: string; status: string }[];
  invitedAt: Date;
}

// ==========================================
// RELATÓRIOS
// ==========================================

export interface SalesReport {
  period: { start: Date; end: Date };
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  salesByHour: { hour: number; amount: number }[];
  salesByPaymentMethod: { method: string; amount: number; count: number }[];
  productRanking: { productName: string; quantity: number; revenue: number }[];
  categoryBreakdown: { categoryName: string; revenue: number }[];
}

export interface FinancialReport {
  orders: FinancialOrder[];
  transfers: TransferBatch[];
}

export interface FinancialOrder {
  orderId: string;
  orderNumber: string;
  total: number;
  paymentMethod: string;
  discounts: number;
  cardFee: number;
  bartyFee: number;
  eventFee: number;
  netAmount: number;
  createdAt: Date;
}

export interface TransferBatch {
  id: string;
  batchNumber: string;
  periodStart: Date;
  periodEnd: Date;
  paymentDate: Date;
  paymentMethod: string;
  grossAmount: number;
  cardFees: number;
  bartyFee: number;
  eventFee: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed';
  orders: string[]; // IDs dos pedidos incluídos
}

// ==========================================
// DASHBOARD
// ==========================================

export interface DashboardData {
  periodStart: Date;
  periodEnd: Date;
  isOpen: boolean;
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  paymentBreakdown: { method: string; amount: number; count: number }[];
  topProducts: { name: string; quantity: number }[];
  topCustomers: { name: string; spent: number }[];
  productionStats: {
    pending: number;
    inProduction: number;
    ready: number;
    delivered: number;
  };
  unsoldTickets: { productName: string; count: number }[];
}

// ==========================================
// AVALIAÇÕES
// ==========================================

export interface ClientReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  reply?: string;
  repliedAt?: Date;
  createdAt: Date;
}
```

---

## Detalhamento das Telas

### 1. DASHBOARD

**Arquivo:** `src/client/pages/ClientDashboard.tsx`

```text
+----------------------------------------------------------+
|  DASHBOARD              [Abrir/Fechar] [Gerar QR Code]   |
+----------------------------------------------------------+
|  Período: 19:00 - 02:00 (Hoje)          Status: ABERTO   |
+----------------------------------------------------------+
|                                                          |
|  VISÃO GERAL DO PERÍODO                                  |
|  +------------+ +------------+ +------------+ +--------+ |
|  | Faturamento| | Nº Pedidos | | Ticket     | | Formas | |
|  | R$ 8.450   | |    127     | | Médio      | | Pgto   | |
|  |            | |            | | R$ 66,53   | | [...]  | |
|  +------------+ +------------+ +------------+ +--------+ |
|                                                          |
|  INDICADORES                                             |
|  +------------------------+ +------------------------+   |
|  | Produtos Mais Vendidos | | Top Clientes          |   |
|  | 1. Chope Pilsen (45)   | | 1. João Silva R$250  |   |
|  | 2. Batata Frita (38)   | | 2. Maria Santos R$180|   |
|  | 3. Caipirinha (32)     | | 3. Pedro Lima R$150  |   |
|  +------------------------+ +------------------------+   |
|                                                          |
|  STATUS DOS PEDIDOS                                      |
|  [Em Aberto: 5] [Preparo: 8] [Prontos: 3] [Entregues: 89]|
|                                                          |
|  FICHAS NÃO UTILIZADAS                                   |
|  +--------------------------------------------------+   |
|  | Chope Pilsen: 12 fichas | Batata: 8 fichas      |   |
|  | Caipirinha: 5 fichas    | Porção Carne: 3 fichas|   |
|  +--------------------------------------------------+   |
+----------------------------------------------------------+
```

**Funcionalidades:**
- Métricas em tempo real do período atual
- Botão Abrir/Fechar com opções de tempo (15min, 30min, 1h, etc)
- Gerador de QR Code para cardápio
- Indicadores de produtos mais vendidos
- Top clientes do período
- Status de pedidos em cada etapa
- Fichas vendidas mas não utilizadas/enviadas

---

### 2. CONFIGURAÇÕES

**Arquivo:** `src/client/pages/ClientSettings.tsx`

```text
+----------------------------------------------------------+
|  CONFIGURAÇÕES                                            |
+----------------------------------------------------------+
|  [Estabelecimento] [Funcionamento] [Avaliações] [Equipe] |
+----------------------------------------------------------+
|                                                          |
|  DADOS DO ESTABELECIMENTO                                |
|  +--------------------------------------------------+   |
|  | Logo: [Upload]        Imagem de Fundo: [Upload]  |   |
|  +--------------------------------------------------+   |
|  | Nome: [_______________]                          |   |
|  | CNPJ: [_______________]                          |   |
|  | Contato: [_______________]                       |   |
|  | Link (site/instagram): [_______________]         |   |
|  | Localização: [_______________]                   |   |
|  | Descrição: [____________________________]        |   |
|  |            [____________________________]        |   |
|  +--------------------------------------------------+   |
|                                    [Salvar Alterações]   |
+----------------------------------------------------------+
```

**Sub-abas:**

1. **Estabelecimento:** Dados básicos (nome, logo, CNPJ, contato, etc)
2. **Funcionamento:** Dias e horários de operação
3. **Avaliações:** Lista de avaliações com opção de responder
4. **Equipe:** Gestão de funcionários e permissões

**Gestão de Equipe:**
- Perfil Admin: acesso total
- Perfis customizados: selecionar quais abas podem acessar
- Criar/editar/desativar funcionários

---

### 3. CARDÁPIO

**Arquivo:** `src/client/pages/ClientMenu.tsx`

#### Sub-aba: Categorias

```text
+----------------------------------------------------------+
|  CARDÁPIO > CATEGORIAS                   [+ Nova Categoria]|
+----------------------------------------------------------+
|                                                          |
|  +--------------------------------------------------+   |
|  | #  | Nome           | Produtos | Status | Ações  |   |
|  +--------------------------------------------------+   |
|  | 1  | Bebidas        |    12    | Ativo  | [✎][🗑]|   |
|  | 2  | Porções        |     8    | Ativo  | [✎][🗑]|   |
|  | 3  | Pratos         |    15    | Inativo| [✎][🗑]|   |
|  | 4  | Sobremesas     |     5    | Ativo  | [✎][🗑]|   |
|  +--------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+
```

#### Sub-aba: Produtos

```text
+----------------------------------------------------------+
|  CARDÁPIO > PRODUTOS                    [+ Novo Produto]  |
+----------------------------------------------------------+
|  Filtros: [Nome] [Categoria] [Setor Impressão] [Status]  |
+----------------------------------------------------------+
|                                                          |
|  +--------------------------------------------------+   |
|  | Imagem | Nome        | Categoria | Preço  | Status|   |
|  +--------------------------------------------------+   |
|  | [img]  | Chope 500ml | Bebidas   | R$15   | Ativo |   |
|  | [img]  | Batata Frita| Porções   | R$25   | Ativo |   |
|  | [img]  | Caipirinha  | Bebidas   | R$18   | Inativo|  |
|  +--------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+
```

**Formulário de Produto (Modal):**

```text
+----------------------------------------------------------+
|  ADICIONAR/EDITAR PRODUTO                          [X]   |
+----------------------------------------------------------+
|  [Básico] [Preço] [Produção] [Adicionais]                |
+----------------------------------------------------------+
|                                                          |
|  BÁSICO:                                                 |
|  Nome: [_______________]                                 |
|  Categoria: [Dropdown]                                   |
|  Descrição: [____________________________]               |
|  Imagem: [Upload]                                        |
|  Tags: [Vegano] [Vegetariano] [Sem Glúten] [Fit] [...]  |
|                                                          |
|  PREÇO:                                                  |
|  Preço: R$ [___]                                         |
|  [x] Aplicar promoção                                    |
|      Desconto %: [___] OU Preço promocional: R$ [___]    |
|                                                          |
|  PRODUÇÃO:                                               |
|  Tempo médio de preparo: [___] min (0 = retirada imediata)|
|  Setor de impressão: [Dropdown ou Nenhum]                |
|  Ordem no menu: [___]                                    |
|  Validade da ficha: [1 dia | 1 semana | 1 mês | ...]    |
|                                                          |
|  ADICIONAIS:                                             |
|  [x] Adicionais obrigatórios                             |
|  +--------------------------------------------------+   |
|  | Nome          | Preço  | Imagem | Ações          |   |
|  | Bacon         | R$ 5   | [img]  | [✎][🗑]        |   |
|  | Queijo Extra  | R$ 4   | [img]  | [✎][🗑]        |   |
|  +--------------------------------------------------+   |
|  [+ Adicionar Item]                                      |
|                                                          |
|                              [Cancelar] [Salvar Produto] |
+----------------------------------------------------------+
```

---

### 4. OPERACIONAL

**Arquivo:** `src/client/pages/ClientOperational.tsx`

#### Sub-aba: Produção

```text
+----------------------------------------------------------+
|  OPERACIONAL > PRODUÇÃO                                   |
+----------------------------------------------------------+
|  [Configurar Setores]                                    |
+----------------------------------------------------------+
|  SETOR: COZINHA                                          |
+----------------------------------------------------------+
|  AGUARDANDO (5)  |  EM PREPARO (3)  |  PRONTOS (2)       |
+----------------------------------------------------------+
| +----------------+ +----------------+ +----------------+ |
| | #1234          | | #1230          | | #1228          | |
| | João Silva     | | Maria Santos   | | Pedro Lima     | |
| | Batata Frita   | | Porção Carne   | | Fritas Grande  | |
| | + Bacon        | | Obs: Sem sal   | |                | |
| | 14:32 (5 min)  | | 14:25 (12 min) | | 14:35 (2 min)  | |
| |   ⏱️ 🟢       | |   ⏱️ 🔴       | |                | |
| | [Iniciar]      | | [Pronto!]      | | [Entregue]     | |
| +----------------+ +----------------+ +----------------+ |
+----------------------------------------------------------+
|  SETOR: BAR                                              |
+----------------------------------------------------------+
|  AGUARDANDO (3)  |  EM PREPARO (1)  |  PRONTOS (4)       |
+----------------------------------------------------------+
| ...                                                      |
+----------------------------------------------------------+
```

**Funcionalidades:**
- Criação de setores de produção
- Cards com cronômetro (vermelho se ultrapassar tempo)
- Botões de ação por status
- Notificação sonora para novos pedidos
- Quando QR Code é lido, item sai da fila

#### Sub-aba: Pendentes

```text
+----------------------------------------------------------+
|  OPERACIONAL > PENDENTES                                  |
+----------------------------------------------------------+
|                                                          |
|  FICHAS NÃO UTILIZADAS                                   |
|  +--------------------------------------------------+   |
|  | Produto        | Fichas Pendentes | Ação          |   |
|  +--------------------------------------------------+   |
|  | Chope Pilsen   |       12         | [Ver Clientes]|   |
|  | Batata Frita   |        8         | [Ver Clientes]|   |
|  | Caipirinha     |        5         | [Ver Clientes]|   |
|  +--------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  CLIENTES COM FICHAS: Chope Pilsen                 [X]   |
+----------------------------------------------------------+
|  | Cliente        | Qtd | Compra      | Ação            ||
|  +--------------------------------------------------+   |
|  | João Silva     |  2  | 14:30       | [Enviar Produção]|
|  | Maria Santos   |  1  | 14:45       | [Retirar Produto]|
|  | Pedro Lima     |  3  | 15:00       | [Enviar Produção]|
|  +--------------------------------------------------+   |
+----------------------------------------------------------+
```

**Funcionalidades:**
- Lista de produtos com fichas pendentes
- Drill-down para ver clientes
- Staff pode enviar para produção ou marcar retirada
- Quando QR é lido, sai da lista

#### Sub-aba: Caixa

```text
+----------------------------------------------------------+
|  OPERACIONAL > CAIXA                                      |
+----------------------------------------------------------+
|  [Transações] [Pagamentos Pendentes]                     |
+----------------------------------------------------------+
|                                                          |
|  TRANSAÇÕES EM TEMPO REAL                                |
|  +--------------------------------------------------+   |
|  | #     | Cliente     | Valor   | Forma Pgto | Status ||
|  +--------------------------------------------------+   |
|  | 1234  | João Silva  | R$ 85   | PIX        | Pago   ||
|  | 1233  | Maria Santos| R$ 120  | Cartão     | Pago   ||
|  | 1232  | Pedro Lima  | R$ 45   | Dinheiro   | Pendente|
|  +--------------------------------------------------+   |
|                                                          |
|  AÇÕES: [Novo Pedido] [Cancelar] [Marcar Pago] [Editar] |
|                                                          |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  PAGAMENTOS PENDENTES (Dinheiro)                         |
+----------------------------------------------------------+
|  | #     | Cliente     | Valor   | Ações               ||
|  +--------------------------------------------------+   |
|  | 1232  | Pedro Lima  | R$ 45   | [Aprovar] [Cancelar]||
|  | 1228  | Ana Costa   | R$ 30   | [Aprovar] [Cancelar]||
|  +--------------------------------------------------+   |
+----------------------------------------------------------+
```

**Funcionalidades:**
- Visualização em tempo real de transações
- Aprovar pagamentos em dinheiro
- Cancelar pedidos pendentes
- Fazer pedido para cliente
- Editar pedidos
- Imprimir fichas

---

### 5. CLIENTES

**Arquivo:** `src/client/pages/ClientCustomers.tsx`

```text
+----------------------------------------------------------+
|  CLIENTES                                    [Buscar...] |
+----------------------------------------------------------+
|                                                          |
|  +--------------------------------------------------+   |
|  | Cliente      | Telefone    | Total Gasto | Pedidos|  |
|  +--------------------------------------------------+   |
|  | João Silva   | (11) 99999  | R$ 1.250    |   15   |  |
|  | Maria Santos | (11) 88888  | R$ 890      |   12   |  |
|  | Pedro Lima   | (11) 77777  | R$ 650      |    8   |  |
|  +--------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  CLIENTE: João Silva                               [X]   |
+----------------------------------------------------------+
|  Email: joao@email.com | Telefone: (11) 99999-9999      |
|  Total gasto: R$ 1.250 | Total pedidos: 15               |
+----------------------------------------------------------+
|  FICHAS DISPONÍVEIS                                      |
|  +--------------------------------------------------+   |
|  | Produto        | Qtd | Status        | Expira    |   |
|  | Chope Pilsen   |  2  | Disponível    | 25/02     |   |
|  | Batata Frita   |  1  | Em produção   | 25/02     |   |
|  +--------------------------------------------------+   |
+----------------------------------------------------------+
|  HISTÓRICO DE PEDIDOS                                    |
|  +--------------------------------------------------+   |
|  | # Pedido | Data       | Valor   | Itens          |   |
|  | 1234     | 20/02 14:30| R$ 85   | 3 itens        |   |
|  | 1198     | 18/02 20:15| R$ 120  | 5 itens        |   |
|  +--------------------------------------------------+   |
+----------------------------------------------------------+
|  [Presentear Item] [Fazer Pedido para Cliente]           |
+----------------------------------------------------------+
```

**Funcionalidades:**
- Lista de clientes com busca
- Detalhes do cliente com histórico
- Fichas disponíveis do cliente
- Presentear itens
- Fazer compras em nome do cliente

---

### 6. EVENTO

**Arquivo:** `src/client/pages/ClientEvents.tsx`

#### Sub-aba: Aceitar Convite

```text
+----------------------------------------------------------+
|  EVENTOS > CONVITES RECEBIDOS                            |
+----------------------------------------------------------+
|                                                          |
|  +--------------------------------------------------+   |
|  | EVENTO: Festival Gastronômico 2024               |   |
|  | Produtor: Eventos XYZ                            |   |
|  | Local: Parque da Cidade                          |   |
|  | Data: 15/03 a 17/03/2024                         |   |
|  | Taxa: 5% do faturamento + R$ 500 fixo            |   |
|  |                                                  |   |
|  | Participantes:                                   |   |
|  | ✓ Bar do João (Aceito)                          |   |
|  | ⏳ Restaurante Maria (Pendente)                  |   |
|  | ✓ Pizzaria Pedro (Aceito)                       |   |
|  |                                                  |   |
|  | [Aceitar Convite] [Recusar]                     |   |
|  +--------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+
```

#### Sub-aba: Produzir Evento

```text
+----------------------------------------------------------+
|  EVENTOS > PRODUZIR NOVO EVENTO              [+ Criar]   |
+----------------------------------------------------------+
|                                                          |
|  DADOS DO EVENTO                                         |
|  +--------------------------------------------------+   |
|  | Nome: [_______________]                          |   |
|  | Logo: [Upload]        Imagem de Fundo: [Upload]  |   |
|  | Cor do tema: [Color Picker]                      |   |
|  | Local: [_______________]                         |   |
|  | Descrição: [____________________________]        |   |
|  +--------------------------------------------------+   |
|                                                          |
|  FUNCIONAMENTO                                           |
|  +--------------------------------------------------+   |
|  | Data início: [___] Data fim: [___]               |   |
|  | Horários: [Configurar por dia]                   |   |
|  +--------------------------------------------------+   |
|                                                          |
|  TAXAS                                                   |
|  +--------------------------------------------------+   |
|  | [x] Porcentagem: [___] %                         |   |
|  | [x] Taxa fixa: R$ [___]                          |   |
|  +--------------------------------------------------+   |
|                                                          |
|  CONVIDAR ESTABELECIMENTOS                               |
|  +--------------------------------------------------+   |
|  | [Buscar estabelecimentos...]                     |   |
|  | ✓ Bar do João                                   |   |
|  | ✓ Pizzaria Pedro                                |   |
|  +--------------------------------------------------+   |
|                                                          |
|                              [Cancelar] [Criar Evento]   |
+----------------------------------------------------------+
```

#### Sub-aba: Meus Eventos

```text
+----------------------------------------------------------+
|  EVENTOS > MEUS EVENTOS                                  |
+----------------------------------------------------------+
|                                                          |
|  +--------------------------------------------------+   |
|  | EVENTO: Festival Gastronômico 2024               |   |
|  | Status: ATIVO                                    |   |
|  | Período: 15/03 a 17/03/2024                      |   |
|  | Participantes: 5 estabelecimentos                |   |
|  | Faturamento total: R$ 45.000                     |   |
|  |                                                  |   |
|  | [Ver Relatório] [Gerar QR Code] [Cancelar]       |   |
|  +--------------------------------------------------+   |
|                                                          |
|  +--------------------------------------------------+   |
|  | EVENTO: Festa Junina 2024                        |   |
|  | Status: FINALIZADO                               |   |
|  | ...                                              |   |
|  +--------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+
```

**Funcionalidades:**
- Aceitar/recusar convites de eventos
- Criar eventos multi-estabelecimento
- Definir taxas (% e/ou fixa)
- Convidar estabelecimentos
- Gerar QR Code do evento
- Relatórios consolidados do evento

---

### 7. RELATÓRIOS

**Arquivo:** `src/client/pages/ClientReports.tsx`

#### Sub-aba: Vendas

```text
+----------------------------------------------------------+
|  RELATÓRIOS > VENDAS                                      |
+----------------------------------------------------------+
|  Período: [01/02/2024] a [28/02/2024]  [Aplicar Filtro]  |
|  Categoria: [Todas] Produto: [Todos] Forma Pgto: [Todas] |
+----------------------------------------------------------+
|                                                          |
|  INDICADORES                                             |
|  +------------+ +------------+ +------------+            |
|  | Faturamento| | Nº Vendas  | | Ticket     |            |
|  | R$ 125.450 | |   1.847    | | Médio      |            |
|  |            | |            | | R$ 67,90   |            |
|  +------------+ +------------+ +------------+            |
|                                                          |
|  [Gráfico: Vendas por Período]                           |
|  [Gráfico: Vendas por Faixa de Horário]                  |
|                                                          |
|  RANKING DE PRODUTOS                                     |
|  +--------------------------------------------------+   |
|  | # | Produto        | Qtd Vendida | Faturamento   |   |
|  | 1 | Chope Pilsen   |     450     | R$ 6.750      |   |
|  | 2 | Batata Frita   |     380     | R$ 9.500      |   |
|  | 3 | Caipirinha     |     320     | R$ 5.760      |   |
|  +--------------------------------------------------+   |
|                                                          |
|                                      [Exportar CSV/Excel]|
+----------------------------------------------------------+
```

#### Sub-aba: Financeiros & Repasses

```text
+----------------------------------------------------------+
|  RELATÓRIOS > FINANCEIROS                                |
+----------------------------------------------------------+
|  [Pedidos] [Repasses]                                    |
+----------------------------------------------------------+
|                                                          |
|  DETALHAMENTO DE PEDIDOS                                 |
|  +--------------------------------------------------+   |
|  | #Pedido| Valor | Forma Pgto | Taxas | Líquido    |   |
|  +--------------------------------------------------+   |
|  | 1234   | R$85  | Cartão     | R$3,40| R$81,60    |   |
|  | 1233   | R$120 | PIX        | R$1,20| R$118,80   |   |
|  | 1232   | R$45  | Dinheiro   | R$0   | R$45,00    |   |
|  +--------------------------------------------------+   |
|  * Dinheiro: sem taxas Barty ou cartão                   |
|                                                          |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  REPASSES                                                |
+----------------------------------------------------------+
|  +--------------------------------------------------+   |
|  | Nº Repasse | Período        | Data Pgto | Status |   |
|  +--------------------------------------------------+   |
|  | REP-001    | 01/02 - 07/02  | 10/02     | Pago   |   |
|  | REP-002    | 08/02 - 14/02  | 17/02     | Pago   |   |
|  | REP-003    | 15/02 - 21/02  | 24/02     | Pendente|  |
|  +--------------------------------------------------+   |
|                                                          |
|  DETALHES DO REPASSE: REP-003                           |
|  +--------------------------------------------------+   |
|  | Período: 15/02 a 21/02/2024                      |   |
|  | Valor bruto: R$ 12.500                           |   |
|  | Taxa cartão: - R$ 312,50                         |   |
|  | Taxa Barty: - R$ 125,00                          |   |
|  | Taxa evento: - R$ 0,00                           |   |
|  | Valor líquido: R$ 12.062,50                      |   |
|  | Forma de pagamento: PIX                          |   |
|  | Status: Pendente                                 |   |
|  +--------------------------------------------------+   |
|  | Pedidos incluídos: [Ver 187 pedidos]             |   |
|  +--------------------------------------------------+   |
|                                                          |
|                                      [Exportar CSV/Excel]|
+----------------------------------------------------------+
```

---

## Fases de Implementação

### Fase 1: Estrutura Base e Autenticação
1. Criar estrutura de pastas `src/client/`
2. Definir tipos completos em `src/types/client.ts`
3. Criar `ClientAuthContext` com login/logout
4. Implementar `ClientLogin.tsx` e `ClientSignup.tsx`
5. Criar `ClientLayout.tsx` com Sidebar
6. Configurar rotas `/client/*`

### Fase 2: Dashboard e Configurações
1. Implementar `ClientDashboard.tsx` com métricas
2. Funcionalidade Abrir/Fechar estabelecimento
3. Gerador de QR Code do cardápio
4. Implementar `ClientSettings.tsx` (dados, horários, avaliações)
5. Gestão de equipe com permissões

### Fase 3: Gestão de Cardápio
1. Implementar gestão de categorias
2. Implementar CRUD completo de produtos
3. Sistema de promoções (% ou valor)
4. Gestão de adicionais
5. Configuração de tags e validade
6. Filtros e busca

### Fase 4: Operacional - Produção
1. Criar/gerenciar setores de produção
2. Implementar cards de produção com cronômetro
3. Fluxo de status (aguardando > preparo > pronto)
4. Notificações sonoras
5. Integração com leitura de QR Code

### Fase 5: Operacional - Pendentes e Caixa
1. Lista de fichas pendentes por produto
2. Ações de enviar produção/retirar
3. Transações em tempo real no caixa
4. Pagamentos pendentes (dinheiro)
5. Ações de cancelar/editar/imprimir

### Fase 6: Clientes
1. Lista de clientes com busca
2. Detalhes e histórico do cliente
3. Fichas disponíveis por cliente
4. Presentear itens
5. Fazer pedido em nome do cliente

### Fase 7: Eventos
1. Aceitar/recusar convites
2. Criar novo evento
3. Gerenciar eventos ativos
4. QR Code do evento
5. Relatórios do evento

### Fase 8: Relatórios
1. Relatório de vendas com filtros
2. Gráficos (Recharts)
3. Relatório financeiro de pedidos
4. Sistema de repasses
5. Exportação CSV/Excel

---

## Dependências Necessárias

```bash
# Scanner de QR Code
npm install html5-qrcode

# Gerador de QR Code
npm install qrcode.react

# Exportação Excel (opcional)
npm install xlsx
```

---

## Arquivos a Serem Criados

| Arquivo | Descrição |
|---------|-----------|
| `src/types/client.ts` | Tipos completos do Cliente |
| `src/client/contexts/ClientAuthContext.tsx` | Autenticação e permissões |
| `src/client/contexts/ClientEstablishmentContext.tsx` | Dados do estabelecimento |
| `src/client/contexts/ClientProductsContext.tsx` | Cardápio e produtos |
| `src/client/contexts/ClientOperationalContext.tsx` | Produção, pendentes, caixa |
| `src/client/contexts/ClientEventsContext.tsx` | Gestão de eventos |
| `src/client/contexts/ClientReportsContext.tsx` | Relatórios e repasses |
| `src/client/layouts/ClientLayout.tsx` | Layout base com sidebar |
| `src/client/pages/ClientLogin.tsx` | Login do cliente |
| `src/client/pages/ClientSignup.tsx` | Cadastro multi-etapas |
| `src/client/pages/ClientDashboard.tsx` | Dashboard principal |
| `src/client/pages/ClientSettings.tsx` | Configurações gerais |
| `src/client/pages/ClientMenu.tsx` | Gestão de cardápio |
| `src/client/pages/ClientOperational.tsx` | Operacional (produção/caixa) |
| `src/client/pages/ClientCustomers.tsx` | Lista de clientes |
| `src/client/pages/ClientEvents.tsx` | Gestão de eventos |
| `src/client/pages/ClientReports.tsx` | Relatórios e financeiro |
| `src/client/components/ClientSidebar.tsx` | Menu lateral |
| `src/client/components/ClientHeader.tsx` | Cabeçalho com status |
| `src/client/components/DashboardCard.tsx` | Cards de métricas |
| `src/client/components/ProductForm.tsx` | Formulário de produto |
| `src/client/components/CategoryForm.tsx` | Formulário de categoria |
| `src/client/components/ProductionSectorCard.tsx` | Setor de produção |
| `src/client/components/ProductionItemCard.tsx` | Item em produção |
| `src/client/components/PendingTicketCard.tsx` | Ficha pendente |
| `src/client/components/CustomerCard.tsx` | Card de cliente |
| `src/client/components/EventForm.tsx` | Formulário de evento |
| `src/client/components/QRCodeGenerator.tsx` | Gerador de QR |
| `src/client/components/QRScanner.tsx` | Leitor de QR |
| `src/client/components/TeamMemberForm.tsx` | Formulário funcionário |
| `src/client/components/ReviewCard.tsx` | Card de avaliação |
| `src/client/components/SalesChart.tsx` | Gráficos de vendas |
| `src/client/components/TransactionList.tsx` | Lista de transações |
| `src/data/mockClientData.ts` | Dados mock do cliente |

---

## Diferenciação Visual

- **Cor primária:** Tons de azul/índigo
- **Layout:** Desktop-first com sidebar fixa
- **Tipografia:** Mais formal/profissional
- **Ícones:** Lucide React (consistente com app do usuário)
