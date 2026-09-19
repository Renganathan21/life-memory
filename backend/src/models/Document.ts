import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDocumentItemDocument extends Document {
  userId: Types.ObjectId;
  name: string;
  documentType: 'passport' | 'id_card' | 'driving_license' | 'insurance' | 'contract' | 'warranty' | 'other';
  documentNumber?: string;
  issueDate?: Date;
  expiryDate?: Date;
  reminderDaysBefore: number[];
  notes?: string;
  attachmentIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const DocumentItemSchema = new Schema<IDocumentItemDocument>(
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
    documentType: {
      type: String,
      enum: ['passport', 'id_card', 'driving_license', 'insurance', 'contract', 'warranty', 'other'],
      required: true,
      default: 'other',
    },
    documentNumber: {
      type: String,
      trim: true,
    },
    issueDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
      index: true,
    },
    reminderDaysBefore: {
      type: [Number],
      default: [30, 7, 1],
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

// Compound indexes for user-isolated queries and expiry alerts
DocumentItemSchema.index({ userId: 1, createdAt: -1 });
DocumentItemSchema.index({ userId: 1, expiryDate: 1 });
DocumentItemSchema.index({ userId: 1, documentType: 1 });

export const DocumentModel = mongoose.model<IDocumentItemDocument>('Document', DocumentItemSchema);
