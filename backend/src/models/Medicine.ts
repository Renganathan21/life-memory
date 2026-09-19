import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMedicineDocument extends Document {
  userId: Types.ObjectId;
  name: string;
  dosage?: string;
  quantity?: number;
  reorderThreshold?: number;
  expiryDate?: Date;
  dosageInstructions?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema = new Schema<IMedicineDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      min: 0,
      default: 0,
    },
    reorderThreshold: {
      type: Number,
      min: 0,
      default: 5,
    },
    expiryDate: {
      type: Date,
      index: true,
    },
    dosageInstructions: {
      type: String,
      maxlength: 1000,
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id ? ret._id.toString() : undefined;
        ret.userId = ret.userId ? ret.userId.toString() : undefined;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for user-isolated queries and stock/expiry tracking
MedicineSchema.index({ userId: 1, createdAt: -1 });
MedicineSchema.index({ userId: 1, expiryDate: 1 });
MedicineSchema.index({ userId: 1, quantity: 1, reorderThreshold: 1 });

export const MedicineModel = mongoose.model<IMedicineDocument>('Medicine', MedicineSchema);
