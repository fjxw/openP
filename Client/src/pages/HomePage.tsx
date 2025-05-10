import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, fetchCategories, fetchProductsByCategory, searchProducts, fetchProductsByPriceRange } from '../store/slices/productsSlice';
import ProductCard from '../components/ui/ProductCard';
import CategoryFilter from '../components/ui/CategoryFilter';
import PriceFilter from '../components/ui/PriceFilter';
import Pagination from '../components/ui/Pagination';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { products, categories, totalPages, currentPage, isLoading, error } = useAppSelector(
    state => state.products
  );

  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // Используем разные действия в зависимости от активных фильтров
    const fetchFilteredProducts = async () => {
      try {
        if (search) {
          // Если есть поисковый запрос, используем поиск
          await dispatch(searchProducts({
            name: search,
            pageNumber: page,
            pageSize: 12
          }));
        } else if (minPrice !== undefined || maxPrice !== undefined) {
          // Если установлен диапазон цен (возможно вместе с категорией)
          await dispatch(fetchProductsByPriceRange({
            minPrice: minPrice || 0,
            maxPrice: maxPrice || 100000, // Большое значение по умолчанию
            category, // Передаем категорию, если она выбрана
            pageNumber: page,
            pageSize: 12
          }));
        } else if (category) {
          // Если выбрана только категория без фильтра цены
          await dispatch(fetchProductsByCategory({
            category,
            pageNumber: page,
            pageSize: 12
          }));
        } else {
          // Без фильтров - получаем все товары
          await dispatch(fetchProducts({
            pageNumber: page,
            pageSize: 12
          }));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchFilteredProducts();
  }, [dispatch, category, search, minPrice, maxPrice, page]);

  const updateFilters = (filters: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    // Update params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    // Reset to first page when filters change
    if (!('page' in filters)) {
      newParams.set('page', '1');
    }
    
    setSearchParams(newParams);
  };

  const handleCategoryChange = (newCategory: string | undefined) => {
    updateFilters({ 
      category: newCategory,
      search: undefined // Сбрасываем поиск при изменении категории
    });
  };

  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    updateFilters({
      minPrice: min?.toString(),
      maxPrice: max?.toString(),
      search: undefined // Сбрасываем поиск при изменении цены
    });
  };

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage.toString() });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Главная</h1>
      
      {error && <Alert type="error" message={error} />}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-4 space-y-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <CategoryFilter
                categories={categories}
                selectedCategory={category}
                onChange={handleCategoryChange}
              />
            </div>
            
            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onChange={handlePriceChange}
            />
          </div>
        </div>

        {/* Products grid */}
        <div className="md:col-span-3">
          {isLoading ? (
            <LoadingSpinner />
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
              
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-gray-500">Try changing your filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
