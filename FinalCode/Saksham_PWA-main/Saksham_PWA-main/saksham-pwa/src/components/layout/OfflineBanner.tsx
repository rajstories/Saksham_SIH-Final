import React, { useState } from 'react';
import { WifiOff, X } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  if (isOnline || dismissed) return null;

  return (
    <div className="offline-banner bg-amber text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <WifiOff size={20} />
        <span className="text-small font-medium">
          Offline Mode - Data will sync when online
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/20 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};
