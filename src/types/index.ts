// Core types for Barty app

export interface City {
  id: string;
  name: string;
  state: string;
}

export interface Establishment {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  address: string;
  cityId: string;
  cnpj: string;
  openingHours: string;
  paymentMethods: string[];
  hasPromotion: boolean;
  promotionText?: string;
  distance?: number;
}

export interface Category {
  id: string;
  name: string;
  establishmentId: string;
  order: number;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  image: string;
  prepTime: number; // in minutes
  categoryId: string;
  establishmentId: string;
  isHighlight: boolean;
  requiresPreparation: boolean;
  addons?: ProductAddon[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addons: { addon: ProductAddon; quantity: number }[];
  notes?: string;
  establishmentId: string;
}

export interface Ticket {
  id: string;
  productId: string;
  product: Product;
  establishmentId: string;
  establishment: Establishment;
  orderId: string;
  orderNumber: string;
  status: 'available' | 'sent_to_production' | 'in_production' | 'ready' | 'used' | 'expired' | 'gifted';
  sentToProductionAt?: Date;
  readyAt?: Date;
  usedAt?: Date;
  expiresAt: Date;
  giftedTo?: string;
  giftedFrom?: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  establishmentId: string;
  establishment: Establishment;
  items: OrderItem[];
  total: number;
  paymentMethod: 'credit_card' | 'pix' | 'cash' | 'wallet';
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  addons: { name: string; price: number; quantity: number }[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  establishmentId: string;
  rating: number;
  comment: string;
  reply?: string;
  createdAt: Date;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'deposit' | 'purchase' | 'refund';
  amount: number;
  description: string;
  paymentMethod?: 'pix' | 'credit_card';
  establishmentName?: string;
  orderNumber?: string;
  createdAt: Date;
}

export interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  avatar?: string;
  walletBalance: number;
  savedCards: SavedCard[];
  favoriteEstablishments: string[];
}
