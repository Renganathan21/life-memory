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
exports.NotificationPreferenceModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const NotificationPreferenceSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            ret.id = ret._id ? ret._id.toString() : undefined;
            ret.userId = ret.userId ? ret.userId.toString() : undefined;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
exports.NotificationPreferenceModel = mongoose_1.default.model('NotificationPreference', NotificationPreferenceSchema);
