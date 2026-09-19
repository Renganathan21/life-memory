import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPurchaseDocument extends Document {
  userId: Types.ObjectId;
  productName: string;
  price: number;
  currency: string;
  purchaseDate: Date;
  store?: string;
  warrantyExpiryDate?: Date;
  returnByDate?: Date;
  notes?: string;
  attachmentIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema = new Schema<IPurchaseDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    store: {
      type: String,
      trim: true,
    },
    warrantyExpiryDate: {
      type: Date,
      index: true,
    },
    returnByDate: {
      type: Date,
      index: true,
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

// Compound indexes for user-isolated queries, return deadlines, and warranty lookups
PurchaseSchema.index({ userId: 1, createdAt: -1 });
PurchaseSchema.index({ userId: 1, returnByDate: 1 });
PurchaseSchema.index({ userId: 1, warrantyExpiryDate: 1 });

export const PurchaseModel = mongoose.model<IPurchaseDocument>('Purchase', PurchaseSchema);
