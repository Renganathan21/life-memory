import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';
import {
  UserModel,
  AssetModel,
  MaintenanceRecordModel,
  DocumentModel,
  MedicineModel,
  SubscriptionModel,
  PurchaseModel,
  FamilyMemberModel,
  ParkingRecordModel,
  ReminderModel,
  AttachmentModel,
  NotificationPreferenceModel,
} from '../src/models/index.js';

describe('Phase 3: Core Data Architecture & User Isolation', () => {
  let mongoServer: MongoMemoryServer;
  const userAId = new Types.ObjectId();
  const userBId = new Types.ObjectId();

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('Creates and isolates Asset records between users', async () => {
    await AssetModel.create({
      userId: userAId,
      name: 'Honda Civic',
      type: 'vehicle',
      brand: 'Honda',
      model: 'Civic LX',
      purchaseDate: new Date('2022-05-10'),
    });

    await AssetModel.create({
      userId: userBId,
      name: 'LG Washing Machine',
      type: 'home_appliance',
      brand: 'LG',
    });

    const userAAssets = await AssetModel.find({ userId: userAId });
    const userBAssets = await AssetModel.find({ userId: userBId });

    expect(userAAssets).toHaveLength(1);
    expect(userAAssets[0].name).toBe('Honda Civic');
    expect(userBAssets).toHaveLength(1);
    expect(userBAssets[0].name).toBe('LG Washing Machine');
  });

  it('Creates MaintenanceRecord linked to Asset with proper indexes', async () => {
    const asset = await AssetModel.create({
      userId: userAId,
      name: 'Toyota RAV4',
      type: 'vehicle',
    });

    const maintenance = await MaintenanceRecordModel.create({
      userId: userAId,
      assetId: asset._id,
      title: 'Oil & Filter Change',
      serviceDate: new Date('2026-09-01'),
      nextDueDate: new Date('2027-03-01'),
      cost: 75.5,
      currency: 'USD',
      isRecurring: true,
      recurrenceIntervalMonths: 6,
    });

    expect(maintenance.id).toBeDefined();
    expect(maintenance.assetId.toString()).toBe(asset._id.toString());
    expect(maintenance.cost).toBe(75.5);
  });

  it('Creates Document with expiry date and reminder intervals', async () => {
    const doc = await DocumentModel.create({
      userId: userAId,
      name: 'Passport',
      documentType: 'passport',
      documentNumber: 'A12345678',
      expiryDate: new Date('2030-10-15'),
      reminderDaysBefore: [90, 30, 7],
    });

    expect(doc.id).toBeDefined();
    expect(doc.reminderDaysBefore).toContain(90);
    expect(doc.documentType).toBe('passport');
  });

  it('Creates Medicine record with stock and reorder thresholds', async () => {
    const med = await MedicineModel.create({
      userId: userAId,
      name: 'Atorvastatin',
      dosage: '20mg',
      quantity: 4,
      reorderThreshold: 7,
      expiryDate: new Date('2027-01-01'),
    });

    expect(med.id).toBeDefined();
    expect(med.quantity).toBeLessThan(med.reorderThreshold);
  });

  it('Creates Subscription and automatically calculates normalized monthly and yearly cost', async () => {
    // 1. Monthly subscription
    const netflix = await SubscriptionModel.create({
      userId: userAId,
      name: 'Netflix 4K',
      price: 22.99,
      billingFrequency: 'monthly',
      nextBillingDate: new Date('2026-10-01'),
    });
    expect(netflix.monthlyCost).toBe(22.99);
    expect(netflix.yearlyCost).toBe(275.88);

    // 2. Yearly subscription
    const prime = await SubscriptionModel.create({
      userId: userAId,
      name: 'Amazon Prime',
      price: 139.0,
      billingFrequency: 'yearly',
      nextBillingDate: new Date('2027-06-15'),
    });
    expect(prime.yearlyCost).toBe(139.0);
    expect(prime.monthlyCost).toBe(11.58);

    // 3. Weekly subscription
    const gym = await SubscriptionModel.create({
      userId: userAId,
      name: 'Gym Pass',
      price: 10.0,
      billingFrequency: 'weekly',
      nextBillingDate: new Date('2026-09-25'),
    });
    expect(gym.yearlyCost).toBe(520.0);
    expect(gym.monthlyCost).toBe(43.33);
  });

  it('Creates Purchase with return and warranty deadlines', async () => {
    const purchase = await PurchaseModel.create({
      userId: userAId,
      productName: 'Sony WH-1000XM5 Headphones',
      price: 348.0,
      purchaseDate: new Date('2026-09-15'),
      returnByDate: new Date('2026-10-15'),
      warrantyExpiryDate: new Date('2028-09-15'),
      store: 'Best Buy',
    });

    expect(purchase.id).toBeDefined();
    expect(purchase.returnByDate).toBeDefined();
    expect(purchase.warrantyExpiryDate).toBeDefined();
  });

  it('Creates FamilyMember with birthday tracking', async () => {
    const member = await FamilyMemberModel.create({
      userId: userAId,
      name: 'Emma Johnson',
      relationship: 'Daughter',
      birthday: new Date('2018-04-12'),
    });

    expect(member.id).toBeDefined();
    expect(member.relationship).toBe('Daughter');
  });

  it('Creates and manages ParkingRecord with active status and GPS pins', async () => {
    const spot = await ParkingRecordModel.create({
      userId: userAId,
      locationName: 'Downtown Mall P3',
      floor: 'P3',
      section: 'Blue',
      slot: '342',
      latitude: 37.7749,
      longitude: -122.4194,
      isActive: true,
    });

    expect(spot.id).toBeDefined();
    expect(spot.isActive).toBe(true);

    // User can find active spot
    const active = await ParkingRecordModel.findOne({ userId: userAId, isActive: true });
    expect(active?.slot).toBe('342');
  });

  it('Creates Reminder with recurrence, snooze, and completion status', async () => {
    const reminder = await ReminderModel.create({
      userId: userAId,
      title: 'Submit Tax Returns',
      dueDateTime: new Date('2026-10-15T17:00:00Z'),
      recurrence: 'yearly',
      isCompleted: false,
    });

    expect(reminder.id).toBeDefined();
    expect(reminder.isCompleted).toBe(false);
    expect(reminder.recurrence).toBe('yearly');

    // Toggle complete
    reminder.isCompleted = true;
    reminder.completedAt = new Date();
    await reminder.save();

    const updated = await ReminderModel.findById(reminder._id);
    expect(updated?.isCompleted).toBe(true);
    expect(updated?.completedAt).toBeDefined();
  });

  it('Creates Attachment metadata and NotificationPreference records', async () => {
    const attachment = await AttachmentModel.create({
      userId: userAId,
      storageKey: 'users/123/receipt_sept2026.pdf',
      fileName: 'receipt_sept2026.pdf',
      mimeType: 'application/pdf',
      size: 204850,
    });

    expect(attachment.id).toBeDefined();
    expect(attachment.storageKey).toBe('users/123/receipt_sept2026.pdf');

    const notifPref = await NotificationPreferenceModel.create({
      userId: userAId,
      pushToken: 'ExponentPushToken[xxxxxxxxxxxxxx]',
      enabled: true,
      quietHoursEnabled: true,
      quietHoursStart: '23:00',
      quietHoursEnd: '07:00',
    });

    expect(notifPref.id).toBeDefined();
    expect(notifPref.quietHoursStart).toBe('23:00');
  });
});
