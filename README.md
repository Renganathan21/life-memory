# 🌟 Life Memory

> **Everything you don't want to forget.**  
> A unified personal memory and reminder system for mobile and cloud.

---

## 📱 About Life Memory

Life Memory helps people remember and manage everyday responsibilities without feeling like a disjointed set of tracker apps. It answers one central question:

> **"What do I need to take care of?"**

With the universal primary action:

> **`+ Remember Something`**

### Supported Domains
- 🚗 **Home & Vehicle Maintenance**: Service intervals, recurring maintenance, costs, providers.
- 📄 **Documents**: Expirations, document IDs, insurance policies, attachments.
- 💊 **Medicines**: Stock tracking, refill threshold alerts, expiry dates (organizational only).
- 💳 **Subscriptions**: Recurring billing, payment methods, monthly/yearly spend analysis.
- 🛍️ **Purchases & Warranties**: Return windows, warranty expirations, purchase receipts.
- 👥 **Family Responsibilities**: Chores, key milestones, loved ones' needs.
- 📍 **Parking**: Floor, section, slot, photo notes, and GPS location pins.
- 🔔 **General Reminders**: One-off and recurring personal reminders with snooze.

---

## 🏗️ Project Architecture

```text
React Native / Expo App (Mobile Client)
        │
        │ HTTPS REST API (Strict JWT Bearer Authentication)
        ▼
Node.js + Fastify API Server
        │
        ├───────────────────────┐
        ▼                       ▼
MongoDB Atlas (User DB)   Cloudflare R2 (Private Files)
```

### Monorepo Structure (`npm workspaces`)
* [`shared/`](./shared): Shared TypeScript types, interfaces, enums, category metadata, and Zod schemas.
* [`backend/`](./backend): Fastify TypeScript server, Mongoose models, Argon2 password hashing, JWT rotation, rate limiting, and security plugins.
* [`mobile/`](./mobile): React Native / Expo Router app with NativeWind, Zustand, TanStack Query, Expo SecureStore, and Expo Notifications.
* [`docs/`](./docs): Multi-phase implementation roadmap, architectural blueprints, and execution logs.

---

## 🚦 Roadmap & Current Status

Detailed phase-by-phase specifications, schemas, endpoints, and checklists are located in:  
👉 **[`docs/ROADMAP_AND_PHASES.md`](./docs/ROADMAP_AND_PHASES.md)**

| Phase | Description | Status |
| :--- | :--- | :---: |
| **Phase 1** | **Project Foundation**: Monorepo, Expo Router tabs, Fastify scaffold, Shared types | ✅ **Done** |
| **Phase 2** | **Authentication & Security**: Argon2, JWT rotation, SecureStore, Login/Register UI | ✅ **Done** |
| **Phase 3** | **Core Data Architecture**: 11 Mongoose collections, Base CRUD, Indexes, User isolation | ✅ **Done** |
| **Phase 4** | **Dashboard & Universal Add Flow**: Attention engine, Category action sheet & forms | ⏳ **Up Next** |
| **Phase 5** | **Documents & Reminders**: Expiry tracking, R2 attachment metadata, Recurrence | 📝 Planned |
| **Phase 6** | **Maintenance & Subscriptions**: Asset logs, Recurring intervals, Cost analytics | 📝 Planned |
| **Phase 7** | **Purchases & Calendar View**: Warranties, Return deadlines, Unified timeline | 📝 Planned |
| **Phase 8** | **Medicine, Family & Parking**: Refill thresholds, Family duties, GPS pin memory | 📝 Planned |
| **Phase 9** | **Notifications & Offline Caching**: Android local notifications, SQLite cache | 📝 Planned |
| **Phase 10** | **Testing, Security Hardening & EAS Android Build**: End-to-end verification | 📝 Planned |

---

## ⚡ Quickstart Guide (Run on Any Laptop)

### 1. Requirements
* **Node.js**: `v20.x` or later (tested on `v24.x`)
* **npm**: `v10.x` or later
* **Git**

### 2. Setup
```bash
# Clone the repository
git clone <your-repository-url>
cd application

# Install all monorepo dependencies
npm install
```

### 3. Running Backend (Fastify API)
```bash
# Start backend in development mode with auto-reload (port 4000)
npm run dev:backend
```
* Backend API: `http://localhost:4000`
* Health Check: `http://localhost:4000/health`

### 4. Running Mobile (Expo React Native)
```bash
# In a new terminal window:
npm run dev:mobile
```
* Press `a` to launch on Android Emulator
* Press `w` to launch on Web browser
* Or scan the QR code using the **Expo Go** app on your physical mobile device.

### 5. Verification & Testing
```bash
# Run TypeScript typechecks across all workspaces
npm run typecheck

# Run backend automated test suite (Vitest)
npm run test

# Build all packages
npm run build
```

---

## 🔒 Security Principles
1. **Zero Client Trust**: Mobile client never supplies `userId`. The backend strictly derives `userId` from the verified cryptographic JWT.
2. **Encrypted Passwords**: Argon2id hashing with strong memory and iteration cost parameters.
3. **Hardware Storage**: Access and refresh tokens are stored in the device's native Keystore / Keychain via `expo-secure-store`.
4. **No Plaintext Secrets**: Zero database credentials or storage keys in mobile client code or builds.
