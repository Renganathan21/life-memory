"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATEGORY_METADATA = exports.MemoryCategory = void 0;
var MemoryCategory;
(function (MemoryCategory) {
    MemoryCategory["HOME_VEHICLE"] = "home_vehicle";
    MemoryCategory["DOCUMENT"] = "document";
    MemoryCategory["MEDICINE"] = "medicine";
    MemoryCategory["SUBSCRIPTION"] = "subscription";
    MemoryCategory["PURCHASE"] = "purchase";
    MemoryCategory["FAMILY"] = "family";
    MemoryCategory["PARKING"] = "parking";
    MemoryCategory["REMINDER"] = "reminder";
})(MemoryCategory || (exports.MemoryCategory = MemoryCategory = {}));
exports.CATEGORY_METADATA = {
    [MemoryCategory.HOME_VEHICLE]: {
        label: 'Home / Vehicle',
        icon: 'wrench',
        description: 'Maintenance, service intervals, appliances, and vehicles',
        color: '#0284c7', // Sky 600
    },
    [MemoryCategory.DOCUMENT]: {
        label: 'Document',
        icon: 'file-text',
        description: 'IDs, passports, policies, contracts, and renewals',
        color: '#8b5cf6', // Violet 500
    },
    [MemoryCategory.MEDICINE]: {
        label: 'Medicine',
        icon: 'pill',
        description: 'Refills, stock levels, dosages, and expiration dates',
        color: '#10b981', // Emerald 500
    },
    [MemoryCategory.SUBSCRIPTION]: {
        label: 'Subscription',
        icon: 'credit-card',
        description: 'Recurring services, billing dates, and cost tracking',
        color: '#f59e0b', // Amber 500
    },
    [MemoryCategory.PURCHASE]: {
        label: 'Purchase',
        icon: 'shopping-bag',
        description: 'Warranties, price paid, stores, and return windows',
        color: '#ec4899', // Pink 500
    },
    [MemoryCategory.FAMILY]: {
        label: 'Family',
        icon: 'users',
        description: 'Loved ones, key dates, duties, and shared responsibilities',
        color: '#3b82f6', // Blue 500
    },
    [MemoryCategory.PARKING]: {
        label: 'Parking',
        icon: 'map-pin',
        description: 'Saved spot, floor, section, pillar note, and GPS pin',
        color: '#6366f1', // Indigo 500
    },
    [MemoryCategory.REMINDER]: {
        label: 'Reminder',
        icon: 'bell',
        description: 'One-off or recurring personal to-dos and follow-ups',
        color: '#14b8a6', // Teal 500
    },
};
//# sourceMappingURL=index.js.map