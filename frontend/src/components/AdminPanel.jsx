import { useState } from 'react';
import { updateGate, updateFood, postAnnouncement } from '../services/api';

const LEVELS = ['low', 'medium', 'high'];

const LEVEL_COLORS = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
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
    showFeedback(`Gate ${gate} updated to ${level}`);
    onRefresh();
  };

  const handleFoodChange = async (stall, level) => {
    await updateFood(stall, level);
    showFeedback(`${stall} updated to ${level}`);
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
    <div className="space-y-6">
      {/* Feedback toast */}
      {feedback && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium animate-fade-in">
          ✓ {feedback}
        </div>
      )}

      {/* Gate Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🚧</span>
            Update Gates
          </h2>
        </div>
        <div className="p-4 space-y-3">
          {Object.entries(gates).map(([gate, level]) => (
            <div key={gate} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="font-medium text-gray-700">Gate {gate}</span>
              <div className="flex gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => handleGateChange(gate, l)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      level === l
                        ? `${LEVEL_COLORS[l]} text-white shadow-md scale-105`
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            Update Food Stalls
          </h2>
        </div>
        <div className="p-4 space-y-3">
          {Object.entries(food).map(([stall, level]) => (
            <div key={stall} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="font-medium text-gray-700">{stall}</span>
              <div className="flex gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => handleFoodChange(stall, l)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      level === l
                        ? `${LEVEL_COLORS[l]} text-white shadow-md scale-105`
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">📣</span>
            Send Announcement
          </h2>
        </div>
        <form onSubmit={handleAnnouncement} className="p-4 space-y-3">
          <textarea
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="Type your announcement here..."
            rows={3}
            maxLength={500}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none resize-none text-sm"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {announcementText.length}/500
            </span>
            <button
              type="submit"
              disabled={loading || !announcementText.trim()}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm shadow-md"
            >
              {loading ? 'Sending...' : '📢 Broadcast'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
