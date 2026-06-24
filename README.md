# DeadlineAI

> Your AI-powered second brain for deadlines, tasks, and career goals.

Built for college students, job seekers, and professionals who need to track internship applications, hackathons, assignments, interviews, and every other deadline — all in one place.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| State | Zustand |
| Animations | Framer Motion |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas + Mongoose |
| Auth | Google OAuth 2.0 + JWT |
| AI | OpenAI GPT-4o (chat, OCR, task parsing) |
| Notifications | Firebase Cloud Messaging + Web Push |
| Calendar | FullCalendar |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Getting Started

### Prerequisites
- Node.js 22 LTS
- MongoDB Atlas cluster
- Google Cloud OAuth credentials
- OpenAI API key

### Setup

```powershell
# 1. Clone and install
git clone https://github.com/yourusername/deadlineai.git
Set-Location deadlineai
npm install
Set-Location server; npm install; Set-Location ..
Set-Location client; npm install; Set-Location ..

# 2. Configure environment
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
# Fill in your values in both .env files

# 3. Run development
# Terminal 1 — backend
Set-Location server
npm run dev

# Terminal 2 — frontend
Set-Location client
npm run dev
```

The app runs at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/v1
- Health check: http://localhost:5000/health

---

## Features

- **Dashboard** — Today's tasks, upcoming deadlines, productivity score, recent activity
- **Tasks** — Full CRUD with 12 categories, 4 priorities, reminders, attachments, required documents
- **Kanban** — Drag-and-drop status board
- **Calendar** — Monthly / weekly / list views via FullCalendar
- **AI Assistant** — ChatGPT-style chat that knows your tasks
- **AI Task Creator** — Type a deadline in plain English, AI creates the task
- **OCR Upload** — Screenshot or PDF → tasks extracted automatically
- **Analytics** — Completion rates, category breakdown, weekly trends
- **Push Notifications** — FCM + Web Push reminders before every deadline
- **Settings** — Theme toggle, notification preferences

---

## Environment Variables

See `server/.env.example` and `client/.env.example` for all required variables.

---

## Deployment

### Frontend → Vercel
1. Connect GitHub repo to Vercel
2. Set root to `/client`
3. Add all `VITE_*` environment variables
4. Deploy

### Backend → Railway
1. Connect GitHub repo to Railway
2. Set root to `/server`
3. Add all server environment variables
4. Set start command: `npm start`
5. Deploy

### Database → MongoDB Atlas
- Use M0 (free) for development
- Whitelist Railway's IP range in Atlas Network Access
- Create indexes (auto-created on first server start via Mongoose)