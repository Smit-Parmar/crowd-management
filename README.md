# 🏟️ Move Smart

> Real-time crowd management system for large-scale sporting venues — built at a hackathon in 1.5 hours.

### 🔴 [Live Demo → https://smart-stadium-879007477472.us-central1.run.app](https://smart-stadium-879007477472.us-central1.run.app/)

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Deploy](https://img.shields.io/badge/Deploy-GCP_Cloud_Run-4285F4?logo=googlecloud)](https://cloud.google.com/run)

---

## The Problem

Attending a live sporting event at a 50,000+ seat stadium should be thrilling — but the reality often involves:

- **Long queues at gates** with no idea which entrance is least crowded
- **Guessing which food stall** has the shortest wait time
- **Missing announcements** about gate closures, weather delays, or schedule changes
- **No wayfinding** — where are the nearest restrooms or water stations?

Thousands of fans make decisions blindly, leading to bottlenecks, frustration, and wasted time. Venue staff lack a simple way to broadcast real-time updates to everyone at once.

## The Solution

**Move Smart** is a lightweight, mobile-first web app that gives attendees and venue staff a shared real-time view of the stadium.

### For Attendees (👤)
- **Live gate status** — color-coded (green/yellow/red) with "★ Best" gate highlighted
- **Food stall wait times** — see which stall has the shortest queue
- **Interactive stadium map** — SVG cricket stadium showing gate locations, drinking water stations, and restrooms
- **Push notifications** — slide-in toast alerts when new announcements are broadcast
- **Auto-refresh** — data updates every 5 seconds, zero manual effort

### For Venue Staff (⚙️ Admin)
- **One-tap crowd controls** — update any gate or food stall to low / medium / high / closed
- **Broadcast announcements** — type and send, instantly visible to all attendees
- **Gate closure support** — mark gates as closed with clear visual indicators

---

## Demo

| Attendee View | Stadium Map | Admin Panel |
|:---:|:---:|:---:|
| Color-coded gates & food stalls with "Best" badges | SVG cricket stadium with gates, water, restrooms | Toggle crowd levels & broadcast announcements |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python, FastAPI, Pydantic v2, Uvicorn |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Axios |
| **Deployment** | Docker (multi-stage), GCP Cloud Run |

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Cloud Run Container                │
│                                                      │
│   ┌──────────────┐    ┌───────────────────────────┐  │
│   │   FastAPI     │    │   React Static Build      │  │
│   │              │    │                           │  │
│   │  /status     │    │  /assets/* → JS, CSS      │  │
│   │  /update/*   │    │  /*       → index.html    │  │
│   │  /announcement│    │         (SPA catch-all)   │  │
│   │  /health     │    │                           │  │
│   └──────────────┘    └───────────────────────────┘  │
│                                                      │
│   In-memory state (gates, food, announcements)       │
└──────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+

### Run locally (2 terminals)

**Terminal 1 — Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — the Vite dev server proxies API calls to the backend automatically.

---

## Project Structure

```
crowd-management/
├── backend/
│   ├── main.py               # FastAPI app — API + static file serving
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main layout, polling, view toggle
│   │   ├── components/
│   │   │   ├── StatusCard.jsx     # Color-coded gate/food cards
│   │   │   ├── StadiumMap.jsx     # SVG cricket stadium map
│   │   │   ├── Announcements.jsx  # Live announcement feed
│   │   │   ├── AdminPanel.jsx     # Management controls
│   │   │   └── NotificationToast.jsx # Slide-in notifications
│   │   └── services/
│   │       └── api.js         # Axios API layer
│   ├── .env.development       # Dev API base URL
│   └── .env.production        # Prod API base URL
├── docs/
│   ├── command.md             # Developer setup & deploy guide
│   └── crowd-management.md   # Original build spec
├── Dockerfile                 # Multi-stage build (Node + Python)
├── .dockerignore
└── .gitignore
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/status` | Full venue state (gates, food, announcements) |
| `POST` | `/update/gate` | Update a gate's crowd level |
| `POST` | `/update/food` | Update a food stall's crowd level |
| `POST` | `/announcement` | Push a new live announcement |
| `GET` | `/health` | Health check |

**Crowd levels:** `low` · `medium` · `high` · `closed`

---

## Deploy to GCP Cloud Run

```bash
gcloud config set project YOUR_PROJECT_ID

gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

gcloud run deploy move-smart \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi
```

Or test with Docker locally:

```bash
docker build -t move-smart .
docker run -p 8080:8080 move-smart
# Open http://localhost:8080
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Single container** | Simpler than separate frontend hosting — FastAPI serves both API and static files |
| **In-memory state** | No database needed for a hackathon demo; easy to swap for Redis/Firestore later |
| **Polling over WebSockets** | 5s polling is "real-time enough" and drastically simpler to build and deploy |
| **SVG stadium map** | No mapping library dependency; lightweight, responsive, and fully customizable |
| **Environment-based API URL** | `.env.development` uses Vite proxy, `.env.production` uses same-origin — zero config switching |

---

## Future Improvements

- [ ] Persistent storage (Firestore / Redis) for state across restarts
- [ ] WebSocket support for true real-time updates
- [ ] Authentication for admin panel
- [ ] Multiple venue support
- [ ] Historical analytics dashboard
- [ ] Push notifications via Service Workers

---

## Team

Built with GitHub Copilot during a vibe coding hackathon session.

## License

MIT
