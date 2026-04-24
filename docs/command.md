# Smart Stadium Flow — Developer Setup Guide

## Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **npm** 9+

---

## Quick Start (2 terminals)

### Terminal 1 — Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

Backend runs at **http://localhost:8000**
API docs at **http://localhost:8000/docs**

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## Project Structure

```
crowd-management/
├── backend/
│   ├── main.py              # FastAPI app — all endpoints
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main layout, polling, view toggle
│   │   ├── main.jsx         # React entry point
│   │   ├── index.css        # Tailwind import + custom animations
│   │   ├── components/
│   │   │   ├── StatusCard.jsx    # Color-coded gate/food cards
│   │   │   ├── Announcements.jsx # Live announcement feed
│   │   │   └── AdminPanel.jsx    # Management controls
│   │   └── services/
│   │       └── api.js       # Axios API layer
│   ├── index.html
│   ├── vite.config.js       # Vite config + API proxy
│   └── package.json
└── crowd-management.md      # Build spec
```

---

## API Endpoints

| Method | Endpoint           | Description                     |
|--------|--------------------|---------------------------------|
| GET    | `/status`          | Full venue state (gates, food, announcements) |
| POST   | `/update/gate`     | Update a gate's crowd level     |
| POST   | `/update/food`     | Update a food stall's crowd level |
| POST   | `/announcement`    | Push a new announcement         |
| GET    | `/health`          | Health check                    |

### Example API calls

```bash
# Get current status
curl http://localhost:8000/status

# Update gate crowd level
curl -X POST http://localhost:8000/update/gate \
  -H "Content-Type: application/json" \
  -d '{"gate": "A", "level": "high"}'

# Update food stall crowd level
curl -X POST http://localhost:8000/update/food \
  -H "Content-Type: application/json" \
  -d '{"stall": "Pizza Palace", "level": "low"}'

# Send an announcement
curl -X POST http://localhost:8000/announcement \
  -H "Content-Type: application/json" \
  -d '{"message": "Gates open in 10 minutes!"}'
```

Valid crowd levels: `low`, `medium`, `high`, `closed`

---

## Frontend Proxy

- **Dev**: Vite proxy rewrites `/api/*` → `localhost:8000/*`. Env var `VITE_API_BASE=/api` (set in `.env.development`).
- **Prod**: React build uses `VITE_API_BASE=""` (set in `.env.production`) — same origin, no proxy needed.

---

## Production Build (Local)

### Frontend

```bash
cd frontend
npm run build
```

Static files output to `frontend/dist/`.

### Backend

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## Deploy to GCP Cloud Run

### Prerequisites

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed
2. A GCP project with billing enabled
3. Authenticated: `gcloud auth login`

### Step-by-step

```bash
# 1. Set your project
gcloud config set project YOUR_PROJECT_ID

# 2. Enable required APIs (one-time)
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

# 3. Deploy (builds Docker image in the cloud + deploys)
gcloud run deploy smart-stadium \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi
```

That's it. GCP will:
- Build the Docker image using Cloud Build
- Push it to Artifact Registry
- Deploy it to Cloud Run
- Give you a URL like `https://smart-stadium-xxxxx-uc.a.run.app`

### Test locally with Docker first (optional)

```bash
# Build
docker build -t smart-stadium .

# Run
docker run -p 8080:8080 smart-stadium

# Open http://localhost:8080
```

### Environment variables

| Variable | Where | Dev value | Prod value |
|----------|-------|-----------|------------|
| `VITE_API_BASE` | Frontend (build-time) | `/api` | `` (empty) |
| `PORT` | Backend (runtime) | `8000` | `8080` (Cloud Run sets this) |

### How it works in production

```
Browser → Cloud Run (port 8080)
          ├── /status, /update/*, /announcement  → FastAPI API
          ├── /assets/*                          → Static JS/CSS
          └── /* (everything else)               → index.html (React SPA)
```

---
