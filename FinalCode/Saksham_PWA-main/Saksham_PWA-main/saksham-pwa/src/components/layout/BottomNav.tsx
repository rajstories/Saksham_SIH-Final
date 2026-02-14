import React from 'react';
import { Home, ClipboardList, CheckSquare, User, Plus } from 'lucide-react';
import { useLocation, Link } from 'wouter';

const navItems = [
  { path: '/', icon: Home, label: 'Home', position: 'left' },
  { path: '/events', icon: ClipboardList, label: 'Events', position: 'left' },
  { path: '/attendance', icon: CheckSquare, label: 'Attendance', position: 'right' },
  { path: '/profile', icon: User, label: 'Profile', position: 'right' },
];

export const BottomNav: React.FC = () => {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-bottom-nav bg-white shadow-bottom-nav z-50">
      <div className="h-full flex items-center justify-between px-4 relative">
        {/* Left side items */}
        <div className="flex items-center gap-2 flex-1 justify-start">
          {navItems.filter(item => item.position === 'left').map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;

            return (
              <Link key={item.path} href={item.path}>
                <a className="flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] touch-target">
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
                      ${isActive ? 'bg-indian-blue' : 'bg-transparent'}
                    `}
                  >
                    <Icon
                      size={24}
                      className={isActive ? 'text-white' : 'text-gray-500'}
                    />
                  </div>
                  <span
                    className={`text-micro ${isActive ? 'text-indian-blue font-medium' : 'text-gray-500'
                      }`}
                  >
                    {item.label}
                  </span>
                </a>
              </Link>
            );
          })}
        </div>

        {/* Center floating Add button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <Link href="/events/new">
            <a
              className="w-16 h-16 rounded-full bg-gradient-to-br from-saffron to-amber shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center touch-target"
            >
              <Plus size={32} className="text-white" strokeWidth={3} />
            </a>
          </Link>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {navItems.filter(item => item.position === 'right').map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;

            return (
              <Link key={item.path} href={item.path}>
                <a className="flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] touch-target">
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
                      ${isActive ? 'bg-indian-blue' : 'bg-transparent'}
                    `}
                  >
                    <Icon
                      size={24}
                      className={isActive ? 'text-white' : 'text-gray-500'}
                    />
                  </div>
                  <span
                    className={`text-micro ${isActive ? 'text-indian-blue font-medium' : 'text-gray-500'
                      }`}
                  >
                    {item.label}
                  </span>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
