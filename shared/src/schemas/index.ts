import { z } from 'zod';
import { MemoryCategory } from '../types/index.js';

export const RegisterSchema = z.object({
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters long').max(100),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim().optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long').max(100),
});
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export const AssetSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  type: z.enum(['vehicle', 'home_appliance', 'property', 'equipment', 'other']),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  notes: z.string().max(2000).optional(),
  attachmentIds: z.array(z.string()).optional(),
});
export type AssetInput = z.infer<typeof AssetSchema>;

export const MaintenanceRecordSchema = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
  title: z.string().min(1, 'Title is required').trim(),
  serviceDate: z.string(),
  nextDueDate: z.string().optional(),
  cost: z.number().nonnegative().optional(),
  currency: z.string().length(3).default('USD').optional(),
  isRecurring: z.boolean().default(false),
  recurrenceIntervalMonths: z.number().int().positive().optional(),
  isCompleted: z.boolean().default(false),
  notes: z.string().max(2000).optional(),
  serviceProvider: z.string().optional(),
  attachmentIds: z.array(z.string()).optional(),
});
export type MaintenanceRecordInput = z.infer<typeof MaintenanceRecordSchema>;

export const DocumentSchema = z.object({
  name: z.string().min(1, 'Document name is required').trim(),
  documentType: z.enum(['passport', 'id_card', 'driving_license', 'insurance', 'contract', 'warranty', 'other']),
  documentNumber: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  reminderDaysBefore: z.array(z.number().int().positive()).optional(),
  notes: z.string().max(2000).optional(),
  attachmentIds: z.array(z.string()).optional(),
});
export type DocumentInput = z.infer<typeof DocumentSchema>;

export const MedicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required').trim(),
  dosage: z.string().optional(),
  quantity: z.number().nonnegative().optional(),
  reorderThreshold: z.number().nonnegative().optional(),
  expiryDate: z.string().optional(),
  dosageInstructions: z.string().optional(),
  notes: z.string().max(2000).optional(),
});
export type MedicineInput = z.infer<typeof MedicineSchema>;

export const SubscriptionSchema = z.object({
  name: z.string().min(1, 'Subscription name is required').trim(),
  price: z.number().nonnegative('Price must be greater than or equal to 0'),
  currency: z.string().min(1).default('USD'),
  billingFrequency: z.enum(['monthly', 'quarterly', 'yearly', 'weekly']),
  nextBillingDate: z.string(),
  paymentMethod: z.string().optional(),
  category: z.string().optional(),
  autoRenew: z.boolean().default(true),
  notes: z.string().max(2000).optional(),
});
export type SubscriptionInput = z.infer<typeof SubscriptionSchema>;

export const PurchaseSchema = z.object({
  productName: z.string().min(1, 'Product name is required').trim(),
  price: z.number().nonnegative('Price must be non-negative'),
  currency: z.string().min(1).default('USD'),
  purchaseDate: z.string(),
  store: z.string().optional(),
  warrantyExpiryDate: z.string().optional(),
  returnByDate: z.string().optional(),
  notes: z.string().max(2000).optional(),
  attachmentIds: z.array(z.string()).optional(),
});
export type PurchaseInput = z.infer<typeof PurchaseSchema>;

export const FamilyMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  relationship: z.string().min(1, 'Relationship is required').trim(),
  birthday: z.string().optional(),
  notes: z.string().max(2000).optional(),
});
export type FamilyMemberInput = z.infer<typeof FamilyMemberSchema>;

export const ParkingRecordSchema = z.object({
  locationName: z.string().min(1, 'Location is required').trim(),
  floor: z.string().optional(),
  section: z.string().optional(),
  slot: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  notes: z.string().max(1000).optional(),
  photoUrl: z.string().url().optional(),
});
export type ParkingRecordInput = z.infer<typeof ParkingRecordSchema>;

export const ReminderSchema = z.object({
  title: z.string().min(1, 'Reminder title is required').trim(),
  description: z.string().max(2000).optional(),
  dueDateTime: z.string(),
  recurrence: z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly']).default('none'),
  isCompleted: z.boolean().default(false),
  snoozedUntil: z.string().optional(),
  relatedCategory: z.nativeEnum(MemoryCategory).optional(),
  relatedId: z.string().optional(),
  familyMemberId: z.string().optional(),
  reminderPeriodsMinutes: z.array(z.number().int()).optional(),
});
export type ReminderInput = z.infer<typeof ReminderSchema>;
