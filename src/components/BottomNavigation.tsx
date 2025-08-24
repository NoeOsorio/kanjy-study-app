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
      icon: <FiHome className="w-6 h-6" />,
      color: 'from-green-400 to-green-600',
      activeColor: 'from-green-500 to-green-700',
    },
    {
      id: 'lessons' as NavigationTab,
      label: 'Lecciones',
      icon: <FiBookOpen className="w-6 h-6" />,
      color: 'from-blue-400 to-blue-600',
      activeColor: 'from-blue-500 to-blue-700',
    },
    {
      id: 'practice' as NavigationTab,
      label: 'Práctica',
      icon: <FiActivity className="w-6 h-6" />,
      color: 'from-purple-400 to-purple-600',
      activeColor: 'from-purple-500 to-purple-700',
    },
    {
      id: 'profile' as NavigationTab,
      label: 'Perfil',
      icon: <FiUser className="w-6 h-6" />,
      color: 'from-orange-400 to-orange-600',
      activeColor: 'from-orange-500 to-orange-700',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-100 shadow-lg">
      <div className="flex items-center justify-around px-2 py-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-150 ease-out ${
                isActive
                  ? `bg-gradient-to-br ${tab.activeColor} text-white shadow-xl scale-110`
                  : `text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:scale-105`
              }`}
            >
              <div className={`mb-1 transition-all duration-150 ${
                isActive ? 'text-white' : 'text-current'
              }`}>
                {tab.icon}
              </div>
              <span className={`text-xs font-medium transition-all duration-150 ${
                isActive ? 'text-white' : 'text-current'
              }`}>
                {tab.label}
              </span>
              
              {/* Indicador de actividad */}
              {isActive && (
                <div className="absolute -top-1 w-2 h-2 bg-white rounded-full shadow-sm"></div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Indicador de progreso sutil */}
      <div className="h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 opacity-60"></div>
    </div>
  );
}
