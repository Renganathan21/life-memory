"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const shared_1 = require("@life-memory/shared");
const ReminderSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        maxlength: 2000,
    },
    dueDateTime: {
        type: Date,
        required: true,
        index: true,
    },
    recurrence: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
        default: 'none',
    },
    isCompleted: {
        type: Boolean,
        default: false,
        index: true,
    },
    completedAt: {
        type: Date,
    },
    snoozedUntil: {
        type: Date,
    },
    relatedCategory: {
        type: String,
        enum: Object.values(shared_1.MemoryCategory),
    },
    relatedId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    familyMemberId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'FamilyMember',
    },
    reminderPeriodsMinutes: {
        type: [Number],
        default: [0, 60, 1440], // At time, 1h before, 1d before
    },
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            ret.id = ret._id ? ret._id.toString() : undefined;
            ret.userId = ret.userId ? ret.userId.toString() : undefined;
            ret.relatedId = ret.relatedId ? ret.relatedId.toString() : undefined;
            ret.familyMemberId = ret.familyMemberId ? ret.familyMemberId.toString() : undefined;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
// Compound indexes for user-isolated queries, pending reminders, and calendar lookups
ReminderSchema.index({ userId: 1, createdAt: -1 });
ReminderSchema.index({ userId: 1, dueDateTime: 1, isCompleted: 1 });
ReminderSchema.index({ userId: 1, familyMemberId: 1 });
exports.ReminderModel = mongoose_1.default.model('Reminder', ReminderSchema);
