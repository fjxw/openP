import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { Product } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart, updateCartItem } from '../../store/slices/cartSlice';
import { translateCategoryToRussian } from '../../utils/translations';
import ProductImage from './ProductImage';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { items = [] } = useAppSelector(state => state.cart);
  const [qty, setQty] = useState(1);


  useEffect(() => {
    const cartItem = items.find(item => item.productId === product.productId);
    if (cartItem) {
      setQty(cartItem.quantity);
    }
  }, [items, product.productId]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    
    const existingItem = items.find(item => item.productId === product.productId);
    if (existingItem) {
      dispatch(updateCartItem({ productId: product.productId, quantity: qty }));
    } else {
      dispatch(addToCart({ productId: product.productId, quantity: qty }));
    }
  };

  const incrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    if (qty < product.quantity) {
      setQty(prev => prev + 1);
    }
  };

  const decrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    if (qty > 1) {
      setQty(prev => prev - 1);
    }
  };


  const isInCart = items.some(item => item.productId === product.productId);

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
        <ProductImage
          productId={product.productId}
          alt={product.name}
          className="h-48 w-full object-cover"
          fallbackImage="https://picsum.photos/300/200"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {product.name}
          {product.quantity <= 5 && product.quantity > 0 && (
            <div className="badge badge-warning">Мало</div>
          )}
          {product.quantity === 0 && (
            <div className="badge badge-error">Нет в наличии</div>
          )}
        </h2>
        <p className="text-sm line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold">{product.price.toFixed(2)} ₽</span>
          <span className="text-sm text-gray-500">{translateCategoryToRussian(product.category)}</span>
        </div>
        <div className="card-actions flex items-center flex-nowrap gap-1 mt-3">
          <Link to={`/products/${product.productId}`} className="btn btn-sm btn-outline btn-xs sm:btn-sm flex-shrink-0">
            Подробнее
          </Link>
          
          <div className="flex-grow"></div>
          
          <div className="join flex-shrink-0">
            <button 
              className="btn btn-sm join-item" 
              onClick={decrementQuantity}
              disabled={qty <= 1}
            >
              -
            </button>
            <input 
              type="text" 
              className="input input-bordered input-sm join-item w-10 text-center"
              value={qty} 
              readOnly
            />
            <button 
              className="btn btn-sm join-item" 
              onClick={incrementQuantity}
              disabled={product.quantity <= qty}
            >
              +
            </button>
          </div>
          
          <button 
            className={`btn btn-sm btn-square flex-shrink-0 ${isInCart ? 'btn-success' : 'btn-primary'}`} 
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
            title={isInCart ? 'Обновить в корзине' : 'Добавить в корзину'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;


