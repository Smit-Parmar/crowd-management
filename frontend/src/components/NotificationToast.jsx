import { useState, useEffect } from 'react';

/**
 * Slide-in notification toast for new announcements.
 * Auto-dismisses after 6 seconds, or can be closed manually.
 */
export default function NotificationToast({ announcement, onDismiss }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!announcement) return;

    // Trigger slide-in
    const showTimer = setTimeout(() => setIsVisible(true), 50);

    // Auto dismiss after 6s
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss?.(), 300); // wait for exit animation
    }, 6000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [announcement, onDismiss]);

  if (!announcement) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss?.(), 300);
  };

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md transition-all duration-300 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-6 pointer-events-none'
      }`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl shadow-blue-500/30 overflow-hidden ring-1 ring-white/10">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/10">
          <div className="flex items-center gap-2">
            <span className="text-base">📢</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-80">
              Live Announcement
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs leading-none transition-all"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>

        {/* Message */}
        <div className="px-4 py-3">
          <p className="text-sm font-medium leading-relaxed">
            {announcement.message}
          </p>
          <p className="text-[11px] text-blue-200/80 mt-1.5 font-mono">
            {announcement.timestamp}
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-white/10">
          <div
            className="h-full bg-white/30 rounded-r"
            style={{
              animation: 'shrink 6s linear forwards',
            }}
          />
        </div>
      </div>
    </div>
  );
}
