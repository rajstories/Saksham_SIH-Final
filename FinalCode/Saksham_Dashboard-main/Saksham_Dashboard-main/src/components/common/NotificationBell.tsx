import { Bell } from 'lucide-react';
import { useState } from 'react';

export const NotificationBell = () => {
  const [notificationCount] = useState(5);

  return (
    <div className="relative">
      <button className="relative p-2 text-gray-600 hover:text-[var(--ndma-navy)] transition-colors">
        <Bell className="h-6 w-6" />
        {notificationCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-[var(--ndma-orange-accent)] text-white text-xs font-semibold flex items-center justify-center">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </button>
    </div>
  );
};



