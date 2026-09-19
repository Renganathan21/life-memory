import mongoose, { Schema, Types } from 'mongoose';

export interface IAsset {
  userId: Types.ObjectId;
  name: string;
  type: 'vehicle' | 'home_appliance' | 'property' | 'equipment' | 'other';
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  notes?: string;
  attachmentIds: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const AssetSchema = new Schema<IAsset>(
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
    type: {
      type: String,
      enum: ['vehicle', 'home_appliance', 'property', 'equipment', 'other'],
      required: true,
      default: 'other',
    },
    brand: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    serialNumber: {
      type: String,
      trim: true,
    },
    purchaseDate: {
      type: Date,
    },
    notes: {
      type: String,
      maxlength: 2000,
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
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for user-isolated queries
AssetSchema.index({ userId: 1, createdAt: -1 });
AssetSchema.index({ userId: 1, type: 1 });

export const AssetModel = mongoose.model<IAsset>('Asset', AssetSchema);
