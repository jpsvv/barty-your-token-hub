import type {
  Client,
  ClientEmployee,
  OperatingHours,
  ClientCategory,
  ClientProduct,
  PrintSector,
  ProductionItem,
  PendingProduct,
  PendingTicket,
  CashierTransaction,
  ClientCustomer,
  ClientEvent,
  EventInvite,
  DashboardData,
  ClientReview,
} from '@/types/client';

// ==========================================
// ESTABELECIMENTO MOCK
// ==========================================

export const mockClient: Client = {
  id: 'client-1',
  type: 'establishment',
  name: 'Bar do João Ltda',
  tradingName: 'Bar do João',
  email: 'contato@bardojoao.com.br',
  phone: '(11) 99999-9999',
  cnpj: '12.345.678/0001-90',
  logo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=200&fit=crop',
  coverImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop',
  address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
  cityId: 'sp-sao-paulo',
  website: 'https://instagram.com/bardojoao',
  description: 'O melhor bar da cidade com chope artesanal e petiscos tradicionais.',
  paymentMethods: ['credit_card', 'debit_card', 'pix', 'cash'],
  status: 'approved',
  isOpen: true,
  createdAt: new Date('2024-01-15'),
};

export const mockEmployee: ClientEmployee = {
  id: 'emp-1',
  clientId: 'client-1',
  name: 'João Silva',
  email: 'joao@bardojoao.com.br',
  phone: '(11) 99999-9999',
  role: 'admin',
  permissions: [
    'dashboard',
    'settings',
    'menu',
    'operational',
    'production',
    'pending',
    'cashier',
    'customers',
    'events',
    'reports',
    'financial',
  ],
  isActive: true,
  createdAt: new Date('2024-01-15'),
};

export const mockEmployees: ClientEmployee[] = [
  mockEmployee,
  {
    id: 'emp-2',
    clientId: 'client-1',
    name: 'Maria Santos',
    email: 'maria@bardojoao.com.br',
    phone: '(11) 88888-8888',
    role: 'cashier',
    permissions: ['dashboard', 'cashier', 'pending'],
    isActive: true,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'emp-3',
    clientId: 'client-1',
    name: 'Pedro Lima',
    email: 'pedro@bardojoao.com.br',
    phone: '(11) 77777-7777',
    role: 'kitchen',
    permissions: ['production'],
    isActive: true,
    createdAt: new Date('2024-02-15'),
  },
];

export const mockOperatingHours: OperatingHours[] = [
  { id: 'oh-1', clientId: 'client-1', dayOfWeek: 0, openTime: '18:00', closeTime: '00:00', isActive: false },
  { id: 'oh-2', clientId: 'client-1', dayOfWeek: 1, openTime: '18:00', closeTime: '00:00', isActive: false },
  { id: 'oh-3', clientId: 'client-1', dayOfWeek: 2, openTime: '18:00', closeTime: '02:00', isActive: true },
  { id: 'oh-4', clientId: 'client-1', dayOfWeek: 3, openTime: '18:00', closeTime: '02:00', isActive: true },
  { id: 'oh-5', clientId: 'client-1', dayOfWeek: 4, openTime: '18:00', closeTime: '02:00', isActive: true },
  { id: 'oh-6', clientId: 'client-1', dayOfWeek: 5, openTime: '18:00', closeTime: '03:00', isActive: true },
  { id: 'oh-7', clientId: 'client-1', dayOfWeek: 6, openTime: '16:00', closeTime: '03:00', isActive: true },
];

// ==========================================
// CARDÁPIO MOCK
// ==========================================

export const mockPrintSectors: PrintSector[] = [
  { id: 'sector-1', clientId: 'client-1', name: 'Cozinha', isActive: true },
  { id: 'sector-2', clientId: 'client-1', name: 'Bar', isActive: true },
  { id: 'sector-3', clientId: 'client-1', name: 'Churrasqueira', isActive: true },
];

export const mockCategories: ClientCategory[] = [
  { id: 'cat-1', clientId: 'client-1', name: 'Bebidas', order: 1, isActive: true, productCount: 8 },
  { id: 'cat-2', clientId: 'client-1', name: 'Porções', order: 2, isActive: true, productCount: 6 },
  { id: 'cat-3', clientId: 'client-1', name: 'Pratos', order: 3, isActive: true, productCount: 5 },
  { id: 'cat-4', clientId: 'client-1', name: 'Sobremesas', order: 4, isActive: false, productCount: 3 },
];

export const mockProducts: ClientProduct[] = [
  {
    id: 'prod-1',
    clientId: 'client-1',
    categoryId: 'cat-1',
    name: 'Chope Pilsen 500ml',
    description: 'Chope artesanal tipo Pilsen, gelado e cremoso',
    price: 15.0,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=300&fit=crop',
    prepTime: 0,
    printSectorId: 'sector-2',
    order: 1,
    ticketValidity: { type: '1_day' },
    tags: ['bestseller'],
    addons: [],
    addonsRequired: false,
    isActive: true,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'prod-2',
    clientId: 'client-1',
    categoryId: 'cat-1',
    name: 'Caipirinha',
    description: 'Caipirinha tradicional com limão, cachaça e açúcar',
    price: 18.0,
    promotionalPrice: 15.0,
    discountPercent: 17,
    image: 'https://images.unsplash.com/photo-1541546006121-5c3bc5e8c7b9?w=300&h=300&fit=crop',
    prepTime: 5,
    printSectorId: 'sector-2',
    order: 2,
    ticketValidity: { type: '1_day' },
    tags: [],
    addons: [
      { id: 'addon-1', name: 'Limão Siciliano', price: 3.0 },
      { id: 'addon-2', name: 'Morango', price: 4.0 },
    ],
    addonsRequired: false,
    isActive: true,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'prod-3',
    clientId: 'client-1',
    categoryId: 'cat-2',
    name: 'Batata Frita',
    description: 'Porção de batata frita crocante com molho especial',
    price: 25.0,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=300&fit=crop',
    prepTime: 15,
    printSectorId: 'sector-1',
    order: 1,
    ticketValidity: { type: '1_day' },
    tags: ['vegetarian'],
    addons: [
      { id: 'addon-3', name: 'Bacon', price: 5.0 },
      { id: 'addon-4', name: 'Cheddar', price: 4.0 },
    ],
    addonsRequired: false,
    isActive: true,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'prod-4',
    clientId: 'client-1',
    categoryId: 'cat-2',
    name: 'Porção de Carne de Sol',
    description: 'Carne de sol desfiada com mandioca frita',
    price: 45.0,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=300&fit=crop',
    prepTime: 20,
    printSectorId: 'sector-3',
    order: 2,
    ticketValidity: { type: '1_day' },
    tags: ['bestseller'],
    addons: [],
    addonsRequired: false,
    isActive: true,
    createdAt: new Date('2024-01-20'),
  },
];

// ==========================================
// OPERACIONAL MOCK
// ==========================================

export const mockProductionItems: ProductionItem[] = [
  {
    id: 'pi-1',
    ticketId: 'ticket-1',
    orderNumber: '1234',
    customerName: 'João Silva',
    productId: 'prod-3',
    productName: 'Batata Frita',
    addons: [{ name: 'Bacon', quantity: 1 }],
    observation: 'Sem sal',
    printSectorId: 'sector-1',
    status: 'pending',
    sentToProductionAt: new Date(Date.now() - 5 * 60000),
    prepTime: 15,
    isOverdue: false,
  },
  {
    id: 'pi-2',
    ticketId: 'ticket-2',
    orderNumber: '1230',
    customerName: 'Maria Santos',
    productId: 'prod-4',
    productName: 'Porção de Carne de Sol',
    addons: [],
    printSectorId: 'sector-3',
    status: 'in_production',
    sentToProductionAt: new Date(Date.now() - 25 * 60000),
    prepTime: 20,
    isOverdue: true,
  },
  {
    id: 'pi-3',
    ticketId: 'ticket-3',
    orderNumber: '1228',
    customerName: 'Pedro Lima',
    productId: 'prod-2',
    productName: 'Caipirinha',
    addons: [{ name: 'Morango', quantity: 1 }],
    printSectorId: 'sector-2',
    status: 'ready',
    sentToProductionAt: new Date(Date.now() - 8 * 60000),
    readyAt: new Date(Date.now() - 2 * 60000),
    prepTime: 5,
    isOverdue: false,
  },
];

export const mockPendingProducts: PendingProduct[] = [
  { productId: 'prod-1', productName: 'Chope Pilsen 500ml', pendingCount: 12, requiresPreparation: false },
  { productId: 'prod-3', productName: 'Batata Frita', pendingCount: 8, requiresPreparation: true },
  { productId: 'prod-2', productName: 'Caipirinha', pendingCount: 5, requiresPreparation: true },
];

export const mockPendingTickets: PendingTicket[] = [
  {
    ticketId: 'pt-1',
    userId: 'user-1',
    userName: 'João Silva',
    userPhone: '(11) 99999-1111',
    productId: 'prod-1',
    productName: 'Chope Pilsen 500ml',
    purchasedAt: new Date(Date.now() - 30 * 60000),
    status: 'not_sent',
  },
  {
    ticketId: 'pt-2',
    userId: 'user-2',
    userName: 'Maria Santos',
    userPhone: '(11) 99999-2222',
    productId: 'prod-1',
    productName: 'Chope Pilsen 500ml',
    purchasedAt: new Date(Date.now() - 45 * 60000),
    status: 'not_sent',
  },
];

export const mockTransactions: CashierTransaction[] = [
  {
    id: 'tx-1',
    orderNumber: '1234',
    userId: 'user-1',
    userName: 'João Silva',
    items: [
      { productName: 'Chope Pilsen 500ml', quantity: 2, price: 30 },
      { productName: 'Batata Frita', quantity: 1, price: 25 },
    ],
    total: 55,
    paymentMethod: 'pix',
    paymentStatus: 'approved',
    createdAt: new Date(Date.now() - 10 * 60000),
  },
  {
    id: 'tx-2',
    orderNumber: '1233',
    userId: 'user-2',
    userName: 'Maria Santos',
    items: [{ productName: 'Porção de Carne de Sol', quantity: 1, price: 45 }],
    total: 45,
    paymentMethod: 'credit_card',
    paymentStatus: 'approved',
    createdAt: new Date(Date.now() - 20 * 60000),
  },
  {
    id: 'tx-3',
    orderNumber: '1232',
    userId: 'user-3',
    userName: 'Pedro Lima',
    items: [{ productName: 'Caipirinha', quantity: 2, price: 36 }],
    total: 36,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 5 * 60000),
  },
];

// ==========================================
// CLIENTES MOCK
// ==========================================

export const mockCustomers: ClientCustomer[] = [
  {
    id: 'user-1',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-1111',
    cpf: '123.456.789-00',
    totalSpent: 1250,
    totalOrders: 15,
    lastOrderAt: new Date(Date.now() - 2 * 24 * 60 * 60000),
    availableTickets: [
      {
        ticketId: 'at-1',
        productName: 'Chope Pilsen 500ml',
        status: 'available',
        purchasedAt: new Date(Date.now() - 60 * 60000),
        expiresAt: new Date(Date.now() + 23 * 60 * 60000),
      },
    ],
    orderHistory: [
      { orderId: 'o-1', orderNumber: '1234', total: 85, itemsCount: 3, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000) },
    ],
  },
  {
    id: 'user-2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(11) 99999-2222',
    cpf: '987.654.321-00',
    totalSpent: 890,
    totalOrders: 12,
    lastOrderAt: new Date(Date.now() - 5 * 24 * 60 * 60000),
    availableTickets: [],
    orderHistory: [],
  },
];

// ==========================================
// EVENTOS MOCK
// ==========================================

export const mockEvents: ClientEvent[] = [
  {
    id: 'event-1',
    producerId: 'client-1',
    name: 'Festival Gastronômico 2024',
    logo: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop',
    themeColor: '#8B5CF6',
    location: 'Parque da Cidade - São Paulo',
    description: 'O maior festival gastronômico da cidade',
    operatingHours: [],
    feeType: 'both',
    feePercentage: 5,
    feeFixed: 500,
    status: 'active',
    participants: [
      { clientId: 'client-2', clientName: 'Pizzaria Pedro', inviteStatus: 'accepted', invitedAt: new Date(), respondedAt: new Date() },
      { clientId: 'client-3', clientName: 'Restaurante Maria', inviteStatus: 'pending', invitedAt: new Date() },
    ],
    createdAt: new Date('2024-02-01'),
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-17'),
  },
];

export const mockEventInvites: EventInvite[] = [
  {
    id: 'invite-1',
    eventId: 'event-2',
    eventName: 'Festa Junina 2024',
    eventDescription: 'Tradicional festa junina com comidas típicas',
    eventLocation: 'Centro de Convenções',
    producerName: 'Eventos XYZ',
    feeType: 'percentage',
    feePercentage: 8,
    participants: [
      { name: 'Bar do João', status: 'pending' },
      { name: 'Pizzaria Pedro', status: 'accepted' },
    ],
    invitedAt: new Date(),
  },
];

// ==========================================
// DASHBOARD MOCK
// ==========================================

export const mockDashboardData: DashboardData = {
  periodStart: new Date(new Date().setHours(19, 0, 0, 0)),
  periodEnd: new Date(new Date().setHours(2, 0, 0, 0)),
  isOpen: true,
  totalRevenue: 8450,
  totalOrders: 127,
  averageTicket: 66.53,
  paymentBreakdown: [
    { method: 'PIX', amount: 4200, count: 65 },
    { method: 'Cartão Crédito', amount: 2800, count: 42 },
    { method: 'Cartão Débito', amount: 950, count: 15 },
    { method: 'Dinheiro', amount: 500, count: 5 },
  ],
  topProducts: [
    { name: 'Chope Pilsen 500ml', quantity: 45 },
    { name: 'Batata Frita', quantity: 38 },
    { name: 'Caipirinha', quantity: 32 },
    { name: 'Porção de Carne de Sol', quantity: 28 },
    { name: 'Cerveja Long Neck', quantity: 25 },
  ],
  topCustomers: [
    { name: 'João Silva', spent: 250 },
    { name: 'Maria Santos', spent: 180 },
    { name: 'Pedro Lima', spent: 150 },
  ],
  productionStats: {
    pending: 5,
    inProduction: 8,
    ready: 3,
    delivered: 89,
  },
  unsoldTickets: [
    { productName: 'Chope Pilsen 500ml', count: 12 },
    { productName: 'Batata Frita', count: 8 },
    { productName: 'Caipirinha', count: 5 },
    { productName: 'Porção de Carne de Sol', count: 3 },
  ],
};

// ==========================================
// AVALIAÇÕES MOCK
// ==========================================

export const mockReviews: ClientReview[] = [
  {
    id: 'review-1',
    userId: 'user-1',
    userName: 'João Silva',
    rating: 5,
    comment: 'Excelente bar! Chope muito bem tirado e atendimento nota 10.',
    reply: 'Obrigado João! Esperamos você em breve!',
    repliedAt: new Date(Date.now() - 24 * 60 * 60000),
    createdAt: new Date(Date.now() - 48 * 60 * 60000),
  },
  {
    id: 'review-2',
    userId: 'user-2',
    userName: 'Maria Santos',
    rating: 4,
    comment: 'Boa comida, mas o tempo de espera foi um pouco longo.',
    createdAt: new Date(Date.now() - 72 * 60 * 60000),
  },
];
