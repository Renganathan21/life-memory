import mongoose, { Document, Schema, Types } from 'mongoose';

export type BillingFrequency = 'monthly' | 'quarterly' | 'yearly' | 'weekly';

export interface ISubscriptionDocument extends Document {
  userId: Types.ObjectId;
  name: string;
  price: number;
  currency: string;
  billingFrequency: BillingFrequency;
  nextBillingDate: Date;
  paymentMethod?: string;
  category?: string;
  autoRenew: boolean;
  notes?: string;
  monthlyCost: number;
  yearlyCost: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscriptionDocument>(
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
    billingFrequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly', 'weekly'],
      required: true,
      default: 'monthly',
    },
    nextBillingDate: {
      type: Date,
      required: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'general',
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
    monthlyCost: {
      type: Number,
      required: true,
      default: 0,
    },
    yearlyCost: {
      type: Number,
      required: true,
      default: 0,
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

// Pre-save hook to compute monthlyCost and yearlyCost
SubscriptionSchema.pre('validate', function (next) {
  const price = this.price || 0;
  switch (this.billingFrequency) {
    case 'weekly':
      this.yearlyCost = Number((price * 52).toFixed(2));
      this.monthlyCost = Number(((price * 52) / 12).toFixed(2));
      break;
    case 'monthly':
      this.monthlyCost = Number(price.toFixed(2));
      this.yearlyCost = Number((price * 12).toFixed(2));
      break;
    case 'quarterly':
      this.monthlyCost = Number((price / 3).toFixed(2));
      this.yearlyCost = Number((price * 4).toFixed(2));
      break;
    case 'yearly':
      this.monthlyCost = Number((price / 12).toFixed(2));
      this.yearlyCost = Number(price.toFixed(2));
      break;
    default:
      this.monthlyCost = price;
      this.yearlyCost = price * 12;
  }
  next();
});

// Compound indexes for user-isolated queries and billing aggregations
SubscriptionSchema.index({ userId: 1, createdAt: -1 });
SubscriptionSchema.index({ userId: 1, nextBillingDate: 1 });
SubscriptionSchema.index({ userId: 1, autoRenew: 1 });

export const SubscriptionModel = mongoose.model<ISubscriptionDocument>(
  'Subscription',
  SubscriptionSchema
);
