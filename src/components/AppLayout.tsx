import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import type { NavigationTab } from '../types';

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentTab = (): NavigationTab => {
    const path = location.pathname.split('/')[1];
    if (['home', 'lessons', 'practice', 'profile'].includes(path)) {
      return path as NavigationTab;
    }
    return 'home';
  };

  const handleTabChange = (tab: NavigationTab) => {
    navigate(`/${tab}`);
  };

  return (
    <div className="relative">
      <Outlet />
      <BottomNavigation activeTab={getCurrentTab()} onTabChange={handleTabChange} />
    </div>
  );
}