const LEVEL_CONFIG = {
  low: {
    pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    dot: 'bg-emerald-500',
    glow: 'shadow-emerald-100',
    label: 'Low',
    priority: 0,
  },
  medium: {
    pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    dot: 'bg-amber-500',
    glow: 'shadow-amber-100',
    label: 'Medium',
    priority: 1,
  },
  high: {
    pill: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    dot: 'bg-red-500',
    glow: 'shadow-red-100',
    label: 'High',
    priority: 2,
  },
  closed: {
    pill: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
    dot: 'bg-gray-400',
    glow: '',
    label: 'Closed',
    priority: 99,
  },
};

function findBestOption(items) {
  let best = null;
  let bestPriority = Infinity;
  for (const [name, level] of Object.entries(items)) {
    if (level === 'closed') continue;
    const priority = LEVEL_CONFIG[level]?.priority ?? 99;
    if (priority < bestPriority) {
      bestPriority = priority;
      best = name;
    }
  }
  return best;
}

export default function StatusCard({ title, icon, items, type }) {
  const best = findBestOption(items);

  return (
    <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100/60">
        <h2 className="text-[15px] font-bold text-gray-800 flex items-center gap-2.5">
          <span className="text-xl">{icon}</span>
          {title}
        </h2>
      </div>

      {/* Items */}
      <div className="p-3 space-y-2">
        {Object.entries(items).map(([name, level]) => {
          const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.low;
          const isBest = name === best;
          const isClosed = level === 'closed';

          return (
            <div
              key={name}
              className={`relative flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 hover-lift ${
                isBest
                  ? 'bg-emerald-50/80 ring-2 ring-emerald-200/60'
                  : isClosed
                    ? 'bg-gray-50/80 opacity-60'
                    : 'bg-white/60 hover:bg-white/90'
              }`}
            >
              {/* Best badge */}
              {isBest && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full animate-pulse-badge shadow-lg shadow-emerald-500/25">
                  ★ Best
                </span>
              )}

              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${
                  isClosed ? 'text-gray-400 line-through' : 'text-gray-700'
                }`}>
                  {type === 'gate' ? `Gate ${name}` : name}
                </span>
                {isClosed && (
                  <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-md uppercase">
                    Closed
                  </span>
                )}
              </div>

              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.pill}`}>
                <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                {config.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
