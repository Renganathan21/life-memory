import { z } from 'zod';
import { MemoryCategory } from '../types/index.js';
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
}, {
    email: string;
    password: string;
    name: string;
}>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginInput = z.infer<typeof LoginSchema>;
export declare const RefreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export declare const UpdateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    avatarUrl?: string | undefined;
}, {
    name?: string | undefined;
    avatarUrl?: string | undefined;
}>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export declare const ChangePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export declare const AssetSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["vehicle", "home_appliance", "property", "equipment", "other"]>;
    brand: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    serialNumber: z.ZodOptional<z.ZodString>;
    purchaseDate: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodString>]>;
    notes: z.ZodOptional<z.ZodString>;
    attachmentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "vehicle" | "home_appliance" | "property" | "equipment" | "other";
    brand?: string | undefined;
    model?: string | undefined;
    serialNumber?: string | undefined;
    purchaseDate?: string | undefined;
    notes?: string | undefined;
    attachmentIds?: string[] | undefined;
}, {
    name: string;
    type: "vehicle" | "home_appliance" | "property" | "equipment" | "other";
    brand?: string | undefined;
    model?: string | undefined;
    serialNumber?: string | undefined;
    purchaseDate?: string | undefined;
    notes?: string | undefined;
    attachmentIds?: string[] | undefined;
}>;
export type AssetInput = z.infer<typeof AssetSchema>;
export declare const MaintenanceRecordSchema: z.ZodObject<{
    assetId: z.ZodString;
    title: z.ZodString;
    serviceDate: z.ZodString;
    nextDueDate: z.ZodOptional<z.ZodString>;
    cost: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    isRecurring: z.ZodDefault<z.ZodBoolean>;
    recurrenceIntervalMonths: z.ZodOptional<z.ZodNumber>;
    isCompleted: z.ZodDefault<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
    serviceProvider: z.ZodOptional<z.ZodString>;
    attachmentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    assetId: string;
    title: string;
    serviceDate: string;
    isRecurring: boolean;
    isCompleted: boolean;
    notes?: string | undefined;
    attachmentIds?: string[] | undefined;
    nextDueDate?: string | undefined;
    cost?: number | undefined;
    currency?: string | undefined;
    recurrenceIntervalMonths?: number | undefined;
    serviceProvider?: string | undefined;
}, {
    assetId: string;
    title: string;
    serviceDate: string;
    notes?: string | undefined;
    attachmentIds?: string[] | undefined;
    nextDueDate?: string | undefined;
    cost?: number | undefined;
    currency?: string | undefined;
    isRecurring?: boolean | undefined;
    recurrenceIntervalMonths?: number | undefined;
    isCompleted?: boolean | undefined;
    serviceProvider?: string | undefined;
}>;
export type MaintenanceRecordInput = z.infer<typeof MaintenanceRecordSchema>;
export declare const DocumentSchema: z.ZodObject<{
    name: z.ZodString;
    documentType: z.ZodEnum<["passport", "id_card", "driving_license", "insurance", "contract", "warranty", "other"]>;
    documentNumber: z.ZodOptional<z.ZodString>;
    issueDate: z.ZodOptional<z.ZodString>;
    expiryDate: z.ZodOptional<z.ZodString>;
    reminderDaysBefore: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    notes: z.ZodOptional<z.ZodString>;
    attachmentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    documentType: "other" | "passport" | "id_card" | "driving_license" | "insurance" | "contract" | "warranty";
    notes?: string | undefined;
    attachmentIds?: string[] | undefined;
    documentNumber?: string | undefined;
    issueDate?: string | undefined;
    expiryDate?: string | undefined;
    reminderDaysBefore?: number[] | undefined;
}, {
    name: string;
    documentType: "other" | "passport" | "id_card" | "driving_license" | "insurance" | "contract" | "warranty";
    notes?: string | undefined;
    attachmentIds?: string[] | undefined;
    documentNumber?: string | undefined;
    issueDate?: string | undefined;
    expiryDate?: string | undefined;
    reminderDaysBefore?: number[] | undefined;
}>;
export type DocumentInput = z.infer<typeof DocumentSchema>;
export declare const MedicineSchema: z.ZodObject<{
    name: z.ZodString;
    dosage: z.ZodOptional<z.ZodString>;
    quantity: z.ZodOptional<z.ZodNumber>;
    reorderThreshold: z.ZodOptional<z.ZodNumber>;
    expiryDate: z.ZodOptional<z.ZodString>;
    dosageInstructions: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    notes?: string | undefined;
    expiryDate?: string | undefined;
    dosage?: string | undefined;
    quantity?: number | undefined;
    reorderThreshold?: number | undefined;
    dosageInstructions?: string | undefined;
}, {
    name: string;
    notes?: string | undefined;
    expiryDate?: string | undefined;
    dosage?: string | undefined;
    quantity?: number | undefined;
    reorderThreshold?: number | undefined;
    dosageInstructions?: string | undefined;
}>;
export type MedicineInput = z.infer<typeof MedicineSchema>;
export declare const SubscriptionSchema: z.ZodObject<{
    name: z.ZodString;
    price: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    billingFrequency: z.ZodEnum<["monthly", "quarterly", "yearly", "weekly"]>;
    nextBillingDate: z.ZodString;
    paymentMethod: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    autoRenew: z.ZodDefault<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    currency: string;
    price: number;
    billingFrequency: "monthly" | "quarterly" | "yearly" | "weekly";
    nextBillingDate: string;
    autoRenew: boolean;
    notes?: string | undefined;
    paymentMethod?: string | undefined;
    category?: string | undefined;
}, {
    name: string;
    price: number;
    billingFrequency: "monthly" | "quarterly" | "yearly" | "weekly";
    nextBillingDate: string;
    notes?: string | undefined;
    currency?: string | undefined;
    paymentMethod?: string | undefined;
    category?: string | undefined;
    autoRenew?: boolean | undefined;
}>;
export type SubscriptionInput = z.infer<typeof SubscriptionSchema>;
export declare const PurchaseSchema: z.ZodObject<{
    productName: z.ZodString;
    price: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    purchaseDate: z.ZodString;
    store: z.ZodOptional<z.ZodString>;
    warrantyExpiryDate: z.ZodOptional<z.ZodString>;
    returnByDate: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    attachmentIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    purchaseDate: string;
    currency: string;
    price: number;
    productName: string;
    notes?: string | undefined;
    attachmentIds?: string[] | undefined;
    store?: string | undefined;
    warrantyExpiryDate?: string | undefined;
    returnByDate?: string | undefined;
}, {
    purchaseDate: string;
    price: number;
    productName: string;
    notes?: string | undefined;
    attachmentIds?: string[] | undefined;
    currency?: string | undefined;
    store?: string | undefined;
    warrantyExpiryDate?: string | undefined;
    returnByDate?: string | undefined;
}>;
export type PurchaseInput = z.infer<typeof PurchaseSchema>;
export declare const FamilyMemberSchema: z.ZodObject<{
    name: z.ZodString;
    relationship: z.ZodString;
    birthday: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    relationship: string;
    notes?: string | undefined;
    birthday?: string | undefined;
}, {
    name: string;
    relationship: string;
    notes?: string | undefined;
    birthday?: string | undefined;
}>;
export type FamilyMemberInput = z.infer<typeof FamilyMemberSchema>;
export declare const ParkingRecordSchema: z.ZodObject<{
    locationName: z.ZodString;
    floor: z.ZodOptional<z.ZodString>;
    section: z.ZodOptional<z.ZodString>;
    slot: z.ZodOptional<z.ZodString>;
    latitude: z.ZodOptional<z.ZodNumber>;
    longitude: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    photoUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    locationName: string;
    notes?: string | undefined;
    floor?: string | undefined;
    section?: string | undefined;
    slot?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    photoUrl?: string | undefined;
}, {
    locationName: string;
    notes?: string | undefined;
    floor?: string | undefined;
    section?: string | undefined;
    slot?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    photoUrl?: string | undefined;
}>;
export type ParkingRecordInput = z.infer<typeof ParkingRecordSchema>;
export declare const ReminderSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    dueDateTime: z.ZodString;
    recurrence: z.ZodDefault<z.ZodEnum<["none", "daily", "weekly", "monthly", "yearly"]>>;
    isCompleted: z.ZodDefault<z.ZodBoolean>;
    snoozedUntil: z.ZodOptional<z.ZodString>;
    relatedCategory: z.ZodOptional<z.ZodNativeEnum<typeof MemoryCategory>>;
    relatedId: z.ZodOptional<z.ZodString>;
    familyMemberId: z.ZodOptional<z.ZodString>;
    reminderPeriodsMinutes: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    isCompleted: boolean;
    dueDateTime: string;
    recurrence: "monthly" | "yearly" | "weekly" | "none" | "daily";
    description?: string | undefined;
    snoozedUntil?: string | undefined;
    relatedCategory?: MemoryCategory | undefined;
    relatedId?: string | undefined;
    familyMemberId?: string | undefined;
    reminderPeriodsMinutes?: number[] | undefined;
}, {
    title: string;
    dueDateTime: string;
    isCompleted?: boolean | undefined;
    description?: string | undefined;
    recurrence?: "monthly" | "yearly" | "weekly" | "none" | "daily" | undefined;
    snoozedUntil?: string | undefined;
    relatedCategory?: MemoryCategory | undefined;
    relatedId?: string | undefined;
    familyMemberId?: string | undefined;
    reminderPeriodsMinutes?: number[] | undefined;
}>;
export type ReminderInput = z.infer<typeof ReminderSchema>;
//# sourceMappingURL=index.d.ts.map