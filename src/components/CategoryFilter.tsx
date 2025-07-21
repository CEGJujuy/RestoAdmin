import React from 'react';
import { Category } from '../types';
import { restaurantConfig } from '../data/config';
import { cn } from '../utils/helpers';

interface CategoryFilterProps {
  selectedCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="sticky top-16 z-40 bg-gray-950/95 backdrop-blur-md border-b border-gray-800/30 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => onCategoryChange('all')}
            className={cn(
              'flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all duration-200',
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
            )}
          >
            <span className="mr-2">🍽️</span>
            Todo
          </button>
          
          {restaurantConfig.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id as Category)}
              className={cn(
                'flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all duration-200',
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
              )}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};