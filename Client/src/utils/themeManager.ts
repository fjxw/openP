/**
 * Утилита для управления темами приложения
 */

// Инициализация темы при загрузке приложения
export const initializeTheme = (): void => {
  // Получаем сохраненную тему или используем светлую по умолчанию
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
};

// Изменение и сохранение темы
export const setTheme = (theme: string): void => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};
