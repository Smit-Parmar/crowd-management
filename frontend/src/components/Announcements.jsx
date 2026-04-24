export default function Announcements({ announcements }) {
  if (!announcements || announcements.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-gray-400 text-sm">
        No announcements yet.
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100/60">
        <h2 className="text-[15px] font-bold text-gray-800 flex items-center gap-2.5">
          <span className="text-xl">📢</span>
          Live Announcements
        </h2>
      </div>

      {/* Announcement list */}
      <div className="p-3 space-y-1.5 max-h-72 overflow-y-auto">
        {announcements.map((item, idx) => (
          <div
            key={`${item.timestamp}-${idx}`}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              idx === 0
                ? 'bg-blue-50/60 ring-1 ring-blue-200/50'
                : 'bg-white/40 hover:bg-white/70'
            }`}
          >
            <span className="text-[11px] font-mono text-gray-400 mt-0.5 shrink-0 tabular-nums">
              {item.timestamp}
            </span>
            <p className={`text-sm leading-relaxed ${
              idx === 0 ? 'text-blue-800 font-medium' : 'text-gray-500'
            }`}>
              {item.message}
            </p>
            {idx === 0 && (
              <span className="ml-auto text-[10px] bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-0.5 rounded-full shrink-0 font-bold uppercase tracking-wider">
                New
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
