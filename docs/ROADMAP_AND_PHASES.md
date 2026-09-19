# Life Memory — Comprehensive Multi-Phase Master Implementation Plan & Tracking

> **Product Vision**: "Everything you don't want to forget."  
> Unified Personal Memory and Reminder System answering *"What do I need to take care of?"* with the primary action **`+ Remember Something`**.

---

## 📊 Master Phase Tracker

| Phase | Title | Scope | Status |
| :--- | :--- | :--- | :---: |
| **Phase 1** | **Project Foundation** | Monorepo structure, Expo Router tabs, Fastify scaffold, Shared types, Tooling | ✅ **COMPLETED** |
| **Phase 2** | **Authentication & Security** | Argon2 hashing, JWT rotation, User isolation, SecureStore, Login/Register UI | ✅ **COMPLETED** |
| **Phase 3** | **Core Data Architecture** | 11 Mongoose collections with compound indexes, Base CRUD services, Zod DTOs | ✅ **COMPLETED** |
| **Phase 4** | **Dashboard & Universal Add Flow** | "Needs Attention" & "Upcoming" engine, Category action sheet & forms | ⏳ **UP NEXT** |
| **Phase 5** | **Documents & Reminders** | Expiry tracking, R2 attachment metadata, Recurrence & Snooze engine | 📝 PLANNED |
| **Phase 6** | **Maintenance & Subscriptions** | Asset logs, Recurring service intervals, Billing cycles & Cost analytics | 📝 PLANNED |
| **Phase 7** | **Purchases & Calendar View** | Warranties, Price history, Multi-source unified timeline/agenda | 📝 PLANNED |
| **Phase 8** | **Medicine, Family & Parking** | Refill thresholds, Family responsibilities, GPS pin & floor/slot memory | 📝 PLANNED |
| **Phase 9** | **Notifications & Offline Caching** | Android local notification scheduler, Expo SQLite / TanStack cache | 📝 PLANNED |
| **Phase 10** | **Testing, Security & EAS Build** | End-to-end audit, Android APK/AAB production build validation | 📝 PLANNED |

---

## 🛠️ Technology Stack Reference

* **Mobile**: React Native, Expo SDK 52+, TypeScript, Expo Router (File-based), NativeWind (Tailwind CSS v3/v4), Zustand, TanStack Query v5, Expo SecureStore, Expo SQLite, Expo Notifications, Expo Camera, Expo Image Picker, Expo Location.
* **Backend**: Node.js v20+, TypeScript, Fastify v5, Mongoose v8 (MongoDB Atlas), Zod v3, JWT (`@fastify/jwt`), Argon2 (`argon2id`), `@fastify/rate-limit`, `@fastify/helmet`, `@fastify/cors`.
* **Database**: MongoDB Atlas (12 isolated collections, strictly user-partitioned via JWT `userId`).
* **Storage**: Cloudflare R2 (S3-compatible, private presigned uploads/downloads, metadata in MongoDB).

---

# Detailed Phase Breakdown & Execution Guide

---

### ✅ Phase 1: Project Foundation (Completed)
- [x] Monorepo configured with npm workspaces (`shared`, `backend`, `mobile`).
- [x] Shared package created (`@life-memory/shared`) with base interfaces, enums, category metadata, and Zod schemas.
- [x] Fastify backend scaffolded with error handling, rate limiting, CORS, Helmet, and health check route (`/health`).
- [x] Mobile Expo Router setup with 5 bottom tabs (`Home`, `Things`, `Calendar`, `Alerts`, `Profile`) and Universal `+ Remember Something` modal.
- [x] NativeWind design system tokens configured for Sleek Dark & Light themes.
- [x] Automated tests and TypeScript typechecks verified across all workspaces.

---

### ✅ Phase 2: Authentication & Security (Completed)
- [x] User Mongoose model created with unique lowercase email index and hidden password hashes.
- [x] Argon2id password hashing implemented with 64MB memory cost and 3 time iterations.
- [x] JWT Dual-Token architecture: 15-minute access tokens and 30-day rotated refresh tokens.
- [x] Logout session revocation using MongoDB `$unset` on refresh token hash.
- [x] Fastify `authenticate` decorator enforcing Bearer token validation on protected routes.
- [x] Expo SecureStore service on mobile for encrypted hardware-backed token storage.
- [x] Centralized API client with automatic 401 interception, refresh queuing, and replay.
- [x] Zustand `useAuthStore` providing session state and startup bootstrap (`initAuth`).
- [x] Mobile `Login`, `Register`, and connected `Profile` screens.
- [x] Vitest integration test suite passing with 100% success.

---

### ✅ Phase 3: Core Data Architecture & Base Models (Completed)
- [x] All 11 Mongoose database models created (`assets`, `maintenanceRecords`, `documents`, `medicines`, `subscriptions`, `purchases`, `familyMembers`, `parkingRecords`, `reminders`, `attachments`, `notificationPreferences`).
- [x] Compound user isolation indexes `{ userId: 1, createdAt: -1 }` added on all collections.
- [x] Date and status indexes on `expiryDate`, `nextDueDate`, `nextBillingDate`, `returnByDate`, `warrantyExpiryDate`, `dueDateTime`, and `isActive`.
- [x] Normalized monthly and yearly cost pre-validation calculation on Subscriptions.
- [x] 23/23 integration tests passing verifying schema validation, compound indexes, and cross-user data isolation.

---

### ⏳ Phase 4: Dashboard & Universal Add Flow
* `AssetModel` (`assets` collection): `userId`, `name`, `type`, `brand`, `model`, `serialNumber`, `purchaseDate`, `notes`, `attachmentIds`.
* `MaintenanceRecordModel` (`maintenanceRecords` collection): `userId`, `assetId`, `title`, `serviceDate`, `nextDueDate`, `cost`, `currency`, `isRecurring`, `recurrenceIntervalMonths`, `isCompleted`, `notes`, `serviceProvider`, `attachmentIds`.
* `DocumentModel` (`documents` collection): `userId`, `name`, `documentType`, `documentNumber`, `issueDate`, `expiryDate`, `reminderDaysBefore`, `notes`, `attachmentIds`.
* `MedicineModel` (`medicines` collection): `userId`, `name`, `dosage`, `quantity`, `reorderThreshold`, `expiryDate`, `dosageInstructions`, `notes`.
* `SubscriptionModel` (`subscriptions` collection): `userId`, `name`, `price`, `currency`, `billingFrequency`, `nextBillingDate`, `paymentMethod`, `category`, `autoRenew`, `monthlyCost`, `yearlyCost`, `notes`.
* `PurchaseModel` (`purchases` collection): `userId`, `productName`, `price`, `currency`, `purchaseDate`, `store`, `warrantyExpiryDate`, `returnByDate`, `notes`, `attachmentIds`.
* `FamilyMemberModel` (`familyMembers` collection): `userId`, `name`, `relationship`, `birthday`, `notes`.
* `ParkingRecordModel` (`parkingRecords` collection): `userId`, `locationName`, `floor`, `section`, `slot`, `latitude`, `longitude`, `notes`, `photoUrl`, `parkedAt`, `isActive`.
* `ReminderModel` (`reminders` collection): `userId`, `title`, `description`, `dueDateTime`, `recurrence`, `isCompleted`, `snoozedUntil`, `relatedCategory`, `relatedId`, `familyMemberId`, `reminderPeriodsMinutes`.
* `AttachmentModel` (`attachments` collection): `userId`, `storageKey`, `fileName`, `mimeType`, `size`, `createdAt`.
* `NotificationPreferenceModel` (`notificationPreferences` collection): `userId`, `pushToken`, `quietHoursStart`, `quietHoursEnd`, `defaultReminderLeadTimes`.

#### 2. Database Indexing Rules:
* All collections must feature compound index `{ userId: 1, createdAt: -1 }`.
* Date-queried collections (`reminders`, `documents`, `subscriptions`, `maintenanceRecords`, `purchases`) must index `{ userId: 1, dueDateTime: 1 }` / `{ userId: 1, expiryDate: 1 }` / `{ userId: 1, nextBillingDate: 1 }`.
* Active parking index: `{ userId: 1, isActive: 1 }`.

#### 3. Verification Criteria:
* Automated integration test verifying creation, isolation, index existence, and query constraints across all models.

---

### 📝 Phase 4: Dashboard & Universal Add Flow
**Objective**: Create the core "Needs Attention" engine and the complete universal `+ Remember Something` action flow.

#### 1. Backend Attention Engine (`backend/src/services/dashboard.service.ts`):
* Endpoint `GET /api/v1/dashboard`:
  * Aggregates records across documents expiring within 30 days, overdue/upcoming maintenance, subscriptions renewing soon, return deadlines for purchases, medicine refill alerts, and pending reminders.
  * Calculates urgency scores (`critical`, `soon`, `upcoming`, `overdue`).
  * Generates friendly human greeting (`"Good morning, Alex 👋"`).
  * Returns structured `{ greeting, needsAttention: [], upcoming: [], stats: {} }`.

#### 2. Mobile Dashboard Experience (`mobile/app/(tabs)/index.tsx`):
* Real database-driven dashboard using TanStack Query `useQuery(['dashboard'])`.
* Dynamic card color coding based on urgency:
  * 🔴 Overdue / Critical (Due today / tomorrow)
  * 🟡 Soon (Due within 7 days)
  * 🔵 Normal / Upcoming
* Pull-to-refresh and optimistic interaction.

#### 3. Universal Add Action Sheet & Quick Entry Modals:
* Tapping `+ Remember Something` opens category picker sheet.
* Fast, streamlined addition forms for all 8 categories:
  * `Home / Vehicle` form
  * `Document` form
  * `Medicine` form
  * `Subscription` form
  * `Purchase` form
  * `Family` form
  * `Parking` form
  * `Reminder` form

---

### 📝 Phase 5: Documents & General Reminders
**Objective**: Build full document expiration management and personal to-do/reminder tracking.

#### 1. Documents Feature:
* CRUD routes `/api/v1/documents`.
* Expiration alert calculation (e.g. 30 days, 15 days, 7 days, 1 day before).
* Document cards displaying validity status, expiration countdown, and attached files.

#### 2. Reminders Feature:
* CRUD routes `/api/v1/reminders`.
* Completion toggle (`PUT /api/v1/reminders/:id/complete`).
* Snooze options (Snooze 1 hour, 1 day, 1 week, custom date).
* Recurrence rules: Daily, Weekly, Monthly, Yearly.

---

### 📝 Phase 6: Maintenance & Subscriptions
**Objective**: Implement asset maintenance tracking and recurring subscription financial analytics.

#### 1. Asset & Maintenance Records:
* CRUD routes `/api/v1/assets` & `/api/v1/maintenance`.
* Recurring maintenance generator (e.g. car oil change every 6 months or 5,000 miles, AC cleaning every 90 days).
* Cost tracking per asset.

#### 2. Subscriptions & Cost Analytics:
* CRUD routes `/api/v1/subscriptions`.
* Automatic monthly and yearly cost calculation across weekly, monthly, quarterly, and annual billing.
* Renewal reminder lead times.
* Category breakdown (Entertainment, Utilities, Software, Health, Other).

---

### 📝 Phase 7: Purchases & Unified Calendar View
**Objective**: Purchase warranties, return window deadlines, and the unified calendar agenda.

#### 1. Purchases & Price History:
* CRUD routes `/api/v1/purchases`.
* Return window countdowns ("Return by tomorrow").
* Warranty expiration alerts.
* Store & price tracking.

#### 2. Multi-Source Calendar Engine:
* Endpoint `GET /api/v1/calendar?month=YYYY-MM`.
* Consolidates events from:
  * Reminders due date
  * Document expirations
  * Subscription billing dates
  * Maintenance due dates
  * Purchase return/warranty dates
  * Family member birthdays
* Interactive mobile month/week strip with day filter.

---

### 📝 Phase 8: Medicine, Family & Parking
**Objective**: Medicine stock tracking, family duty reminders, and instant parking memory.

#### 1. Medicine Tracking:
* CRUD routes `/api/v1/medicines`.
* Quantity decrement & reorder threshold calculation.
* Expiry date alerts (strictly organizational, non-medical).

#### 2. Family Responsibilities:
* CRUD routes `/api/v1/family`.
* Association between family members and specific reminders/chores.
* Birthday countdowns.

#### 3. Instant Parking Memory:
* CRUD routes `/api/v1/parking`.
* Single active parking record per user (`isActive: true`).
* Captures: Location, Floor, Section, Pillar/Slot, Photo, Notes, and GPS coordinates via `expo-location`.
* One-tap "Mark as Departed / Cleared".

---

### 📝 Phase 9: Notifications & Offline Caching
**Objective**: Native Android notifications and SQLite local caching.

#### 1. Native Android Notifications (`expo-notifications`):
* Local notification scheduling engine matching user's reminder intervals.
* Background execution support.
* Customizable notification lead times (1 day, 3 days, 7 days, 15 days, 30 days).

#### 2. Offline Resilience (`expo-sqlite` & TanStack Query):
* SQLite local cache mirror of user records.
* Seamless offline viewing of previously loaded items.
* Offline banner indicating local mode with automatic sync retry upon network restoration.

---

### 📝 Phase 10: Testing, Security Audit & Production Build
**Objective**: Full end-to-end verification, security hardening, and EAS Android build.

#### 1. Security & Quality Audit:
* User isolation verification: test that User A cannot read, update, or delete User B's records under any circumstance.
* Input validation audit: test boundary values on every endpoint.
* No sensitive tokens in mobile bundle or logs.

#### 2. EAS Android Build:
* `eas.json` configuration for Android APK / AAB.
* Verify clean build output without native dependency conflicts.
* Final Definition of Done sign-off.

---

## 🚀 How to Run the Project from Any Machine

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x
- Git

### Quickstart Commands
```bash
# 1. Clone repository
git clone <repo-url>
cd application

# 2. Install monorepo dependencies
npm install

# 3. Start Backend Server (runs on http://localhost:4000)
npm run dev:backend

# 4. Start Mobile Expo App (in a separate terminal)
npm run dev:mobile
# Press 'a' for Android emulator, 'w' for Web, or scan QR code in Expo Go

# 5. Run Verification & Typechecks
npm run typecheck
npm run test
npm run build
```
