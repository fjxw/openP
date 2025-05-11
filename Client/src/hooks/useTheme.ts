import { useState, useEffect } from 'react';
import { setTheme as setAppTheme, availableThemes, initializeTheme } from '../utils/themeManager';

export const useTheme = () => {
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'dark');
  
  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    setAppTheme(newTheme);
  };
  
  useEffect(() => {
    initializeTheme();
  }, []);

  return { theme, changeTheme, availableThemes };
};
