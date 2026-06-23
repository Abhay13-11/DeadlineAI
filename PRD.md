# CogniTrack — AI-Powered Career & Academic Assistant
## Product Requirements Document v1.0

---

## 1. EXECUTIVE SUMMARY

**Product Name:** CogniTrack  
**Tagline:** *Your second brain for everything that matters.*  
**Target Users:** College students, job seekers, early-career professionals  
**Problem:** Critical tasks (internships, deadlines, meetings, assessments) are scattered across WhatsApp, Gmail, LinkedIn, Discord, and college portals — causing missed opportunities.  
**Solution:** A unified AI-powered task intelligence platform that ingests, categorizes, tracks, reminds, and answers questions about every important task.

---

## 2. PRODUCT GOALS

| Goal | Metric |
|------|--------|
| Zero missed deadlines | Reduction in missed tasks to <5% within 30 days |
| Daily active use | Users open app at least once/day |
| AI adoption | >60% of tasks created via AI/OCR/voice |
| Reminder effectiveness | >80% tasks completed before deadline |

---

## 3. USER PERSONAS

### Persona 1 — Arjun (College Student, 3rd Year CS)
- Juggles assignments, internship applications, hackathons, placement drives
- Gets information via WhatsApp forwards, college portals, Gmail
- Forgets things within hours of seeing them
- Needs: quick capture, smart reminders, deadline visibility

### Persona 2 — Priya (Final Year, Placement Season)
- Tracking 15+ companies simultaneously
- Managing resume versions, interview schedules, online assessments
- Needs: document tracking, calendar integration, AI insights

### Persona 3 — Rahul (Working Professional)
- Side-projects, certifications, LinkedIn posts, team meetings
- Needs: recurring tasks, priority management, weekly planning

---

## 4. COMPLETE FEATURE LIST

### Core Features (MVP)
- [ ] Google OAuth 2.0 Authentication
- [ ] Task CRUD with full metadata (title, description, category, priority, deadline, time, status, location, links, notes, attachments, required documents, reminders, recurring)
- [ ] 12 task categories (Internship, Hackathon, Assignment, Meeting, Interview, Coding Contest, Certification, Exam, College, Personal, Job Application, Others)
- [ ] 4 priority levels (Low, Medium, High, Critical)
- [ ] 4 status states (Pending, In Progress, Completed, Missed)
- [ ] Dashboard (Today's Tasks, Upcoming, Overdue, Productivity Score)
- [ ] Calendar View (Monthly / Weekly / Daily / Agenda + Drag & Drop)
- [ ] Kanban Board (Pending / Doing / Completed / Missed)
- [ ] Task Detail Page (attachments, timeline, reminder history, activity log)
- [ ] Search & Filters (category, date, priority, status, title)
- [ ] Custom reminder system (preset + custom times)
- [ ] Browser Push Notifications + Firebase Cloud Messaging
- [ ] Node Cron scheduled reminder jobs
- [ ] Analytics (completion rate, missed rate, category breakdown, weekly/monthly report)

### AI Features (MVP + Phase 2)
- [ ] AI Chat Assistant (ChatGPT-style, answers questions about your tasks)
- [ ] AI Task Creation (natural language → structured task)
- [ ] Image OCR (screenshot → task auto-creation)
- [ ] PDF OCR (internship PDF → multiple task extraction)
- [ ] Voice Input (speech → task creation)
- [ ] Smart scheduling suggestions
- [ ] AI-generated daily/weekly plan

### Phase 2 Features
- [ ] Gmail integration (detect interview/internship emails)
- [ ] Google Calendar sync (bidirectional)
- [ ] Chrome Extension (one-click deadline capture from any webpage)
- [ ] Recurring task automation
- [ ] Team/group task sharing

### Phase 3 Features
- [ ] Mobile app (React Native)
- [ ] WhatsApp bot integration
- [ ] LinkedIn job tracker integration
- [ ] AI resume analysis ("Which tasks need resume update?")
- [ ] Multi-user workspaces

---

## 5. USER FLOWS

### Flow 1: Quick Task Creation (Manual)
```
Login → Dashboard → "+ New Task" → Fill form → Set reminders → Save → Back to Dashboard
```

### Flow 2: AI Natural Language Task Creation
```
Dashboard → AI Chat Panel → Type: "HackVega ends 25 June 11:59 PM, need Resume and GitHub" 
→ AI parses → Shows structured preview → User confirms → Task created → Reminders auto-set
```

### Flow 3: OCR Task Creation
```
Dashboard → "+ via Screenshot" → Upload image → OCR pipeline → AI extracts fields 
→ Preview form (editable) → Confirm → Task(s) created
```

### Flow 4: Reminder Notification
```
Cron job fires → Checks upcoming deadlines → Sends FCM push notification 
→ User clicks notification → Opens task detail → Marks complete or snoozes
```

### Flow 5: AI Chat Query
```
Dashboard → AI Assistant panel → "What do I have today?" 
→ AI queries user's tasks from DB → Natural language response with task list
```

---

## 6. DATABASE SCHEMA

### Collection: users
```json
{
  "_id": "ObjectId",
  "googleId": "string",
  "email": "string (unique, indexed)",
  "name": "string",
  "avatar": "string (URL)",
  "fcmToken": "string",
  "preferences": {
    "defaultReminders": ["1d", "1h"],
    "timezone": "Asia/Kolkata",
    "theme": "dark | light",
    "notifications": {
      "push": true,
      "email": false
    }
  },
  "stats": {
    "totalTasks": 0,
    "completedTasks": 0,
    "missedTasks": 0,
    "streakDays": 0,
    "lastActive": "Date"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Collection: tasks
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users, indexed)",
  "title": "string (required)",
  "description": "string",
  "category": "enum: [Internship, Hackathon, Assignment, Meeting, Interview, CodingContest, Certification, Exam, College, Personal, JobApplication, Others]",
  "priority": "enum: [Low, Medium, High, Critical]",
  "status": "enum: [Pending, InProgress, Completed, Missed]",
  "deadline": "Date (indexed)",
  "deadlineTime": "string (HH:MM)",
  "location": "string",
  "meetingLink": "string",
  "websiteLink": "string",
  "notes": "string",
  "attachments": [
    {
      "name": "string",
      "url": "string (Cloudinary)",
      "type": "string (mime)",
      "uploadedAt": "Date"
    }
  ],
  "requiredDocuments": ["Resume", "Aadhaar", "GitHub", "LinkedIn", "Transcript", "Offer Letter"],
  "reminders": [
    {
      "type": "enum: [1w, 3d, 1d, 6h, 1h, 30m, 5m, custom]",
      "customTime": "Date",
      "sent": false,
      "sentAt": "Date"
    }
  ],
  "recurring": {
    "enabled": false,
    "frequency": "enum: [daily, weekly, monthly, custom]",
    "until": "Date",
    "interval": 1
  },
  "source": "enum: [manual, ai, ocr, voice, email]",
  "aiExtracted": {
    "rawInput": "string",
    "confidence": 0.95
  },
  "timeline": [
    {
      "action": "string",
      "at": "Date",
      "by": "string (system | userId)"
    }
  ],
  "completedAt": "Date",
  "isArchived": false,
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Collection: reminders_log
```json
{
  "_id": "ObjectId",
  "taskId": "ObjectId (ref: tasks)",
  "userId": "ObjectId (ref: users)",
  "reminderType": "string",
  "scheduledFor": "Date",
  "sentAt": "Date",
  "channel": "enum: [push, email, sms]",
  "status": "enum: [sent, failed, pending]",
  "errorMessage": "string"
}
```

### Collection: ai_conversations
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "messages": [
    {
      "role": "enum: [user, assistant]",
      "content": "string",
      "timestamp": "Date",
      "taskReferences": ["ObjectId"]
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Collection: activity_logs
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "taskId": "ObjectId (ref: tasks)",
  "action": "enum: [created, updated, status_changed, reminder_sent, completed, missed, deleted]",
  "metadata": "object",
  "timestamp": "Date"
}
```

---

## 7. API DESIGN

### Base URL: `/api/v1`

#### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/google/callback` | OAuth callback |
| POST | `/auth/refresh` | Refresh JWT |
| POST | `/auth/logout` | Logout (clear tokens) |
| GET | `/auth/me` | Get current user |

#### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks (with filters, pagination) |
| POST | `/tasks` | Create task |
| GET | `/tasks/:id` | Get task by ID |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task (soft) |
| PATCH | `/tasks/:id/status` | Update status only |
| GET | `/tasks/dashboard` | Dashboard summary |
| GET | `/tasks/overdue` | Overdue tasks |
| GET | `/tasks/upcoming` | Upcoming (next 7 days) |
| GET | `/tasks/search` | Full-text search |
| POST | `/tasks/:id/attachments` | Upload attachment |
| DELETE | `/tasks/:id/attachments/:attachId` | Remove attachment |

#### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/chat` | Send message to AI assistant |
| GET | `/ai/conversations` | Get conversation history |
| DELETE | `/ai/conversations` | Clear conversation |
| POST | `/ai/create-from-text` | AI natural language → task |
| POST | `/ai/create-from-image` | OCR image → task(s) |
| POST | `/ai/create-from-pdf` | OCR PDF → task(s) |
| POST | `/ai/voice-to-task` | Audio → task |
| POST | `/ai/suggest-plan` | Generate daily/weekly plan |

#### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notifications/fcm-token` | Register/update FCM token |
| GET | `/notifications/history` | Notification log |
| POST | `/notifications/subscribe` | Web push subscription |

#### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/overview` | Completion/missed rates |
| GET | `/analytics/weekly` | Weekly report |
| GET | `/analytics/monthly` | Monthly report |
| GET | `/analytics/categories` | Category breakdown |

#### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/users/profile` | Update profile/preferences |
| GET | `/users/stats` | User stats |

---

## 8. FOLDER STRUCTURE

### Frontend (`/client`)
```
client/
├── public/
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   │   ├── ui/              # shadcn/ui base components
│   │   ├── common/          # App-wide reusable
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   ├── tasks/
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskDetail.tsx
│   │   │   ├── TaskStatusBadge.tsx
│   │   │   ├── TaskPriorityBadge.tsx
│   │   │   ├── TaskCategoryIcon.tsx
│   │   │   ├── TaskFilters.tsx
│   │   │   ├── TaskSearchBar.tsx
│   │   │   ├── ReminderSelector.tsx
│   │   │   └── AttachmentUploader.tsx
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx
│   │   │   ├── ProductivityScore.tsx
│   │   │   ├── UpcomingTasksList.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   └── QuickActions.tsx
│   │   ├── calendar/
│   │   │   ├── CalendarView.tsx
│   │   │   └── CalendarEventCard.tsx
│   │   ├── kanban/
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   └── KanbanCard.tsx
│   │   ├── ai/
│   │   │   ├── AIChatPanel.tsx
│   │   │   ├── AIMessage.tsx
│   │   │   ├── AIInput.tsx
│   │   │   ├── OCRUploader.tsx
│   │   │   └── VoiceInput.tsx
│   │   ├── analytics/
│   │   │   ├── CompletionChart.tsx
│   │   │   ├── CategoryBreakdown.tsx
│   │   │   └── WeeklyReport.tsx
│   │   └── notifications/
│   │       └── NotificationToast.tsx
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── tasks/
│   │   │   ├── TasksPage.tsx
│   │   │   └── TaskDetailPage.tsx
│   │   ├── calendar/
│   │   │   └── CalendarPage.tsx
│   │   ├── kanban/
│   │   │   └── KanbanPage.tsx
│   │   ├── ai/
│   │   │   └── AIAssistantPage.tsx
│   │   ├── analytics/
│   │   │   └── AnalyticsPage.tsx
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTasks.ts
│   │   ├── useAI.ts
│   │   ├── useNotifications.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── NotificationContext.tsx
│   ├── services/
│   │   ├── api.ts             # Axios instance + interceptors
│   │   ├── authService.ts
│   │   ├── taskService.ts
│   │   ├── aiService.ts
│   │   ├── notificationService.ts
│   │   └── analyticsService.ts
│   ├── store/
│   │   ├── index.ts           # Zustand store root
│   │   ├── authStore.ts
│   │   ├── taskStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   ├── task.types.ts
│   │   ├── user.types.ts
│   │   ├── ai.types.ts
│   │   └── api.types.ts
│   ├── utils/
│   │   ├── dateUtils.ts
│   │   ├── taskUtils.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   ├── lib/
│   │   └── utils.ts           # shadcn utility
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

### Backend (`/server`)
```
server/
├── src/
│   ├── config/
│   │   ├── db.ts              # MongoDB connection
│   │   ├── passport.ts        # Google OAuth strategy
│   │   ├── firebase.ts        # FCM initialization
│   │   ├── cloudinary.ts      # File upload config
│   │   └── env.ts             # Zod-validated env vars
│   ├── models/
│   │   ├── User.model.ts
│   │   ├── Task.model.ts
│   │   ├── ReminderLog.model.ts
│   │   ├── AIConversation.model.ts
│   │   └── ActivityLog.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── task.routes.ts
│   │   ├── ai.routes.ts
│   │   ├── notification.routes.ts
│   │   ├── analytics.routes.ts
│   │   └── user.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── task.controller.ts
│   │   ├── ai.controller.ts
│   │   ├── notification.controller.ts
│   │   ├── analytics.controller.ts
│   │   └── user.controller.ts
│   ├── services/
│   │   ├── ai/
│   │   │   ├── aiChat.service.ts
│   │   │   ├── taskParser.service.ts   # NL → task
│   │   │   ├── ocr.service.ts          # Image/PDF OCR
│   │   │   └── planner.service.ts      # Daily plan generation
│   │   ├── notification/
│   │   │   ├── fcm.service.ts
│   │   │   ├── webpush.service.ts
│   │   │   └── scheduler.service.ts    # Cron jobs
│   │   ├── task.service.ts
│   │   ├── analytics.service.ts
│   │   └── cloudinary.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT verification
│   │   ├── validate.middleware.ts # Zod request validation
│   │   ├── rateLimiter.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   └── logger.middleware.ts
│   ├── validators/
│   │   ├── task.validator.ts
│   │   └── ai.validator.ts
│   ├── jobs/
│   │   ├── reminderJob.ts        # Cron: check and send reminders
│   │   └── missedTaskJob.ts      # Cron: mark overdue as missed
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── apiResponse.ts
│   │   ├── asyncHandler.ts
│   │   └── dateHelpers.ts
│   ├── types/
│   │   ├── express.d.ts          # Extend req.user
│   │   └── index.ts
│   └── app.ts                    # Express app setup
├── server.ts                     # Entry point
├── tsconfig.json
└── package.json
```

---

## 9. DESIGN SYSTEM

### Color Palette

```
Primary Background:  #0A0A0F   (near-black, deep space)
Surface:             #111118   (card background)
Surface Elevated:    #1A1A24   (elevated elements)
Border:              #2A2A38   (subtle borders)
Border Hover:        #3D3D52   (hover state borders)

Accent Primary:      #7C6AF7   (violet — trust, intelligence)
Accent Secondary:    #06B6D4   (cyan — energy, focus)
Accent Success:      #22C55E   (green — completion)
Accent Warning:      #F59E0B   (amber — attention)
Accent Danger:       #EF4444   (red — critical/missed)

Text Primary:        #F1F0FF   (near-white, cool tone)
Text Secondary:      #8B8BA7   (muted, readable)
Text Muted:          #4A4A6A   (disabled/placeholder)

Gradient Hero:       linear-gradient(135deg, #7C6AF7 0%, #06B6D4 100%)
Gradient Card:       linear-gradient(145deg, #1A1A24 0%, #111118 100%)
```

### Light Mode Colors
```
Background:          #F7F7FC
Surface:             #FFFFFF
Surface Elevated:    #F0F0F8
Border:              #E2E2EE
Text Primary:        #0A0A1A
Text Secondary:      #5A5A7A
```

### Typography
```
Display Font:        'Plus Jakarta Sans' (headings — modern, confident)
Body Font:           'Inter' (body — clean, readable)
Mono Font:           'JetBrains Mono' (code, task IDs)

Scale:
--text-xs:    0.75rem  / 12px
--text-sm:    0.875rem / 14px
--text-base:  1rem     / 16px
--text-lg:    1.125rem / 18px
--text-xl:    1.25rem  / 20px
--text-2xl:   1.5rem   / 24px
--text-3xl:   1.875rem / 30px
--text-4xl:   2.25rem  / 36px
```

### Spacing
```
4px base unit
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px
```

### Border Radius
```
sm: 6px    (buttons, inputs)
md: 10px   (cards)
lg: 16px   (modals, panels)
xl: 24px   (full panels)
pill: 9999px
```

### Shadows (Dark Mode)
```
sm: 0 1px 3px rgba(0,0,0,0.4)
md: 0 4px 16px rgba(0,0,0,0.5)
lg: 0 8px 32px rgba(0,0,0,0.6)
glow-violet: 0 0 24px rgba(124,106,247,0.2)
glow-cyan: 0 0 24px rgba(6,182,212,0.15)
```

### Category Color Map
```
Internship:      #7C6AF7  (violet)
Hackathon:       #F59E0B  (amber)
Assignment:      #3B82F6  (blue)
Meeting:         #8B5CF6  (purple)
Interview:       #EF4444  (red)
CodingContest:   #06B6D4  (cyan)
Certification:   #22C55E  (green)
Exam:            #F97316  (orange)
College:         #6366F1  (indigo)
Personal:        #EC4899  (pink)
JobApplication:  #14B8A6  (teal)
Others:          #64748B  (slate)
```

### Priority Color Map
```
Low:      #64748B   (slate gray)
Medium:   #3B82F6   (blue)
High:     #F59E0B   (amber)
Critical: #EF4444   (red, pulsing)
```

---

## 10. ENVIRONMENT VARIABLES

### Client (`.env`)
```
VITE_API_URL=http://localhost:5000/api/v1
VITE_GOOGLE_CLIENT_ID=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_VAPID_KEY=
```

### Server (`.env`)
```
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=

# JWT
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# OpenAI
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o

# Firebase Admin
FIREBASE_SERVICE_ACCOUNT_KEY=  # base64 encoded JSON

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Client URL
CLIENT_URL=http://localhost:5173

# Web Push VAPID
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_EMAIL=
```

---

## 11. DEVELOPMENT ROADMAP

### Phase 1 — MVP (Weeks 1–4)
**Goal:** Core task management + auth + dashboard working

Week 1:
- [x] Project setup (monorepo, TypeScript, linting)
- [x] Backend: Express + MongoDB + Auth (Google OAuth + JWT)
- [x] Backend: Task model + full CRUD API
- [x] Frontend: Auth flow + protected routes
- [x] Frontend: Dashboard skeleton

Week 2:
- [ ] Frontend: Task creation form (full metadata)
- [ ] Frontend: Task list with filters + search
- [ ] Frontend: Task detail page
- [ ] Backend: Reminder system (cron jobs + FCM)

Week 3:
- [ ] Frontend: Calendar view (FullCalendar)
- [ ] Frontend: Kanban board (drag & drop)
- [ ] Frontend: Notifications (push + browser)
- [ ] Backend: Analytics endpoints

Week 4:
- [ ] Frontend: Analytics dashboard
- [ ] Frontend: Settings page
- [ ] File upload (Cloudinary)
- [ ] E2E testing + bug fixes + deployment

### Phase 2 — AI Core (Weeks 5–8)
- AI Chat Assistant (ChatGPT panel)
- AI task creation from natural language
- Image OCR → task creation
- PDF OCR → task extraction
- Voice input
- AI-generated daily plans

### Phase 3 — Integrations (Weeks 9–12)
- Gmail integration
- Google Calendar sync
- Chrome Extension
- Mobile PWA optimization

---

## 12. SEQUENCE DIAGRAMS

### Task Reminder Flow
```
[Cron Job (every 5min)]
    → Query tasks WHERE deadline WITHIN next 1h AND reminder NOT sent
    → For each task:
        → Send FCM push to user's device
        → Mark reminder.sent = true
        → Log to reminders_log
        → Update activity_log
```

### AI Chat Flow
```
[User types message]
    → POST /api/v1/ai/chat { message, conversationId }
    → Load conversation history from DB
    → Fetch relevant tasks (all tasks for this user)
    → Build system prompt with task context
    → Call OpenAI API (gpt-4o)
    → Stream response back to client
    → Save message pair to ai_conversations
    → If AI creates task from chat → POST /tasks
```

### OCR Flow
```
[User uploads image/PDF]
    → POST /api/v1/ai/create-from-image (multipart)
    → Save to Cloudinary temporarily
    → Send to OpenAI Vision API with extraction prompt
    → Parse structured JSON response
    → Return pre-filled task form to frontend
    → User reviews + confirms
    → POST /tasks with source: 'ocr'
```

---

## 13. DEPLOYMENT PLAN

### Frontend → Vercel
```
- Connect GitHub repo
- Root: /client
- Build: npm run build
- Output: dist/
- Env vars: set in Vercel dashboard
```

### Backend → Railway
```
- Connect GitHub repo
- Root: /server
- Build: npm run build
- Start: npm start
- Env vars: set in Railway dashboard
- Health check: GET /health
```

### Database → MongoDB Atlas
```
- Cluster: M0 (free) → M10 (production)
- Region: Mumbai (ap-south-1) for Indian users
- Network access: Allow Railway IPs + local IP
- Indexes:
  - tasks: { userId: 1, deadline: 1 }
  - tasks: { userId: 1, status: 1 }
  - tasks: { userId: 1, category: 1 }
  - tasks: { title: "text", description: "text" }  (text search)
  - users: { email: 1 } unique
```

---

## 14. SECURITY CHECKLIST

- [x] Google OAuth 2.0 (no password storage)
- [x] JWT with short expiry (7d) + refresh token (30d)
- [x] HTTP-only cookies for refresh token
- [x] Rate limiting on all API routes
- [x] Helmet.js security headers
- [x] Input validation with Zod on all endpoints
- [x] User can only access their own tasks (userId filter)
- [x] File upload validation (type + size limits)
- [x] CORS configured for specific origins only
- [x] Environment variables, no secrets in code

---

## 15. TESTING STRATEGY

### Backend
- Unit tests: Jest for services (task logic, AI parsers)
- Integration tests: Supertest for API routes
- Coverage target: 70%+

### Frontend
- Component tests: React Testing Library
- E2E: Playwright (auth flow, task CRUD, AI chat)
- Coverage target: 60%+

---

*PRD Version 1.0 — CogniTrack*
*Built by: [Your Name] | Architecture designed for scale*
