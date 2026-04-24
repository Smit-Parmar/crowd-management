export default function Announcements({ announcements }) {
  if (!announcements || announcements.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center text-gray-400">
        No announcements yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">📢</span>
          Live Announcements
        </h2>
      </div>

      {/* Announcement list */}
      <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
        {announcements.map((item, idx) => (
          <div
            key={`${item.timestamp}-${idx}`}
            className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
              idx === 0
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50 border border-transparent'
            }`}
          >
            <span className="text-xs font-mono text-gray-400 mt-0.5 shrink-0">
              {item.timestamp}
            </span>
            <p className={`text-sm ${idx === 0 ? 'text-blue-800 font-medium' : 'text-gray-600'}`}>
              {item.message}
            </p>
            {idx === 0 && (
              <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full shrink-0">
                NEW
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
