/**
 * Interactive SVG cricket stadium map.
 * Shows gates (A-D), drinking water stations, and restrooms
 * with live crowd-level colours.
 */

const GATE_COLOR = {
  low: '#22c55e',      // green-500
  medium: '#eab308',   // yellow-500
  high: '#ef4444',     // red-500
  closed: '#6b7280',   // gray-500
};

const GATE_BG = {
  low: '#dcfce7',
  medium: '#fef9c3',
  high: '#fee2e2',
  closed: '#e5e7eb',
};

const GATE_LABEL = {
  low: 'Low Crowd',
  medium: 'Medium',
  high: 'High Crowd',
  closed: 'Closed',
};

/* Gate positions around the oval (clock positions) */
const GATES = [
  { id: 'A', angle: 0,   label: 'Gate A (North)' },
  { id: 'B', angle: 90,  label: 'Gate B (East)' },
  { id: 'C', angle: 180, label: 'Gate C (South)' },
  { id: 'D', angle: 270, label: 'Gate D (West)' },
];

/* Facilities placed inside the stadium */
const FACILITIES = [
  { type: 'water', icon: '🚰', label: 'Drinking Water', x: 200, y: 115 },
  { type: 'water', icon: '🚰', label: 'Drinking Water', x: 400, y: 115 },
  { type: 'water', icon: '🚰', label: 'Drinking Water', x: 300, y: 385 },
  { type: 'restroom', icon: '🚻', label: 'Restrooms', x: 145, y: 200 },
  { type: 'restroom', icon: '🚻', label: 'Restrooms', x: 455, y: 200 },
  { type: 'restroom', icon: '🚻', label: 'Restrooms', x: 145, y: 310 },
  { type: 'restroom', icon: '🚻', label: 'Restrooms', x: 455, y: 310 },
];

function polarToXY(cx, cy, rx, ry, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + rx * Math.cos(rad), y: cy + ry * Math.sin(rad) };
}

export default function StadiumMap({ gates }) {
  const cx = 300, cy = 250;
  const outerRx = 240, outerRy = 200;
  const innerRx = 150, innerRy = 120;

  return (
    <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100/60">
        <h2 className="text-[15px] font-bold text-gray-800 flex items-center gap-2.5">
          <span className="text-xl">🗺️</span>
          Stadium Map
        </h2>
        <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Live gate status with facilities</p>
      </div>

      <div className="p-4 flex justify-center">
        <svg viewBox="0 0 600 500" className="w-full max-w-lg" role="img" aria-label="Cricket stadium map">
          {/* Outer stadium oval */}
          <ellipse cx={cx} cy={cy} rx={outerRx} ry={outerRy}
            fill="#f0fdf4" stroke="#86efac" strokeWidth="3" />

          {/* Stands / seating band */}
          <ellipse cx={cx} cy={cy} rx={outerRx - 30} ry={outerRy - 25}
            fill="#bbf7d0" stroke="#86efac" strokeWidth="1" strokeDasharray="6 3" />

          {/* Inner playing field */}
          <ellipse cx={cx} cy={cy} rx={innerRx} ry={innerRy}
            fill="#dcfce7" stroke="#4ade80" strokeWidth="2" />

          {/* Pitch rectangle */}
          <rect x={cx - 8} y={cy - 40} width="16" height="80" rx="3"
            fill="#a3e635" stroke="#65a30d" strokeWidth="1.5" />

          {/* Pitch creases */}
          <line x1={cx - 14} y1={cy - 30} x2={cx + 14} y2={cy - 30} stroke="#65a30d" strokeWidth="1" />
          <line x1={cx - 14} y1={cy + 30} x2={cx + 14} y2={cy + 30} stroke="#65a30d" strokeWidth="1" />

          {/* "CRICKET" label */}
          <text x={cx} y={cy + 4} textAnchor="middle" fontSize="13" fontWeight="700"
            fill="#166534" opacity="0.5" letterSpacing="3">
            CRICKET
          </text>

          {/* Facility icons */}
          {FACILITIES.map((f, i) => (
            <g key={`${f.type}-${i}`}>
              <circle cx={f.x} cy={f.y} r="18" fill="white" stroke="#d1d5db" strokeWidth="1.5" />
              <text x={f.x} y={f.y + 5} textAnchor="middle" fontSize="16">{f.icon}</text>
              <text x={f.x} y={f.y + 32} textAnchor="middle" fontSize="8" fill="#6b7280" fontWeight="600">
                {f.label}
              </text>
            </g>
          ))}

          {/* Gates */}
          {GATES.map((gate) => {
            const level = gates?.[gate.id] || 'low';
            const isClosed = level === 'closed';
            const pos = polarToXY(cx, cy, outerRx + 8, outerRy + 8, gate.angle);
            const color = GATE_COLOR[level];
            const bg = GATE_BG[level];

            return (
              <g key={gate.id}>
                {/* Connector line from oval to gate */}
                {(() => {
                  const inner = polarToXY(cx, cy, outerRx - 5, outerRy - 5, gate.angle);
                  return (
                    <line x1={inner.x} y1={inner.y} x2={pos.x} y2={pos.y}
                      stroke={color} strokeWidth="3" strokeLinecap="round" />
                  );
                })()}

                {/* Gate circle */}
                <circle cx={pos.x} cy={pos.y} r="28" fill={bg} stroke={color} strokeWidth="3"
                  className={isClosed ? '' : 'drop-shadow-md'} />

                {/* Gate letter */}
                <text x={pos.x} y={pos.y - 4} textAnchor="middle" fontSize="16" fontWeight="800" fill={color}>
                  {gate.id}
                </text>

                {/* Status label */}
                <text x={pos.x} y={pos.y + 10} textAnchor="middle" fontSize="7" fontWeight="600" fill={color}>
                  {GATE_LABEL[level]}
                </text>

                {/* Closed X overlay */}
                {isClosed && (
                  <>
                    <line x1={pos.x - 10} y1={pos.y - 10} x2={pos.x + 10} y2={pos.y + 10}
                      stroke="#ef4444" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                    <line x1={pos.x + 10} y1={pos.y - 10} x2={pos.x - 10} y2={pos.y + 10}
                      stroke="#ef4444" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                  </>
                )}
              </g>
            );
          })}

          {/* Legend */}
          <g transform="translate(20, 455)">
            {[
              { color: '#22c55e', bg: '#dcfce7', label: 'Low' },
              { color: '#eab308', bg: '#fef9c3', label: 'Medium' },
              { color: '#ef4444', bg: '#fee2e2', label: 'High' },
              { color: '#6b7280', bg: '#e5e7eb', label: 'Closed' },
            ].map((item, i) => (
              <g key={item.label} transform={`translate(${i * 80}, 0)`}>
                <circle cx="8" cy="8" r="8" fill={item.bg} stroke={item.color} strokeWidth="2" />
                <text x="22" y="12" fontSize="11" fill="#374151" fontWeight="600">{item.label}</text>
              </g>
            ))}

            <g transform="translate(340, 0)">
              <text x="0" y="6" fontSize="14">🚰</text>
              <text x="18" y="12" fontSize="11" fill="#374151" fontWeight="600">Water</text>
            </g>
            <g transform="translate(410, 0)">
              <text x="0" y="6" fontSize="14">🚻</text>
              <text x="18" y="12" fontSize="11" fill="#374151" fontWeight="600">Restroom</text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
