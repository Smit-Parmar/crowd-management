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
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-md transition-all duration-300 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-blue-600 text-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-blue-700/50">
          <div className="flex items-center gap-2">
            <span className="text-lg">📢</span>
            <span className="text-xs font-bold uppercase tracking-wider opacity-90">
              Live Announcement
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white text-lg leading-none p-1"
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
          <p className="text-xs text-blue-200 mt-1">
            {announcement.timestamp}
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-blue-700/30">
          <div
            className="h-full bg-white/40 rounded-r"
            style={{
              animation: 'shrink 6s linear forwards',
            }}
          />
        </div>
      </div>
    </div>
  );
}
