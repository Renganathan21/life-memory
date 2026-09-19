export type ID = string;

export interface BaseEntity {
  id: ID;
  userId: ID;
  createdAt: string;
  updatedAt: string;
}

export enum MemoryCategory {
  HOME_VEHICLE = 'home_vehicle',
  DOCUMENT = 'document',
  MEDICINE = 'medicine',
  SUBSCRIPTION = 'subscription',
  PURCHASE = 'purchase',
  FAMILY = 'family',
  PARKING = 'parking',
  REMINDER = 'reminder',
}

export const CATEGORY_METADATA: Record<MemoryCategory, {
  label: string;
  icon: string;
  description: string;
  color: string;
}> = {
  [MemoryCategory.HOME_VEHICLE]: {
    label: 'Home / Vehicle',
    icon: 'wrench',
    description: 'Maintenance, service intervals, appliances, and vehicles',
    color: '#0284c7', // Sky 600
  },
  [MemoryCategory.DOCUMENT]: {
    label: 'Document',
    icon: 'file-text',
    description: 'IDs, passports, policies, contracts, and renewals',
    color: '#8b5cf6', // Violet 500
  },
  [MemoryCategory.MEDICINE]: {
    label: 'Medicine',
    icon: 'pill',
    description: 'Refills, stock levels, dosages, and expiration dates',
    color: '#10b981', // Emerald 500
  },
  [MemoryCategory.SUBSCRIPTION]: {
    label: 'Subscription',
    icon: 'credit-card',
    description: 'Recurring services, billing dates, and cost tracking',
    color: '#f59e0b', // Amber 500
  },
  [MemoryCategory.PURCHASE]: {
    label: 'Purchase',
    icon: 'shopping-bag',
    description: 'Warranties, price paid, stores, and return windows',
    color: '#ec4899', // Pink 500
  },
  [MemoryCategory.FAMILY]: {
    label: 'Family',
    icon: 'users',
    description: 'Loved ones, key dates, duties, and shared responsibilities',
    color: '#3b82f6', // Blue 500
  },
  [MemoryCategory.PARKING]: {
    label: 'Parking',
    icon: 'map-pin',
    description: 'Saved spot, floor, section, pillar note, and GPS pin',
    color: '#6366f1', // Indigo 500
  },
  [MemoryCategory.REMINDER]: {
    label: 'Reminder',
    icon: 'bell',
    description: 'One-off or recurring personal to-dos and follow-ups',
    color: '#14b8a6', // Teal 500
  },
};

export interface User {
  id: ID;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface AttachmentMeta extends BaseEntity {
  storageKey: string;
  fileName: string;
  mimeType: string;
  size: number;
  publicUrl?: string;
}

export interface Asset extends BaseEntity {
  name: string;
  type: 'vehicle' | 'home_appliance' | 'property' | 'equipment' | 'other';
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  notes?: string;
  attachmentIds?: ID[];
}

export interface MaintenanceRecord extends BaseEntity {
  assetId: ID;
  title: string;
  serviceDate: string;
  nextDueDate?: string;
  cost?: number;
  currency?: string;
  isRecurring?: boolean;
  recurrenceIntervalMonths?: number;
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
  serviceProvider?: string;
  attachmentIds?: ID[];
}

export interface DocumentItem extends BaseEntity {
  name: string;
  documentType: 'passport' | 'id_card' | 'driving_license' | 'insurance' | 'contract' | 'warranty' | 'other';
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  reminderDaysBefore?: number[];
  notes?: string;
  attachmentIds?: ID[];
}

export interface Medicine extends BaseEntity {
  name: string;
  dosage?: string;
  quantity?: number;
  reorderThreshold?: number;
  expiryDate?: string;
  dosageInstructions?: string;
  notes?: string;
}

export type BillingFrequency = 'monthly' | 'quarterly' | 'yearly' | 'weekly';

export interface Subscription extends BaseEntity {
  name: string;
  price: number;
  currency: string;
  billingFrequency: BillingFrequency;
  nextBillingDate: string;
  paymentMethod?: string;
  category?: string;
  autoRenew: boolean;
  notes?: string;
  monthlyCost: number;
  yearlyCost: number;
}

export interface Purchase extends BaseEntity {
  productName: string;
  price: number;
  currency: string;
  purchaseDate: string;
  store?: string;
  warrantyExpiryDate?: string;
  returnByDate?: string;
  notes?: string;
  attachmentIds?: ID[];
}

export interface FamilyMember extends BaseEntity {
  name: string;
  relationship: string;
  birthday?: string;
  notes?: string;
}

export interface ParkingRecord extends BaseEntity {
  locationName: string;
  floor?: string;
  section?: string;
  slot?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  photoUrl?: string;
  parkedAt: string;
  isActive: boolean;
}

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface ReminderItem extends BaseEntity {
  title: string;
  description?: string;
  dueDateTime: string;
  recurrence: RecurrenceType;
  isCompleted: boolean;
  completedAt?: string;
  snoozedUntil?: string;
  relatedCategory?: MemoryCategory;
  relatedId?: ID;
  familyMemberId?: ID;
  reminderPeriodsMinutes?: number[];
}

export interface AttentionItem {
  id: ID;
  category: MemoryCategory;
  title: string;
  subtitle: string;
  dueDate: string;
  daysRemaining: number;
  urgency: 'overdue' | 'critical' | 'soon' | 'normal';
  targetRoute?: string;
}

export interface DashboardResponse {
  greeting: string;
  needsAttention: AttentionItem[];
  upcoming: AttentionItem[];
  stats: {
    totalItems: number;
    expiringSoonCount: number;
    monthlySubscriptionSpend: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
