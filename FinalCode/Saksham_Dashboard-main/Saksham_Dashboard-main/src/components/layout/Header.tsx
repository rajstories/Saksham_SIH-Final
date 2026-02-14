import { SearchBar } from '../common/SearchBar';
import { NotificationBell } from '../common/NotificationBell';
import { UserProfile } from '../common/UserProfile';
import { NDMALogo } from '../common/NDMALogo';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export const Header = ({ onMobileMenuToggle }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3 h-16">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center space-x-3">
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-[#002147]"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center justify-center">
            <NDMALogo size={48} />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold" style={{ fontFamily: 'Playfair Display, serif', color: '#002147' }}>
              National Disaster Management Authority
            </h1>
            <p className="text-xs text-gray-500">Super Admin Dashboard</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:block">
          <SearchBar />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <NotificationBell />
          <UserProfile />
        </div>
      </div>
    </header>
  );
};

