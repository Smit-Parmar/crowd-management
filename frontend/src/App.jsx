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

  const loadStatus = useCallback(async () => {
    try {
      const data = await fetchStatus();
      // Detect new announcements and trigger notification
      if (data.announcements?.length > prevAnnouncementCount.current && prevAnnouncementCount.current > 0) {
        setNotification(data.announcements[0]);
      }
      prevAnnouncementCount.current = data.announcements?.length || 0;
      setStatus(data);
      setError(null);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setError('Unable to connect to stadium server.');
    }
  }, []);

  // Poll for status every 5 seconds
  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Announcement notification toast */}
      <NotificationToast
        announcement={notification}
        onDismiss={() => setNotification(null)}
      />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏟️</span>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 leading-tight">
                Smart Stadium
              </h1>
              <p className="text-xs text-gray-400">Live crowd status</p>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setView('attendee')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                view === 'attendee'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              👤 Attendee
            </button>
            <button
              onClick={() => setView('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                view === 'admin'
                  ? 'bg-white text-orange-600 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ⚙️ Admin
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Loading state */}
        {!status && !error && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <p className="text-gray-500 text-sm">Loading stadium data...</p>
            </div>
          </div>
        )}

        {status && view === 'attendee' && (
          <>
            {/* Quick summary bar */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live — updates every 5s
                </div>
                {lastUpdated && (
                  <span className="text-xs text-gray-400">
                    Last update: {lastUpdated}
                  </span>
                )}
              </div>
            </div>

            {/* Stadium Map */}
            <StadiumMap gates={status.gates} />

            {/* Status cards grid */}
            <div className="grid md:grid-cols-2 gap-6">
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
      <footer className="text-center py-6 text-xs text-gray-400">
        Smart Stadium Flow v1.0 — Built for better event experiences
      </footer>
    </div>
  );
}
