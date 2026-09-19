import mongoose, { Document, Schema } from 'mongoose';

export interface IUserDocument extends Document {
  email: string;
  passwordHash: string;
  name: string;
  avatarUrl?: string;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // Do not return passwordHash in standard queries
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
    },
    refreshTokenHash: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id ? ret._id.toString() : undefined;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.refreshTokenHash;
        return ret;
      },
    },
  }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
