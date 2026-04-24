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

Valid crowd levels: `low`, `medium`, `high`

---

## Frontend Proxy

The Vite dev server proxies `/api/*` requests to the backend at `localhost:8000`. The frontend code calls `/api/status` which maps to `http://localhost:8000/status`. No CORS issues in development.

---

## Production Build

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

## Deployment (GCP)

### Backend → Cloud Run

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/backend
gcloud run deploy backend --image gcr.io/PROJECT_ID/backend --platform managed
```

### Frontend → Firebase Hosting

```bash
cd frontend
npm run build
firebase deploy
```
