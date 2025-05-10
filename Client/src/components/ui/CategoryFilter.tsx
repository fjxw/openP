import React from 'react';
import { translateCategoryToRussian, translateCategoryToEnglish } from '../../utils/translations';

interface CategoryFilterProps {
  categories: string[] | undefined;
  selectedCategory: string | undefined;
  onChange: (category: string | undefined) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories = [], 
  selectedCategory, 
  onChange 
}) => {
  // Преобразуем выбранную категорию для отображения
  const displaySelectedCategory = selectedCategory ? 
    translateCategoryToRussian(selectedCategory) : 
    'Все категории';

  // Обработчик изменения категории - передает английское значение
  const handleCategoryChange = (category: string | undefined) => {
    onChange(category); // Передаем оригинальное значение на английском
  };

  return (
    <div className="dropdown dropdown-hover">
      <div tabIndex={0} role="button" className="btn btn-sm m-1">
        {displaySelectedCategory} <span className="ml-1">▼</span>
      </div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <a onClick={() => handleCategoryChange(undefined)} className={!selectedCategory ? 'active' : ''}>
            Все категории
          </a>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <a 
              onClick={() => handleCategoryChange(category)}
              className={selectedCategory === category ? 'active' : ''}
            >
              {translateCategoryToRussian(category)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;
