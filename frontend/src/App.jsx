import { useState, useEffect, useCallback, useRef } from 'react';
import StatusCard from './components/StatusCard';
import Announcements from './components/Announcements';
import AdminPanel from './components/AdminPanel';
import StadiumMap from './components/StadiumMap';
import NotificationToast from './components/NotificationToast';
import { fetchStatus } from './services/api';

const POLL_INTERVAL = 5000;

export default function App() {
  const [status, setStatus] = useState(null);
  const [view, setView] = useState('attendee'); // 'attendee' | 'admin'
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [notification, setNotification] = useState(null);
  const prevAnnouncementCount = useRef(0);
  const viewRef = useRef(view);

  // Keep ref in sync so the async callback reads the latest view
  useEffect(() => { viewRef.current = view; }, [view]);

  const loadStatus = useCallback(async () => {
    try {
      const data = await fetchStatus();
      // Only trigger notification in attendee view
      if (
        viewRef.current === 'attendee' &&
        data.announcements?.length > prevAnnouncementCount.current &&
        prevAnnouncementCount.current > 0
      ) {
        setNotification(data.announcements[0]);
      }
      prevAnnouncementCount.current = data.announcements?.length || 0;
      setStatus(data);
      setError(null);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setError('Unable to connect to Move Smart server.');
    }
  }, []);

  // Poll for status every 5 seconds
  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadStatus]);

  // Dismiss notification when switching to admin
  useEffect(() => {
    if (view === 'admin') setNotification(null);
  }, [view]);

  const openGates = status
    ? Object.values(status.gates).filter((l) => l !== 'closed').length
    : 0;
  const totalGates = status ? Object.keys(status.gates).length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30">
      {/* Announcement notification toast — only in attendee view */}
      {view === 'attendee' && (
        <NotificationToast
          announcement={notification}
          onDismiss={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl sticky top-0 z-40 border-b border-white/40 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-xl">🏟️</span>
            </div>
            <div>
              <h1 className="text-lg font-extrabold gradient-text leading-tight tracking-tight">
                Move Smart
              </h1>
              <p className="text-[11px] text-gray-400 font-medium tracking-wide">LIVE CROWD STATUS</p>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex bg-gray-100/80 backdrop-blur rounded-2xl p-1 gap-1">
            <button
              onClick={() => setView('attendee')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                view === 'attendee'
                  ? 'bg-white text-blue-600 shadow-md shadow-blue-500/10'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              👤 Attendee
            </button>
            <button
              onClick={() => setView('admin')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                view === 'admin'
                  ? 'bg-white text-orange-600 shadow-md shadow-orange-500/10'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              ⚙️ Admin
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Error state */}
        {error && (
          <div className="glass-card rounded-2xl px-5 py-4 flex items-center gap-3 border-red-200/60 bg-red-50/60">
            <span className="text-xl">⚠️</span>
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {!status && !error && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 border-[3px] border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 text-sm font-medium">Loading stadium data...</p>
            </div>
          </div>
        )}

        {status && view === 'attendee' && (
          <>
            {/* Quick summary bar */}
            <div className="glass-card rounded-2xl shadow-sm p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                    </span>
                    <span className="font-medium">Live</span>
                  </div>
                  <span className="text-gray-200">|</span>
                  <span className="text-xs text-gray-400 font-medium">
                    {openGates}/{totalGates} gates open
                  </span>
                </div>
                {lastUpdated && (
                  <span className="text-[11px] text-gray-400 font-mono">
                    Updated {lastUpdated}
                  </span>
                )}
              </div>
            </div>

            {/* Stadium Map */}
            <StadiumMap gates={status.gates} />

            {/* Status cards grid */}
            <div className="grid md:grid-cols-2 gap-5">
              <StatusCard
                title="Entry Gates"
                icon="🚪"
                items={status.gates}
                type="gate"
              />
              <StatusCard
                title="Food & Drinks"
                icon="🍕"
                items={status.food}
                type="food"
              />
            </div>

            {/* Announcements */}
            <Announcements announcements={status.announcements} />
          </>
        )}

        {status && view === 'admin' && (
          <AdminPanel
            gates={status.gates}
            food={status.food}
            onRefresh={loadStatus}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-[11px] text-gray-300 font-medium tracking-wide">
        MOVE SMART v1.0 — BUILT FOR BETTER EVENT EXPERIENCES
      </footer>
    </div>
  );
}
