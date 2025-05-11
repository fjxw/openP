
export const categoryTranslations: Record<string, string> = {
  'Electronics': 'Электроника',
  'Clothing': 'Одежда',
  'Books': 'Книги',
  'Home': 'Для дома',
  'Sports': 'Спорт',
  'Food': 'Продукты питания',
  'Beauty': 'Красота',
  'Toys': 'Игрушки',
  'Health': 'Здоровье',
};

export const reverseCategoryTranslations: Record<string, string> = 
  Object.entries(categoryTranslations).reduce((acc, [eng, rus]) => {
    acc[rus] = eng;
    return acc;
  }, {} as Record<string, string>);


export const roleTranslations: Record<string, string> = {
  'Admin': 'Администратор',
  'User': 'Пользователь',
};

export const orderStatusTranslations: Record<string, string> = {
  'Created': 'Создан',
  'InProgress': 'В обработке',
  'Completed': 'Выполнен',
  'Cancelled': 'Отменен',
};

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

  for (const [eng, rus] of Object.entries(dictionary)) {
    if (rus === value) {
      return eng;
    }
  }
  return value; 
};

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
