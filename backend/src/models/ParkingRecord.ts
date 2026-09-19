import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IParkingRecordDocument extends Document {
  userId: Types.ObjectId;
  locationName: string;
  floor?: string;
  section?: string;
  slot?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  photoUrl?: string;
  parkedAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ParkingRecordSchema = new Schema<IParkingRecordDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    locationName: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: String,
      trim: true,
    },
    section: {
      type: String,
      trim: true,
    },
    slot: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    photoUrl: {
      type: String,
    },
    parkedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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

// Compound indexes for user-isolated queries and active parking spot lookup
ParkingRecordSchema.index({ userId: 1, createdAt: -1 });
ParkingRecordSchema.index({ userId: 1, isActive: 1 });

export const ParkingRecordModel = mongoose.model<IParkingRecordDocument>(
  'ParkingRecord',
  ParkingRecordSchema
);
