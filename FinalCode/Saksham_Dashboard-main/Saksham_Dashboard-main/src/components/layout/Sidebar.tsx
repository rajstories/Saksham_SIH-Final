import { 
  LayoutDashboard, 
  AlertTriangle, 
  Bell, 
  GraduationCap, 
  Building2, 
  Upload, 
  FileText, 
  Settings 
} from 'lucide-react';
import { useState } from 'react';
import { useNavigation } from './Layout';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'trainings', label: 'Trainings', icon: GraduationCap },
  { id: 'organizations', label: 'Organizations', icon: Building2 },
  { id: 'data-uploads', label: 'Data Uploads', icon: Upload },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar = ({ isMobileOpen = false, onMobileClose }: SidebarProps) => {
  const { activePage, setActivePage } = useNavigation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleItemClick = (id: string) => {
    setActivePage(id as any);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      
      <aside className={`text-white transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } min-h-screen fixed left-0 top-16 z-40 ${
        isMobileOpen ? 'block' : 'hidden'
      } lg:block`} style={{ backgroundColor: '#002147' }}>
      <div className="p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mb-4 p-2 rounded-lg hover:bg-white/10 transition-colors w-full flex justify-end"
        >
          <svg
            className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'font-semibold'
                    : 'hover:bg-white/10 text-white'
                }`}
                style={isActive ? { backgroundColor: '#FF9933', color: '#002147' } : {}}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
    </>
  );
};

