import type { NavigationTab } from '../types';
import { FiHome, FiBookOpen, FiActivity, FiUser } from 'react-icons/fi';

interface BottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    {
      id: 'home' as NavigationTab,
      label: 'Inicio',
      icon: <FiHome className="w-5 h-5" />,
    },
    {
      id: 'lessons' as NavigationTab,
      label: 'Lecciones',
      icon: <FiBookOpen className="w-5 h-5" />,
    },
    {
      id: 'practice' as NavigationTab,
      label: 'Práctica',
      icon: <FiActivity className="w-5 h-5" />,
    },
    {
      id: 'profile' as NavigationTab,
      label: 'Perfil',
      icon: <FiUser className="w-5 h-5" />,
    },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm border border-gray-100">
        <div className="flex items-center p-1.5 gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center justify-center px-6 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {/* Icono y etiqueta */}
                <div className="flex flex-col items-center">
                  <div className={`transition-transform duration-200 ${
                    isActive ? 'scale-110' : ''
                  }`}>
                    {tab.icon}
                  </div>
                  <span className={`text-xs font-medium mt-1 transition-opacity duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-70'
                  }`}>
                    {tab.label}
                  </span>
                </div>

                {/* Indicador de activo */}
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-teal-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Blur effect background */}
      <div className="absolute inset-0 -z-10 bg-white/30 backdrop-blur-md rounded-2xl"></div>
    </div>
  );
}