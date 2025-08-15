import { useState } from 'react';
import type { NavigationTab } from '../types';

export function useNavigation() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');

  const navigateTo = (tab: NavigationTab) => {
    setActiveTab(tab);
  };

  return {
    activeTab,
    navigateTo,
  };
}
