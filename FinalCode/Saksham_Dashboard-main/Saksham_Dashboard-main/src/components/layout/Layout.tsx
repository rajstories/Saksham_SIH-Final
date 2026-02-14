import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ReactNode, useState, createContext, useContext } from 'react';

interface LayoutProps {
  children: ReactNode;
}

type ActivePage = 'dashboard' | 'incidents' | 'alerts' | 'trainings' | 'organizations' | 'data-uploads' | 'reports' | 'settings';

interface NavigationContextType {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within Layout');
  }
  return context;
};

export const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  return (
    <NavigationContext.Provider value={{ activePage, setActivePage }}>
      <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <div className="flex relative">
          <Sidebar 
            isMobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />
          <main className="flex-1 lg:ml-64 mt-16 p-3 md:p-4 transition-all duration-300">
            {children}
          </main>
        </div>
      </div>
    </NavigationContext.Provider>
  );
};

