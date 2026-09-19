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
exports.SubscriptionModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SubscriptionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.SubscriptionModel = mongoose_1.default.model('Subscription', SubscriptionSchema);
