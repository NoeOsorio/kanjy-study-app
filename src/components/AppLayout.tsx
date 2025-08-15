import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigation } from '../hooks/useNavigation';
import BottomNavigation from './BottomNavigation';
import HomePage from '../pages/HomePage';
import LessonsPage from '../pages/LessonsPage';
import type { NavigationTab } from '../types';

export default function AppLayout() {
  const { activeTab, navigateTo } = useNavigation();
  const [searchParams] = useSearchParams();

  // Leer el parámetro tab de la URL y establecer la tab activa
  useEffect(() => {
    const tabParam = searchParams.get('tab') as NavigationTab;
    if (tabParam && ['home', 'lessons', 'practice', 'profile'].includes(tabParam)) {
      navigateTo(tabParam);
    }
  }, [searchParams, navigateTo]);

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'lessons':
        return <LessonsPage />;
      case 'practice':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Práctica</h2>
              <p className="text-gray-600">¡Próximamente! Aquí podrás practicar y repasar los kanji aprendidos.</p>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Perfil</h2>
              <p className="text-gray-600">¡Próximamente! Aquí podrás ver tu progreso y configurar tu perfil.</p>
            </div>
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="relative">
      {renderCurrentPage()}
      <BottomNavigation activeTab={activeTab} onTabChange={navigateTo} />
    </div>
  );
}
