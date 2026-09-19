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
exports.MaintenanceRecordModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MaintenanceRecordSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    assetId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    serviceDate: {
        type: Date,
        required: true,
    },
    nextDueDate: {
        type: Date,
        index: true,
    },
    cost: {
        type: Number,
        min: 0,
    },
    currency: {
        type: String,
        default: 'USD',
        trim: true,
    },
    isRecurring: {
        type: Boolean,
        default: false,
    },
    recurrenceIntervalMonths: {
        type: Number,
        min: 1,
    },
    isCompleted: {
        type: Boolean,
        default: false,
        index: true,
    },
    completedAt: {
        type: Date,
    },
    notes: {
        type: String,
        maxlength: 2000,
    },
    serviceProvider: {
        type: String,
        trim: true,
    },
    attachmentIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Attachment',
        },
    ],
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            ret.id = ret._id ? ret._id.toString() : undefined;
            ret.userId = ret.userId ? ret.userId.toString() : undefined;
            ret.assetId = ret.assetId ? ret.assetId.toString() : undefined;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
// Compound indexes for user-isolated queries and due-date aggregations
MaintenanceRecordSchema.index({ userId: 1, createdAt: -1 });
MaintenanceRecordSchema.index({ userId: 1, nextDueDate: 1 });
MaintenanceRecordSchema.index({ userId: 1, assetId: 1 });
exports.MaintenanceRecordModel = mongoose_1.default.model('MaintenanceRecord', MaintenanceRecordSchema);
