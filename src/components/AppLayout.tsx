import { useLocation, useNavigate } from 'react-router-dom';
import type { NavigationTab } from '../types';
import BottomNavigation from './BottomNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // No mostrar BottomNavigation en rutas específicas
  const hideNavigation = location.pathname.startsWith('/quiz');

  const handleTabChange = (tab: NavigationTab) => {
    const routes: Record<NavigationTab, string> = {
      home: '/',
      lessons: '/lessons',
      practice: '/practice',
      profile: '/profile'
    };
    navigate(routes[tab]);
  };

  // Determinar la tab activa basada en la ruta actual
  const getActiveTab = (): NavigationTab => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/lessons')) return 'lessons';
    if (path.startsWith('/practice')) return 'practice';
    if (path.startsWith('/profile')) return 'profile';
    return 'home';
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {children}
      {!hideNavigation && (
        <BottomNavigation
          activeTab={getActiveTab()}
          onTabChange={handleTabChange}
        />
      )}
    </div>
  );
}