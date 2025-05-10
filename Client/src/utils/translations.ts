// Словари для перевода значений

// Перевод категорий товаров
export const categoryTranslations: Record<string, string> = {
  // Здесь перечислены реальные категории из вашей системы
  'Electronics': 'Электроника',
  'Clothing': 'Одежда',
  'Books': 'Книги',
  'Home': 'Для дома',
  'Sports': 'Спорт',
  'Food': 'Продукты питания',
  'Beauty': 'Красота и здоровье',
  'Toys': 'Игрушки',
  // Добавьте другие категории по мере необходимости
};

// Обратный словарь для преобразования русских названий в английские
export const reverseCategoryTranslations: Record<string, string> = 
  Object.entries(categoryTranslations).reduce((acc, [eng, rus]) => {
    acc[rus] = eng;
    return acc;
  }, {} as Record<string, string>);

// Перевод ролей пользователей
export const roleTranslations: Record<string, string> = {
  'Admin': 'Администратор',
  'User': 'Пользователь',
};

// Перевод статусов заказов
export const orderStatusTranslations: Record<string, string> = {
  'Created': 'Создан',
  'InProgress': 'В обработке',
  'Completed': 'Выполнен',
  'Cancelled': 'Отменен',
};

// Функции для перевода
export const translateToRussian = (
  value: string, 
  dictionary: Record<string, string>
): string => {
  return dictionary[value] || value;
};

export const translateToEnglish = (
  value: string, 
  dictionary: Record<string, string>
): string => {
  // Ищем в обратном словаре
  for (const [eng, rus] of Object.entries(dictionary)) {
    if (rus === value) {
      return eng;
    }
  }
  return value; // Если перевод не найден, возвращаем исходное значение
};

// Функции-помощники для конкретных типов данных
export const translateCategoryToRussian = (category: string): string => {
  return translateToRussian(category, categoryTranslations);
};

export const translateCategoryToEnglish = (category: string): string => {
  return reverseCategoryTranslations[category] || category;
};

export const translateRoleToRussian = (role: string): string => {
  return translateToRussian(role, roleTranslations);
};

export const translateOrderStatusToRussian = (status: string): string => {
  return translateToRussian(status, orderStatusTranslations);
};
