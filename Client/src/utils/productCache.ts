import type { Product } from '../types';

// Создаем кэш для продуктов
const productCache = new Map<number, Product>();

// Максимальное время жизни кэша в миллисекундах (30 минут)
const CACHE_TTL = 30 * 60 * 1000;
const timestamps = new Map<number, number>();

export const getProductFromCache = (productId: number): Product | undefined => {
  // Проверяем, не устарел ли кэш
  const timestamp = timestamps.get(productId);
  if (timestamp && Date.now() - timestamp > CACHE_TTL) {
    productCache.delete(productId);
    timestamps.delete(productId);
    return undefined;
  }
  
  return productCache.get(productId);
};

export const setProductInCache = (product: Product): void => {
  productCache.set(product.productId, product);
  timestamps.set(product.productId, Date.now());
};

export const clearProductCache = (): void => {
  productCache.clear();
  timestamps.clear();
};
