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

// ==========================================
// AUTH CONTEXT TYPES
// ==========================================

export interface ClientAuthState {
  client: Client | null;
  employee: ClientEmployee | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
