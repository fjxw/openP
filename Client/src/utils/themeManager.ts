export const initializeTheme = (): void => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
};

export const setTheme = (theme: string): void => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

export const availableThemes = [
  {
    id: 'light',
    name: 'Светлая'
  },
  {
    id: 'dark',
    name: 'Тёмная'
  }
];
