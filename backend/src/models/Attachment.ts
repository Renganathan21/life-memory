import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAttachmentDocument extends Document {
  userId: Types.ObjectId;
  storageKey: string;
  fileName: string;
  mimeType: string;
  size: number;
  publicUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttachmentSchema = new Schema<IAttachmentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    storageKey: {
      type: String,
      required: true,
      unique: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    publicUrl: {
      type: String,
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

// Compound indexes for user-isolated queries
AttachmentSchema.index({ userId: 1, createdAt: -1 });
AttachmentSchema.index({ userId: 1, storageKey: 1 });

export const AttachmentModel = mongoose.model<IAttachmentDocument>(
  'Attachment',
  AttachmentSchema
);
