import { useState, useEffect } from 'react';
import { setTheme as setAppTheme, availableThemes } from '../utils/themeManager';

export const useTheme = () => {
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'light');
  
  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    setAppTheme(newTheme);
  };
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return { theme, changeTheme, availableThemes };
};
