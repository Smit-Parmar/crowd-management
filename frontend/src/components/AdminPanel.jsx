import { useState } from 'react';
import { updateGate, updateFood, postAnnouncement } from '../services/api';

const LEVELS = ['low', 'medium', 'high', 'closed'];

const LEVEL_STYLES = {
  low: { active: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-105', label: 'Low' },
  medium: { active: 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-105', label: 'Medium' },
  high: { active: 'bg-red-500 text-white shadow-md shadow-red-500/25 scale-105', label: 'High' },
  closed: { active: 'bg-gray-500 text-white shadow-md shadow-gray-500/25 scale-105', label: 'Closed' },
};

export default function AdminPanel({ gates, food, onRefresh }) {
  const [announcementText, setAnnouncementText] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleGateChange = async (gate, level) => {
    await updateGate(gate, level);
    showFeedback(`Gate ${gate} → ${level}`);
    onRefresh();
  };

  const handleFoodChange = async (stall, level) => {
    await updateFood(stall, level);
    showFeedback(`${stall} → ${level}`);
    onRefresh();
  };

  const handleAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setLoading(true);
    await postAnnouncement(announcementText.trim());
    setAnnouncementText('');
    setLoading(false);
    showFeedback('Announcement sent!');
    onRefresh();
  };

  return (
    <div className="space-y-5">
      {/* Feedback toast */}
      {feedback && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 z-50 text-sm font-semibold">
          ✓ {feedback}
        </div>
      )}

      {/* Admin badge */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-full ring-1 ring-orange-200">
          Admin Panel
        </span>
      </div>

      {/* Gate Controls */}
      <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100/60">
          <h2 className="text-[15px] font-bold text-gray-800 flex items-center gap-2.5">
            <span className="text-xl">🚧</span>
            Gate Status
          </h2>
        </div>
        <div className="p-3 space-y-2">
          {Object.entries(gates).map(([gate, level]) => (
            <div key={gate} className="flex items-center justify-between px-4 py-3 bg-white/50 rounded-xl">
              <span className="text-sm font-semibold text-gray-700">Gate {gate}</span>
              <div className="flex gap-1.5">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => handleGateChange(gate, l)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all duration-200 ${
                      level === l
                        ? LEVEL_STYLES[l].active
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Food Stall Controls */}
      <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100/60">
          <h2 className="text-[15px] font-bold text-gray-800 flex items-center gap-2.5">
            <span className="text-xl">🍔</span>
            Food Stall Status
          </h2>
        </div>
        <div className="p-3 space-y-2">
          {Object.entries(food).map(([stall, level]) => (
            <div key={stall} className="flex items-center justify-between px-4 py-3 bg-white/50 rounded-xl">
              <span className="text-sm font-semibold text-gray-700">{stall}</span>
              <div className="flex gap-1.5">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => handleFoodChange(stall, l)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all duration-200 ${
                      level === l
                        ? LEVEL_STYLES[l].active
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement Form */}
      <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100/60">
          <h2 className="text-[15px] font-bold text-gray-800 flex items-center gap-2.5">
            <span className="text-xl">📣</span>
            Broadcast Announcement
          </h2>
        </div>
        <form onSubmit={handleAnnouncement} className="p-4 space-y-3">
          <textarea
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="Type your announcement here..."
            rows={3}
            maxLength={500}
            className="w-full p-3.5 bg-white/60 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-transparent outline-none resize-none text-sm placeholder:text-gray-300 transition-all"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-300 font-mono tabular-nums">
              {announcementText.length}/500
            </span>
            <button
              type="submit"
              disabled={loading || !announcementText.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm shadow-lg shadow-blue-500/20"
            >
              {loading ? 'Sending...' : '📢 Broadcast'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
