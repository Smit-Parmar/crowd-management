const LEVEL_CONFIG = {
  low: {
    color: 'bg-green-100 border-green-400 text-green-800',
    dot: 'bg-green-500',
    label: 'Low',
    priority: 0,
  },
  medium: {
    color: 'bg-yellow-100 border-yellow-400 text-yellow-800',
    dot: 'bg-yellow-500',
    label: 'Medium',
    priority: 1,
  },
  high: {
    color: 'bg-red-100 border-red-400 text-red-800',
    dot: 'bg-red-500',
    label: 'High',
    priority: 2,
  },
};

function findBestOption(items) {
  let best = null;
  let bestPriority = Infinity;
  for (const [name, level] of Object.entries(items)) {
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {title}
        </h2>
      </div>

      {/* Items */}
      <div className="p-4 space-y-3">
        {Object.entries(items).map(([name, level]) => {
          const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.low;
          const isBest = name === best;

          return (
            <div
              key={name}
              className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                isBest
                  ? 'border-green-400 bg-green-50 ring-2 ring-green-200'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              {/* Best badge */}
              {isBest && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse-badge shadow-md">
                  ★ Best
                </span>
              )}

              <div className="flex items-center gap-3">
                <span className="text-lg font-medium text-gray-700">
                  {type === 'gate' ? `Gate ${name}` : name}
                </span>
              </div>

              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${config.color}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                {config.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
