"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderSchema = exports.ParkingRecordSchema = exports.FamilyMemberSchema = exports.PurchaseSchema = exports.SubscriptionSchema = exports.MedicineSchema = exports.DocumentSchema = exports.MaintenanceRecordSchema = exports.AssetSchema = exports.ChangePasswordSchema = exports.UpdateProfileSchema = exports.RefreshTokenSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
const index_js_1 = require("../types/index.js");
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address').trim().toLowerCase(),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long').max(100),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address').trim().toLowerCase(),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.RefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
});
exports.UpdateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100).trim().optional(),
    avatarUrl: zod_1.z.string().url('Invalid avatar URL').optional().or(zod_1.z.literal('')),
});
exports.ChangePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: zod_1.z.string().min(8, 'New password must be at least 8 characters long').max(100),
});
exports.AssetSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').trim(),
    type: zod_1.z.enum(['vehicle', 'home_appliance', 'property', 'equipment', 'other']),
    brand: zod_1.z.string().optional(),
    model: zod_1.z.string().optional(),
    serialNumber: zod_1.z.string().optional(),
    purchaseDate: zod_1.z.string().datetime().optional().or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
    notes: zod_1.z.string().max(2000).optional(),
    attachmentIds: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.MaintenanceRecordSchema = zod_1.z.object({
    assetId: zod_1.z.string().min(1, 'Asset ID is required'),
    title: zod_1.z.string().min(1, 'Title is required').trim(),
    serviceDate: zod_1.z.string(),
    nextDueDate: zod_1.z.string().optional(),
    cost: zod_1.z.number().nonnegative().optional(),
    currency: zod_1.z.string().length(3).default('USD').optional(),
    isRecurring: zod_1.z.boolean().default(false),
    recurrenceIntervalMonths: zod_1.z.number().int().positive().optional(),
    isCompleted: zod_1.z.boolean().default(false),
    notes: zod_1.z.string().max(2000).optional(),
    serviceProvider: zod_1.z.string().optional(),
    attachmentIds: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.DocumentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Document name is required').trim(),
    documentType: zod_1.z.enum(['passport', 'id_card', 'driving_license', 'insurance', 'contract', 'warranty', 'other']),
    documentNumber: zod_1.z.string().optional(),
    issueDate: zod_1.z.string().optional(),
    expiryDate: zod_1.z.string().optional(),
    reminderDaysBefore: zod_1.z.array(zod_1.z.number().int().positive()).optional(),
    notes: zod_1.z.string().max(2000).optional(),
    attachmentIds: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.MedicineSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Medicine name is required').trim(),
    dosage: zod_1.z.string().optional(),
    quantity: zod_1.z.number().nonnegative().optional(),
    reorderThreshold: zod_1.z.number().nonnegative().optional(),
    expiryDate: zod_1.z.string().optional(),
    dosageInstructions: zod_1.z.string().optional(),
    notes: zod_1.z.string().max(2000).optional(),
});
exports.SubscriptionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Subscription name is required').trim(),
    price: zod_1.z.number().nonnegative('Price must be greater than or equal to 0'),
    currency: zod_1.z.string().min(1).default('USD'),
    billingFrequency: zod_1.z.enum(['monthly', 'quarterly', 'yearly', 'weekly']),
    nextBillingDate: zod_1.z.string(),
    paymentMethod: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    autoRenew: zod_1.z.boolean().default(true),
    notes: zod_1.z.string().max(2000).optional(),
});
exports.PurchaseSchema = zod_1.z.object({
    productName: zod_1.z.string().min(1, 'Product name is required').trim(),
    price: zod_1.z.number().nonnegative('Price must be non-negative'),
    currency: zod_1.z.string().min(1).default('USD'),
    purchaseDate: zod_1.z.string(),
    store: zod_1.z.string().optional(),
    warrantyExpiryDate: zod_1.z.string().optional(),
    returnByDate: zod_1.z.string().optional(),
    notes: zod_1.z.string().max(2000).optional(),
    attachmentIds: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.FamilyMemberSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').trim(),
    relationship: zod_1.z.string().min(1, 'Relationship is required').trim(),
    birthday: zod_1.z.string().optional(),
    notes: zod_1.z.string().max(2000).optional(),
});
exports.ParkingRecordSchema = zod_1.z.object({
    locationName: zod_1.z.string().min(1, 'Location is required').trim(),
    floor: zod_1.z.string().optional(),
    section: zod_1.z.string().optional(),
    slot: zod_1.z.string().optional(),
    latitude: zod_1.z.number().optional(),
    longitude: zod_1.z.number().optional(),
    notes: zod_1.z.string().max(1000).optional(),
    photoUrl: zod_1.z.string().url().optional(),
});
exports.ReminderSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Reminder title is required').trim(),
    description: zod_1.z.string().max(2000).optional(),
    dueDateTime: zod_1.z.string(),
    recurrence: zod_1.z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly']).default('none'),
    isCompleted: zod_1.z.boolean().default(false),
    snoozedUntil: zod_1.z.string().optional(),
    relatedCategory: zod_1.z.nativeEnum(index_js_1.MemoryCategory).optional(),
    relatedId: zod_1.z.string().optional(),
    familyMemberId: zod_1.z.string().optional(),
    reminderPeriodsMinutes: zod_1.z.array(zod_1.z.number().int()).optional(),
});
//# sourceMappingURL=index.js.map