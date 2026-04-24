import axios from 'axios';

// In dev: Vite proxy rewrites /api/* → localhost:8000/*
// In prod: same origin, no prefix needed (VITE_API_BASE="")
const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

export async function fetchStatus() {
  const { data } = await api.get('/status');
  return data;
}

export async function updateGate(gate, level) {
  const { data } = await api.post('/update/gate', { gate, level });
  return data;
}

export async function updateFood(stall, level) {
  const { data } = await api.post('/update/food', { stall, level });
  return data;
}

export async function postAnnouncement(message) {
  const { data } = await api.post('/announcement', { message });
  return data;
}
