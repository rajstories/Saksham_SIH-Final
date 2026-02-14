import { User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';

export const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-[var(--ndma-navy)] flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-gray-900">NDMA Admin</p>
          <p className="text-xs text-gray-500">Super Admin</p>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-200">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};



