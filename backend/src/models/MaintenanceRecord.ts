import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMaintenanceRecordDocument extends Document {
  userId: Types.ObjectId;
  assetId: Types.ObjectId;
  title: string;
  serviceDate: Date;
  nextDueDate?: Date;
  cost?: number;
  currency: string;
  isRecurring: boolean;
  recurrenceIntervalMonths?: number;
  isCompleted: boolean;
  completedAt?: Date;
  notes?: string;
  serviceProvider?: string;
  attachmentIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MaintenanceRecordSchema = new Schema<IMaintenanceRecordDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assetId: {
      type: Schema.Types.ObjectId,
      ref: 'Asset',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    serviceDate: {
      type: Date,
      required: true,
    },
    nextDueDate: {
      type: Date,
      index: true,
    },
    cost: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrenceIntervalMonths: {
      type: Number,
      min: 1,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    completedAt: {
      type: Date,
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
    serviceProvider: {
      type: String,
      trim: true,
    },
    attachmentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Attachment',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id ? ret._id.toString() : undefined;
        ret.userId = ret.userId ? ret.userId.toString() : undefined;
        ret.assetId = ret.assetId ? ret.assetId.toString() : undefined;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for user-isolated queries and due-date aggregations
MaintenanceRecordSchema.index({ userId: 1, createdAt: -1 });
MaintenanceRecordSchema.index({ userId: 1, nextDueDate: 1 });
MaintenanceRecordSchema.index({ userId: 1, assetId: 1 });

export const MaintenanceRecordModel = mongoose.model<IMaintenanceRecordDocument>(
  'MaintenanceRecord',
  MaintenanceRecordSchema
);
