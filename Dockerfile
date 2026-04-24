# ============================================================
# Stage 1: Build React frontend
# ============================================================
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

# Install deps first (layer caching)
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy source and build
COPY frontend/ ./
RUN npm run build

# ============================================================
# Stage 2: Python backend + serve static files
# ============================================================
FROM python:3.12-slim

WORKDIR /app

# Install Python deps
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Copy built frontend into /app/static
COPY --from=frontend-build /app/frontend/dist ./static

# Cloud Run injects PORT env var (default 8080)
ENV PORT=8080

EXPOSE ${PORT}

# Start uvicorn — Cloud Run sends traffic to $PORT
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}
