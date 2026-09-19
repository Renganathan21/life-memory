import mongoose, { Document, Schema, Types } from 'mongoose';
import { MemoryCategory, RecurrenceType } from '@life-memory/shared';

export interface IReminderDocument extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  dueDateTime: Date;
  recurrence: RecurrenceType;
  isCompleted: boolean;
  completedAt?: Date;
  snoozedUntil?: Date;
  relatedCategory?: MemoryCategory;
  relatedId?: Types.ObjectId;
  familyMemberId?: Types.ObjectId;
  reminderPeriodsMinutes: number[];
  createdAt: Date;
  updatedAt: Date;
}

const ReminderSchema = new Schema<IReminderDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    dueDateTime: {
      type: Date,
      required: true,
      index: true,
    },
    recurrence: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'none',
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    completedAt: {
      type: Date,
    },
    snoozedUntil: {
      type: Date,
    },
    relatedCategory: {
      type: String,
      enum: Object.values(MemoryCategory),
    },
    relatedId: {
      type: Schema.Types.ObjectId,
    },
    familyMemberId: {
      type: Schema.Types.ObjectId,
      ref: 'FamilyMember',
    },
    reminderPeriodsMinutes: {
      type: [Number],
      default: [0, 60, 1440], // At time, 1h before, 1d before
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id ? ret._id.toString() : undefined;
        ret.userId = ret.userId ? ret.userId.toString() : undefined;
        ret.relatedId = ret.relatedId ? ret.relatedId.toString() : undefined;
        ret.familyMemberId = ret.familyMemberId ? ret.familyMemberId.toString() : undefined;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for user-isolated queries, pending reminders, and calendar lookups
ReminderSchema.index({ userId: 1, createdAt: -1 });
ReminderSchema.index({ userId: 1, dueDateTime: 1, isCompleted: 1 });
ReminderSchema.index({ userId: 1, familyMemberId: 1 });

export const ReminderModel = mongoose.model<IReminderDocument>('Reminder', ReminderSchema);
