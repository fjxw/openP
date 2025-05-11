import { useState, useEffect, useMemo } from 'react';
import type { CartItem, CartItemWithProduct } from '../types';
import productService from '../api/productService';
import { getProductFromCache, setProductInCache } from '../utils/productCache';

export const useProductDetails = (cartItems: CartItem[] = []) => {
  const [processedItems, setProcessedItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const itemsKey = useMemo(
    () => cartItems.map(item => `${item.productId}:${item.quantity}`).join('|'),
    [cartItems]
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setLoadingError(null);

      try {
        if (cartItems.length === 0 || cartItems.reduce((total, item) => total + item.quantity, 0) === 0) {
          setProcessedItems([]);
          return;
        }
        const toFetch = cartItems.filter(item => !getProductFromCache(item.productId));
        await Promise.all(
          toFetch.map(async item => {
            try {
              const product = await productService.getProductById(item.productId);
              setProductInCache(product);
            } catch (err) {
              console.error(`Failed to fetch product ${item.productId}:`, err);
            }
          })
        );
        if (cancelled) return;
        const itemsWithProducts = cartItems
          .map(item => {
            const product = getProductFromCache(item.productId);
            return product ? { ...item, product } : null;
          })
          .filter(Boolean) as CartItemWithProduct[];

        setProcessedItems(itemsWithProducts);
      } catch (err) {
        console.error('Failed to process cart items:', err);
        if (!cancelled) setLoadingError('Failed to load product details');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [itemsKey]);

  return { processedItems, isLoading, loadingError };
};
