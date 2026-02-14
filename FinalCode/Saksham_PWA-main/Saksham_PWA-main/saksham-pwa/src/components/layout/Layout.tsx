import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { OfflineBanner } from './OfflineBanner';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={title} />
      <OfflineBanner />
      <main className="safe-area px-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};
