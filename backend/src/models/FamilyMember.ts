import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IFamilyMemberDocument extends Document {
  userId: Types.ObjectId;
  name: string;
  relationship: string;
  birthday?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FamilyMemberSchema = new Schema<IFamilyMemberDocument>(
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
    relationship: {
      type: String,
      required: true,
      trim: true,
    },
    birthday: {
      type: Date,
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

// Compound indexes for user-isolated queries
FamilyMemberSchema.index({ userId: 1, createdAt: -1 });
FamilyMemberSchema.index({ userId: 1, name: 1 });

export const FamilyMemberModel = mongoose.model<IFamilyMemberDocument>(
  'FamilyMember',
  FamilyMemberSchema
);
