<div align="center">

# ⚡ DeadlineAI

### Your AI-powered second brain for deadlines, tasks, and career goals.

*Never miss an internship, hackathon, assignment, or interview again.*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=black)](https://render.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

**[Live Demo](https://deadline-ai-client.vercel.app)** · **[API Health](https://deadlineai-backend-czl8.onrender.com/health)** · **[Report Bug](https://github.com/Abhay13-11/DeadlineAI/issues)** · **[Request Feature](https://github.com/Abhay13-11/DeadlineAI/issues)**

</div>

---

## 📌 Overview

Students and professionals face a universal problem: **critical deadlines are scattered across dozens of platforms** — WhatsApp forwards, Gmail threads, college portals, LinkedIn, Discord, Telegram — and the moment you see them you think *"I'll handle it later."* Later never comes.

DeadlineAI eliminates this problem entirely.

It is a **full-stack AI productivity platform** that acts as your personal secretary. You can type a deadline in plain English, upload a screenshot of a WhatsApp message, or drop a PDF internship form — and DeadlineAI extracts every task, sets the right reminders, categorises everything, and pushes notifications to your device before time runs out.

> Built as a production-grade portfolio project demonstrating end-to-end full-stack engineering, AI integration, real-time notifications, OAuth, and cloud deployment.

---

## ✨ Features

### 🤖 AI & Automation
| Feature | Description |
|---|---|
| **Natural Language Task Creation** | Type "HackVega registration ends 25 June 11:59 PM, need Resume and GitHub" — AI creates a fully structured task |
| **OCR Image-to-Task** | Upload a screenshot or PDF; Gemini Vision extracts dates, titles, links, and required documents automatically |
| **AI Chat Assistant** | ChatGPT-style panel that knows your entire task list and answers "What do I have today?" or "What's overdue?" |
| **AI Daily Planner** | One-click generates a prioritised plan for your day based on deadlines and priorities |
| **Smart Auto-Categorisation** | AI infers category (Internship, Hackathon, Interview, etc.), priority, and reminders from context |

### 📋 Task Management
| Feature | Description |
|---|---|
| **12 Task Categories** | Internship, Hackathon, Assignment, Meeting, Interview, Coding Contest, Certification, Exam, College, Personal, Job Application, Others |
| **4 Priority Levels** | Low, Medium, High, Critical (with animated pulse indicator for Critical) |
| **4 Status Stages** | Pending → In Progress → Completed → Missed |
| **Required Documents Tracking** | Tag Resume, Aadhaar, GitHub, LinkedIn, Transcript, and 9 more per task |
| **Full Metadata** | Deadline, time, location, meeting link, website link, notes, attachments, recurring options |
| **Timeline & Activity Log** | Every state change recorded with timestamp and actor |

### 📅 Views & Navigation
| Feature | Description |
|---|---|
| **Dashboard** | Today's tasks, upcoming 7-day view, overdue alerts, productivity score, recent activity |
| **Calendar View** | Monthly / Weekly / List via FullCalendar with colour-coded categories |
| **Kanban Board** | Drag-and-drop across Pending, In Progress, Completed, Missed columns |
| **Task Detail Page** | Full metadata, timeline, attachments, reminder history |
| **Search & Filters** | Full-text search + filter by category, priority, status, date range, quick filters (Today, This Week, Overdue) |

### 🔔 Notifications
| Feature | Description |
|---|---|
| **Browser Push Notifications** | Web Push via VAPID keys, works even when the app is closed |
| **Firebase Cloud Messaging** | Native push for Android/iOS via FCM |
| **7 Reminder Presets** | 1 week, 3 days, 1 day, 6 hours, 1 hour, 30 minutes, 5 minutes before deadline |
| **Custom Reminder Time** | Set any specific date/time as a reminder trigger |
| **Cron-Powered Scheduler** | Background jobs run every 5 minutes (reminders) and 30 minutes (auto-missed detection) |

### 📊 Analytics & Insights
| Feature | Description |
|---|---|
| **Completion Rate** | Overall and per-category task completion tracking |
| **Weekly & Monthly Reports** | Week-over-week comparison with daily breakdown charts |
| **Category Breakdown** | Pie chart of tasks across all 12 categories |
| **Priority Distribution** | Horizontal bar chart of task priorities |
| **Completion Trend** | 28-day rolling completion timeline |

### 🔐 Auth & Security
| Feature | Description |
|---|---|
| **Google OAuth 2.0** | One-click sign in, no passwords stored |
| **JWT + Refresh Tokens** | 7-day access token, 30-day refresh token in HTTP-only cookie |
| **Route Protection** | All task, analytics, and AI endpoints require valid JWT |
| **Rate Limiting** | Per-route limits — API (300/15 min), Auth (20/hour), AI (20/min) |
| **Helmet + CORS** | Security headers and strict origin allowlist |
| **Input Validation** | Zod schemas on every request body, query string, and route param |

---

## 🖼 Screenshots

| Screen | Preview |
|---|---|
| **Login** | ![Login](docs/screenshots/login.png) |
| **Dashboard** | ![Dashboard](docs/screenshots/dashboard.png) |
| **Task List** | ![Tasks](docs/screenshots/tasks.png) |
| **Calendar** | ![Calendar](docs/screenshots/calendar.png) |
| **Kanban Board** | ![Kanban](docs/screenshots/kanban.png) |
| **Analytics** | ![Analytics](docs/screenshots/analytics.png) |
| **AI Assistant** | ![AI Assistant](docs/screenshots/ai-assistant.png) |
| **Settings** | ![Settings](docs/screenshots/settings.png) |

> Screenshots are stored in `docs/screenshots/`. Add your own after first run.

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| TypeScript | 5.3 | Type safety across all components |
| Vite | 5 | Build tool and dev server |
| Tailwind CSS | 3.4 | Utility-first styling with custom design tokens |
| Framer Motion | 11 | Page transitions and micro-animations |
| Zustand | 4.5 | Lightweight global state management |
| React Router | 6 | Client-side routing with protected routes |
| FullCalendar | 6 | Calendar views (month/week/list) |
| Recharts | 2 | Analytics charts |
| Axios | 1.6 | HTTP client with JWT interceptors and auto-refresh |
| React Hot Toast | 2.4 | Non-blocking notification toasts |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 22 LTS | Runtime |
| Express | 4.18 | HTTP framework |
| TypeScript | 5.3 | End-to-end type safety |
| Mongoose | 8.1 | MongoDB ODM with typed schemas |
| Passport.js | 0.7 | Google OAuth 2.0 strategy |
| JSON Web Token | 9 | Stateless authentication |
| Google Gemini | `@google/genai` 2.10 | AI chat, task parsing, OCR, planning |
| Firebase Admin | 12 | FCM push notification delivery |
| Web Push | 3.6 | VAPID-based browser push notifications |
| Node Cron | 3 | Scheduled reminder and missed-task jobs |
| Multer | 1.4 | Multipart file upload (images, PDFs) |
| Winston | 3.11 | Structured logging |
| Zod | 3.22 | Runtime schema validation |
| Helmet | 7 | HTTP security headers |
| express-rate-limit | 7 | Per-route rate limiting |

### Infrastructure
| Service | Purpose |
|---|---|
| MongoDB Atlas | Cloud database (M0 free tier) |
| Vercel | Frontend hosting with SPA rewrite rules |
| Render | Backend hosting with health check and auto-restart |
| Google Cloud Console | OAuth 2.0 credentials |
| Google AI Studio | Gemini API key |
| Firebase Console | FCM project and credentials |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser / PWA                        │
│   React + TypeScript + Tailwind + Zustand + Framer Motion   │
│                   Deployed on Vercel                        │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS + JWT Bearer
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Express API (Node 22 + TypeScript)             │
│                    Deployed on Render                       │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │ Auth Routes │  │ Task Routes  │  │  Analytics Routes  │ │
│  │  (Passport) │  │ (CRUD + AI)  │  │  (Aggregation)     │ │
│  └─────────────┘  └──────────────┘  └────────────────────┘ │
│  ┌─────────────────────────────────────────────────────┐    │
│  │               AI Routes (Gemini)                    │    │
│  │  Chat · Task Parser · OCR · Planner                 │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌────────────────┐  ┌──────────────────────────────────┐   │
│  │  Cron Jobs     │  │   Notification Services          │   │
│  │  (node-cron)   │  │   FCM + Web Push (VAPID)         │   │
│  └────────────────┘  └──────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                            │
│  users · tasks · activity_logs · reminder_logs             │
│  ai_conversations                                           │
└─────────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    Google OAuth      Gemini API      Firebase FCM
   (Passport.js)   (AI + Vision)   (Push Delivery)
```

**Key architectural decisions:**

- **Monorepo** — `client/` and `server/` share one repository with npm workspaces. A single `npm run build` compiles both.
- **Stateless JWT** — No server-side session storage. Access token lives in memory (never localStorage). Refresh token lives in an HTTP-only cookie.
- **Service layer pattern** — Controllers are thin HTTP adapters. All business logic lives in `*.service.ts` files, making them independently testable.
- **Cron-powered notifications** — A 5-minute cron checks for pending reminders. A 30-minute cron auto-marks overdue tasks as Missed. Both log to `activity_logs`.
- **Zod validation at every boundary** — Every API request is parsed with a Zod schema before it reaches any controller.

---

## 📁 Folder Structure

```
DeadlineAI/
├── client/                          # React frontend
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── manifest.json            # PWA manifest
│   │   └── sw.js                    # Service worker
│   ├── src/
│   │   ├── components/
│   │   │   ├── ai/                  # AIChatPanel, OCRUploader, NLTaskCreator
│   │   │   ├── analytics/           # Charts and report widgets
│   │   │   ├── common/              # AppShell, Sidebar, TopBar, EmptyState
│   │   │   ├── dashboard/           # StatCard, ProductivityScore, DailyPlanWidget
│   │   │   ├── kanban/              # Drag-and-drop Kanban board
│   │   │   ├── notifications/       # Toast wrapper
│   │   │   └── tasks/               # TaskCard, TaskForm, TaskFilters, Badges
│   │   ├── contexts/                # AuthContext
│   │   ├── hooks/                   # useAuth, useTasks, useAI, useNotifications
│   │   ├── pages/                   # Route-level page components
│   │   ├── services/                # Axios API wrappers (authService, taskService…)
│   │   ├── store/                   # Zustand slices (authStore, taskStore, uiStore)
│   │   ├── styles/                  # globals.css with Tailwind + CSS variables
│   │   ├── types/                   # Shared TypeScript interfaces
│   │   └── utils/                   # formatters, taskUtils, constants
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts                # MongoDB connection with retry logic
│   │   │   ├── env.ts               # Zod-validated environment variables
│   │   │   └── passport.ts          # Google OAuth strategy
│   │   ├── controllers/             # Thin HTTP handlers
│   │   ├── jobs/
│   │   │   ├── reminderJob.ts       # Cron: send due reminders (every 5 min)
│   │   │   └── missedTaskJob.ts     # Cron: auto-mark overdue tasks (every 30 min)
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts   # JWT verification
│   │   │   ├── errorHandler.ts      # Global error handler
│   │   │   ├── rateLimiter.ts       # Per-route rate limits
│   │   │   └── validate.ts          # Zod request validation
│   │   ├── models/                  # Mongoose schemas
│   │   ├── routes/                  # Express routers
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   │   ├── aiChat.service.ts
│   │   │   │   ├── taskParser.service.ts
│   │   │   │   ├── ocr.service.ts
│   │   │   │   └── planner.service.ts
│   │   │   ├── notification/
│   │   │   │   ├── fcm.service.ts
│   │   │   │   ├── webpush.service.ts
│   │   │   │   └── scheduler.service.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── task.service.ts
│   │   ├── types/                   # Shared TypeScript types + Express augmentation
│   │   ├── utils/                   # logger, AppError, asyncHandler, jwt, dateHelpers
│   │   ├── validators/              # Zod schemas for tasks and AI endpoints
│   │   ├── app.ts                   # Express app bootstrap
│   │   └── server.ts                # Process entry point + graceful shutdown
│   ├── openssl.cnf                  # OpenSSL config for Node 24 TLS compatibility
│   ├── tsconfig.json
│   ├── railway.json
│   └── package.json
│
├── docs/
│   └── screenshots/                 # UI screenshots for README
├── package.json                     # Root monorepo config (npm workspaces)
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- Node.js **22 LTS** (required — Node 24 has an OpenSSL TLS issue with MongoDB Atlas on Windows)
- npm 10+
- MongoDB Atlas account (free M0 cluster)
- Google Cloud Console project with OAuth 2.0 credentials
- Google AI Studio account (Gemini API key)

### 1 — Clone and install

```bash
git clone https://github.com/Abhay13-11/DeadlineAI.git
cd DeadlineAI

# Install root + all workspace dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2 — Configure environment variables

```bash
# Backend
cp server/.env.example server/.env

# Frontend
cp client/.env.example client/.env
```

Fill in both `.env` files. See the [Environment Variables](#-environment-variables) section below.

### 3 — Run in development

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client
npm run dev
```

### 4 — Build for production

```bash
# From root
npm run build            # builds both server and client
```

---

## 🔑 Environment Variables

### Backend — `server/.env`

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | ✅ | `development` or `production` |
| `PORT` | ✅ | Server port (default `5000`) |
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string. Use direct `mongodb://` format on Windows/Node 22+ to avoid SRV DNS issues |
| `JWT_SECRET` | ✅ | 64-character random hex. Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_REFRESH_SECRET` | ✅ | Different 64-character random hex |
| `JWT_EXPIRES_IN` | ✅ | Access token TTL (e.g. `7d`) |
| `JWT_REFRESH_EXPIRES_IN` | ✅ | Refresh token TTL (e.g. `30d`) |
| `GOOGLE_CLIENT_ID` | ✅ | From Google Cloud Console → Credentials |
| `GOOGLE_CLIENT_SECRET` | ✅ | From Google Cloud Console → Credentials |
| `GOOGLE_CALLBACK_URL` | ✅ | Must exactly match an Authorized Redirect URI in Google Console. Example: `https://your-backend.onrender.com/api/v1/auth/google/callback` |
| `CLIENT_URL` | ✅ | Frontend origin for CORS and OAuth redirect. No trailing slash. Example: `https://your-app.vercel.app` |
| `GEMINI_API_KEY` | ✅ | From [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `GEMINI_MODEL` | ✅ | e.g. `gemini-2.0-flash` |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | ⚠️ Optional | Base64-encoded service account JSON for FCM. `node -e "console.log(Buffer.from(require('fs').readFileSync('sa.json')).toString('base64'))"` |
| `VAPID_PUBLIC_KEY` | ⚠️ Optional | Generate: `npx web-push generate-vapid-keys` |
| `VAPID_PRIVATE_KEY` | ⚠️ Optional | Generated alongside public key |
| `VAPID_EMAIL` | ⚠️ Optional | `mailto:you@yourdomain.com` |
| `CLOUDINARY_CLOUD_NAME` | ⚠️ Optional | For attachment uploads |
| `CLOUDINARY_API_KEY` | ⚠️ Optional | From Cloudinary console |
| `CLOUDINARY_API_SECRET` | ⚠️ Optional | From Cloudinary console |
| `OPENSSL_CONF` | Windows only | Path to `openssl.cnf` to fix TLS on Node 24 + Windows |

### Frontend — `client/.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ | Backend API base URL. Example: `https://your-backend.onrender.com/api/v1` |
| `VITE_GOOGLE_CLIENT_ID` | ✅ | Same as backend `GOOGLE_CLIENT_ID` |
| `VITE_FIREBASE_API_KEY` | ⚠️ Optional | Firebase web app config |
| `VITE_FIREBASE_AUTH_DOMAIN` | ⚠️ Optional | Firebase web app config |
| `VITE_FIREBASE_PROJECT_ID` | ⚠️ Optional | Firebase web app config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ⚠️ Optional | Firebase web app config |
| `VITE_FIREBASE_APP_ID` | ⚠️ Optional | Firebase web app config |
| `VITE_FIREBASE_VAPID_KEY` | ⚠️ Optional | Same as backend `VAPID_PUBLIC_KEY` |

---

## 📡 API Overview

All endpoints are prefixed `/api/v1`. Protected routes require `Authorization: Bearer <token>`.

<details>
<summary><strong>Auth Routes</strong> — <code>/api/v1/auth</code></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/google` | ❌ | Initiate Google OAuth flow |
| GET | `/google/callback` | ❌ | OAuth callback — issues JWT, sets cookie |
| POST | `/refresh` | ❌ | Refresh access token via HTTP-only cookie |
| POST | `/logout` | ❌ | Clear refresh token cookie |
| GET | `/me` | ✅ | Get authenticated user profile |
| PUT | `/preferences` | ✅ | Update theme, notification preferences |
| POST | `/fcm-token` | ✅ | Register device FCM token |
| POST | `/web-push-subscription` | ✅ | Save Web Push subscription |

</details>

<details>
<summary><strong>Task Routes</strong> — <code>/api/v1/tasks</code></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/dashboard` | ✅ | Today, upcoming, overdue tasks + stats |
| GET | `/` | ✅ | Paginated task list with filters and full-text search |
| POST | `/` | ✅ | Create task |
| GET | `/:id` | ✅ | Get task by ID |
| PUT | `/:id` | ✅ | Full task update |
| DELETE | `/:id` | ✅ | Soft delete (archive) |
| PATCH | `/:id/status` | ✅ | Status-only update (for Kanban) |

</details>

<details>
<summary><strong>AI Routes</strong> — <code>/api/v1/ai</code></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/chat` | ✅ | Send message to AI assistant |
| GET | `/conversation` | ✅ | Load conversation history |
| DELETE | `/conversation` | ✅ | Clear conversation |
| POST | `/create-from-text` | ✅ | Parse natural language → structured task preview |
| POST | `/create-from-text/confirm` | ✅ | Create task from confirmed AI parse |
| POST | `/create-from-image` | ✅ | OCR: upload image → extract tasks |
| POST | `/create-from-pdf` | ✅ | OCR: upload PDF → extract tasks |
| POST | `/suggest-plan` | ✅ | Generate AI daily productivity plan |

</details>

<details>
<summary><strong>Analytics Routes</strong> — <code>/api/v1/analytics</code></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/overview` | ✅ | Completion rates, category and priority breakdown |
| GET | `/weekly` | ✅ | This week vs last week comparison |
| GET | `/monthly` | ✅ | Last 6 months breakdown |

</details>

---

## 🔐 Authentication Flow

```
1. User clicks "Continue with Google"
   → Browser navigates to GET /api/v1/auth/google
   → Passport builds Google OAuth URL with GOOGLE_CALLBACK_URL
   → Express returns 302 redirect to accounts.google.com

2. User completes Google consent
   → Google redirects to GOOGLE_CALLBACK_URL
   → Passport validates the code, fetches profile
   → User is created or updated in MongoDB
   → Server generates access token (7d) and refresh token (30d)
   → Refresh token set as HTTP-only SameSite=Strict cookie
   → Server redirects to CLIENT_URL/auth/callback?token=<access_token>

3. Frontend AuthCallbackPage
   → Reads token from URL params
   → Stores in Zustand memory store (never localStorage)
   → Clears token from URL
   → Calls GET /auth/me to load user profile
   → Redirects to /dashboard

4. Token refresh
   → Axios interceptor catches 401 responses
   → Automatically POSTs /auth/refresh (sends cookie)
   → Retries original request with new access token
   → If refresh fails, redirects to /login
```

---

## 🤖 AI Workflow

```
User types: "HackVega registration ends 25 June 11:59 PM. Need Resume, Aadhaar and GitHub."

1. POST /ai/create-from-text { input: "..." }

2. taskParser.service.ts sends to Gemini with structured prompt:
   - System: "Extract task fields. Return ONLY valid JSON."
   - Schema: title, category, priority, deadline, deadlineTime,
             requiredDocuments[], reminders[], confidence

3. Gemini returns:
   {
     "title": "HackVega Registration",
     "category": "Hackathon",
     "priority": "High",
     "deadline": "2024-06-25T18:29:00.000Z",
     "deadlineTime": "23:59",
     "requiredDocuments": ["Resume", "Aadhaar", "GitHub"],
     "reminders": [{"type": "1d"}, {"type": "1h"}],
     "confidence": 0.95
   }

4. Frontend shows editable preview with confidence score

5. User clicks "Create Task"
   → POST /ai/create-from-text/confirm
   → Task saved with source: "ai"
   → Reminders scheduled via cron
```

---

## 📸 OCR Workflow

```
User uploads a screenshot of a college portal or WhatsApp forward

1. POST /ai/create-from-image (multipart/form-data, field: "file")
   → Multer stores file in memory (no disk writes)
   → 10MB limit, JPEG/PNG/WebP/PDF accepted

2. ocr.service.ts sends to Gemini Vision API:
   - Image encoded as base64 data URL
   - Prompt: "Extract all text. Identify deadlines, task names,
             dates, links, required documents."

3. Gemini returns structured text with KEY INFORMATION section

4. taskParser.service.ts parses extracted text → array of task objects
   (one image can contain multiple tasks)

5. Frontend OCRUploader shows selectable task list
   - User selects which tasks to create
   - Each can be edited in TaskForm before saving
   - All created with source: "ocr"
```

---

## 🔔 Notification Workflow

```
Task created with deadline: 2024-06-25 23:59 and reminder: "1h"

1. Reminder fire time calculated: 2024-06-25 22:59

2. Reminder cron (every 5 min):
   - Queries tasks WHERE deadline <= now+10min AND reminders.sent = false
   - For each due reminder:
     a. Try FCM push (if user has fcmToken)
     b. Try Web Push (if user has webPushSubscription)
     c. Mark reminder.sent = true
     d. Log to reminder_logs collection
     e. Add entry to activity_logs

3. Missed-task cron (every 30 min):
   - Queries tasks WHERE deadline < now AND status IN [Pending, InProgress]
   - Bulk-updates status to "Missed"
   - Updates user.stats.missedTasks counter
   - Adds timeline entry: "Auto-marked as Missed (deadline passed)"

4. Browser receives push notification:
   - Service worker handles push event
   - Shows native notification with task title
   - Click opens /tasks/:id directly
```

---

## ☁️ Deployment Guide

<details>
<summary><strong>Backend → Render</strong></summary>

1. Go to [render.com](https://render.com) → New Web Service → Connect GitHub repo
2. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
3. Add all backend environment variables in the Render dashboard
4. Update `GOOGLE_CALLBACK_URL` to your Render URL
5. Add your Render URL to Google Cloud Console → Authorized Redirect URIs
6. Trigger manual deploy

**Health check:** `GET /health` returns service and database status.

</details>

<details>
<summary><strong>Frontend → Vercel</strong></summary>

1. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. Configure:
   - **Framework:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add all `VITE_*` environment variables
4. `client/vercel.json` already includes SPA rewrite rule and security headers
5. Deploy

</details>

<details>
<summary><strong>MongoDB Atlas</strong></summary>

1. Create free M0 cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Database Access → Add database user
3. Network Access → Add IP Address:
   - During development: your current IP
   - Production: Add Render's outbound IPs (or allow `0.0.0.0/0` for free tier)
4. Connect → Drivers → copy connection string
5. **Recommended:** Use direct `mongodb://` connection string (not `mongodb+srv://`) if deploying to environments with DNS restrictions

</details>

<details>
<summary><strong>Google OAuth Setup</strong></summary>

1. [console.cloud.google.com](https://console.cloud.google.com) → New project
2. APIs & Services → OAuth consent screen → External
3. APIs & Services → Credentials → Create OAuth 2.0 Client ID
4. Add **Authorized JavaScript Origins:**
   ```
   http://localhost:5173
   https://your-app.vercel.app
   ```
5. Add **Authorized Redirect URIs:**
   ```
   http://localhost:5000/api/v1/auth/google/callback
   https://your-backend.onrender.com/api/v1/auth/google/callback
   ```
6. Copy Client ID and Secret to both `.env` files

> ⚠️ The redirect URI must match `GOOGLE_CALLBACK_URL` character-for-character including protocol, domain, path, and no trailing slash.

</details>

---

## ⚡ Performance Optimisations

| Area | Technique |
|---|---|
| **Frontend bundle** | Vite code splitting — each route is a separate chunk, loaded lazily |
| **State management** | Zustand with individual slice selectors prevents unnecessary re-renders |
| **API calls** | Axios interceptor with token refresh queue — concurrent 401s resolve with a single refresh, not N refreshes |
| **Database queries** | Compound indexes on `userId + status`, `userId + deadline`, `userId + category`; text index on `title + description + notes` |
| **MongoDB aggregation** | Analytics use `$group` pipelines instead of loading documents into memory |
| **HTTP compression** | `compression` middleware gzip-encodes all API responses |
| **Rate limiting** | Prevents abuse and protects AI endpoints from accidental loops |
| **Cron efficiency** | Reminder job uses a 10-minute window query, not a full table scan |
| **OCR memory** | Multer uses `memoryStorage` — uploaded files never touch disk, processed in-process and discarded |
| **AI context window** | Chat history capped at last 20 messages for Gemini context; full history stored in MongoDB |

---

## 🛡 Security Features

| Feature | Implementation |
|---|---|
| **No password storage** | Google OAuth only — no credentials ever stored |
| **HTTP-only cookies** | Refresh token is `httpOnly`, `secure`, `sameSite: strict` — inaccessible to JavaScript |
| **Access token in memory** | Stored in Zustand, never in `localStorage` or `sessionStorage` |
| **Helmet.js** | Sets 11 security headers including CSP, HSTS, X-Frame-Options |
| **CORS allowlist** | Only `CLIENT_URL` is an allowed origin — all other origins rejected |
| **Zod validation** | Every request body, query string, and route parameter validated before reaching controllers |
| **User isolation** | Every task query appends `userId: req.user._id` — users cannot access each other's data |
| **Rate limiting** | 300 req/15min (API), 20 req/hour (auth), 20 req/min (AI) with OPTIONS preflight exemption |
| **Soft deletes** | Tasks are archived (`isArchived: true`), never hard-deleted — prevents accidental data loss |
| **Error sanitisation** | Production error responses never expose stack traces or internal messages |

---

## 🔮 Future Improvements

- [ ] **Gmail integration** — OAuth read scope to auto-detect interview and internship emails
- [ ] **Google Calendar sync** — Bidirectional task/event sync
- [ ] **Chrome Extension** — One-click deadline capture from any webpage
- [ ] **WhatsApp Bot** — Forward a message to a number, task is created automatically
- [ ] **React Native mobile app** — iOS and Android with push notifications
- [ ] **Team workspaces** — Shared task boards for study groups and project teams
- [ ] **Resume tracker** — Track application status per company with a Kanban-style pipeline
- [ ] **LinkedIn job import** — Detect saved jobs and create follow-up tasks
- [ ] **Voice input** — "Add meeting tomorrow at 4 PM" via Web Speech API
- [ ] **Recurring task engine** — Daily, weekly, monthly auto-regeneration with smart scheduling
- [ ] **AI conflict detection** — Warn when two tasks have overlapping deadlines
- [ ] **Export to PDF/CSV** — Weekly and monthly productivity reports
- [ ] **Dark/light mode sync** — Respect OS preference and allow override per device
- [ ] **Offline mode** — IndexedDB cache for viewing tasks without internet
- [ ] **Multi-language support** — i18n for Hindi, Tamil, and other Indian languages

---

## 🧗 Challenges Faced

**Node 24 + OpenSSL 3 TLS breakage with MongoDB Atlas**
Node 24 ships with OpenSSL 3 which raises the default security level to 2, disabling cipher suites that MongoDB Atlas shared clusters negotiate with. The symptom was `SSL alert number 80 (internal_error)` at the TLS layer — not a DNS or authentication issue. Fixed by providing a custom `openssl.cnf` setting `SECLEVEL=1` before process startup.

**Google OAuth redirect URI mismatch in production**
The callback URL registered in Google Cloud Console, the `GOOGLE_CALLBACK_URL` environment variable on Render, and the URL Passport sends to Google must be identical byte-for-byte. A visually identical character (`l` vs `1`) in the Render subdomain caused silent failures for several deploys. Debugged by decoding the `redirect_uri` query parameter directly from the browser address bar during the OAuth flow.

**Infinite request loop from Zustand store subscriptions**
Passing the entire Zustand store object as a `useCallback` dependency caused a new function reference on every render, triggering `useEffect` repeatedly. Fixed by selecting individual slices (`useTaskStore(s => s.setTasks)`) instead of the whole store, giving stable function references.

**`devDependencies` not installed on Render (NODE_ENV=production)**
Render sets `NODE_ENV=production` before `npm install`, causing npm to skip all `devDependencies`. Since `typescript` and all `@types/*` were in `devDependencies`, the `tsc` build command exited with code 2 on every deploy while passing locally. Fixed by moving all build-time packages to `dependencies`.

---

## 📚 Learning Outcomes

| Area | What Was Learned |
|---|---|
| **Full-stack TypeScript** | End-to-end type safety from MongoDB schema to React component props |
| **OAuth 2.0** | Complete implementation of the authorisation code flow with PKCE-ready architecture |
| **JWT architecture** | Stateless auth with dual-token pattern, silent refresh, and XSS-safe storage |
| **Gemini AI API** | Structured output prompting, vision-based OCR, multi-task extraction, context-aware chat |
| **Web Push & FCM** | VAPID key generation, service worker lifecycle, push event handling, cross-platform delivery |
| **MongoDB aggregation** | `$group`, `$match`, `$sort`, `$switch` pipelines for analytics without ORM overhead |
| **Node.js internals** | How `c-ares` (libuv's DNS resolver) differs from the Windows DNS Client service |
| **Monorepo management** | npm workspaces with shared build pipelines and independent deployment targets |
| **Production debugging** | Diagnosing TLS handshake failures, rate limiter misconfiguration, and OAuth redirect chains from logs and network traces |
| **PWA** | Service worker caching strategies, push notification handling, offline fallback |

---

## 🏆 Why This Project Stands Out

This is not a tutorial CRUD app. DeadlineAI demonstrates the full surface area of modern production engineering:

**AI integration beyond a chat box** — Gemini is used for structured data extraction (not just text generation), vision-based OCR, multi-task parsing from a single image, and context-aware planning. The AI knows the user's entire task database and reasons over it.

**Real authentication engineering** — The OAuth flow, dual-token JWT pattern, HTTP-only cookie handling, Axios interceptor with refresh queue, and frontend token lifecycle are all implemented correctly — not with a library that hides the details.

**Operational maturity** — The codebase has graceful shutdown, structured Winston logging, health check endpoints, cron job observability, global error handling with environment-aware sanitisation, and Zod validation at every trust boundary.

**Debugging under real constraints** — Every production issue documented in [Challenges Faced](#-challenges-faced) was diagnosed from first principles using network traces, DNS query tools, and TLS inspection — not by following a StackOverflow answer.

---

## 🤝 Contributing

Contributions are welcome. Please open an issue first to discuss what you would like to change.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 📬 Contact

**Abhay Singh**

[![GitHub](https://img.shields.io/badge/GitHub-Abhay13--11-181717?style=flat-square&logo=github)](https://github.com/Abhay13-11)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/<YOUR_LINKEDIN_USERNAME>)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=flat-square&logo=gmail)](mailto:<YOUR_EMAIL>)

---

<div align="center">

**⭐ If this project helped you, please give it a star. It helps with visibility and motivates continued development.**

*Built with ❤️ to solve a real problem faced by every college student in India.*

</div>
