import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INotificationPreferenceDocument extends Document {
  userId: Types.ObjectId;
  pushToken?: string;
  enabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // e.g. "22:00"
  quietHoursEnd?: string; // e.g. "08:00"
  defaultReminderLeadTimes: number[]; // in minutes, e.g. [1440, 10080] (1 day, 7 days)
  createdAt: Date;
  updatedAt: Date;
}

const NotificationPreferenceSchema = new Schema<INotificationPreferenceDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    pushToken: {
      type: String,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    quietHoursEnabled: {
      type: Boolean,
      default: false,
    },
    quietHoursStart: {
      type: String,
      default: '22:00',
    },
    quietHoursEnd: {
      type: String,
      default: '08:00',
    },
    defaultReminderLeadTimes: {
      type: [Number],
      default: [1440, 4320, 10080], // 1 day, 3 days, 7 days
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

export const NotificationPreferenceModel = mongoose.model<INotificationPreferenceDocument>(
  'NotificationPreference',
  NotificationPreferenceSchema
);
