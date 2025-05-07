import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | undefined;
  onChange: (category: string | undefined) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onChange 
}) => {
  return (
    <div className="dropdown dropdown-hover">
      <div tabIndex={0} role="button" className="btn btn-sm m-1">
        {selectedCategory || 'All Categories'} <span className="ml-1">▼</span>
      </div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <a onClick={() => onChange(undefined)} className={!selectedCategory ? 'active' : ''}>
            All Categories
          </a>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <a 
              onClick={() => onChange(category)}
              className={selectedCategory === category ? 'active' : ''}
            >
              {category}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;
