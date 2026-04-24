# Smart Stadium Flow -- Copilot Build Spec

## Root Directory

crowd-management/

## Objective

Lightweight mobile-first system for: - Gate crowd status - Food court
status - Live announcements

------------------------------------------------------------------------

## Tech Stack

Backend: FastAPI\
Frontend: React (Vite + Tailwind)

------------------------------------------------------------------------

## Project Structure

    crowd-management/
    │
    ├── backend/
    │   ├── main.py
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── App.jsx
    │   │   ├── components/
    │   │   └── services/

------------------------------------------------------------------------

## Backend Setup

    pip install fastapi uvicorn

Run:

    uvicorn main:app --host 0.0.0.0 --port 8000

------------------------------------------------------------------------

## Core State

    state = {
      "gates": {"A":"low","B":"medium","C":"high"},
      "food": {"stall1":"low","stall2":"medium","stall3":"high"},
      "announcements":[]
    }

------------------------------------------------------------------------

## API Endpoints

GET /status\
POST /update/gate\
POST /update/food\
POST /announcement

------------------------------------------------------------------------

## Frontend Setup

    npm create vite@latest frontend
    npm install
    npm install axios tailwindcss

------------------------------------------------------------------------

## Polling

Fetch /status every 5 seconds

------------------------------------------------------------------------

## UX Rules

-   Single screen
-   Color coded
-   Always show best option

------------------------------------------------------------------------

## Deployment (GCP)

### Backend (Cloud Run)

    gcloud builds submit --tag gcr.io/PROJECT_ID/backend
    gcloud run deploy backend --image gcr.io/PROJECT_ID/backend --platform managed

### Frontend (Firebase Hosting)

    npm run build
    firebase deploy

------------------------------------------------------------------------

## Final Goal

Answer instantly: Where should I go right now?
