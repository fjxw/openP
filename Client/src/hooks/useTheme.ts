import { useState, useEffect } from 'react';
import { setTheme as setAppTheme } from '../utils/themeManager';

export const useTheme = () => {
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'light');

  // Обновляем тему при изменении состояния
  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    setAppTheme(newTheme);
  };

  // Инициализация при монтировании компонента
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return { theme, changeTheme };
};
