import React from 'react';
import { Menu } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title = 'SAKSHAM', onMenuClick }) => {
  const isOnline = useOnlineStatus();

  return (
    <header className="fixed top-0 left-0 right-0 h-header bg-white shadow-header z-50 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-card-title font-bold text-indian-blue">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant={isOnline ? 'online' : 'offline'}>
          {isOnline ? 'Online' : 'Offline'}
        </Badge>
        <button
          onClick={onMenuClick}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={24} className="text-gray-700" />
        </button>
      </div>
    </header>
  );
};
