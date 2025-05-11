import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProductById, clearError } from '../store/slices/productsSlice';
import { addToCart, updateCartItem } from '../store/slices/cartSlice';
import ProductImage from '../components/ui/ProductImage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { translateCategoryToRussian } from '../utils/translations';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentProduct, isLoading, error } = useAppSelector(state => state.products);
  const { items = [] } = useAppSelector(state => state.cart);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }
    
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProduct) {
      const cartItem = items.find(item => item.productId === currentProduct.productId);
      if (cartItem) {
        setQuantity(cartItem.quantity);
      } else {
        setQuantity(1); 
      }
    }
  }, [currentProduct, items]);

  const handleAddToCart = () => {
    if (currentProduct) {
      const existingItem = items.find(item => item.productId === currentProduct.productId);
      if (existingItem) {
        dispatch(updateCartItem({ productId: currentProduct.productId, quantity }));
      } else {
        dispatch(addToCart({ productId: currentProduct.productId, quantity }));
      }
    }
  };

  const incrementQuantity = () => {
    if (currentProduct && quantity < currentProduct.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const isInCart = currentProduct && items.some(item => item.productId === currentProduct.productId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!currentProduct) {
    return <Alert type="warning" message="Товар не найден" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
  
      <div className="flex justify-center">
        <ProductImage 
          productId={currentProduct.productId}
          alt={currentProduct.name}
          className="rounded-lg shadow-lg object-cover max-h-96"
          fallbackImage="https://picsum.photos/600/400"
        />
      </div>
      

      <div>
        <nav className="text-sm breadcrumbs mb-4">
          <ul>
            <li><Link to="/">Главная</Link></li>
            <li>{translateCategoryToRussian(currentProduct.category)}</li>
            <li className="text-primary">{currentProduct.name}</li>
          </ul>
        </nav>
        
        <h1 className="text-3xl font-bold">{currentProduct.name}</h1>
        
        <div className="mt-4">
          <span className="badge badge-outline">{translateCategoryToRussian(currentProduct.category)}</span>
          {currentProduct.quantity <= 5 && currentProduct.quantity > 0 && (
            <span className="badge badge-warning ml-2">Осталось {currentProduct.quantity} шт.</span>
          )}
          {currentProduct.quantity === 0 && (
            <span className="badge badge-error ml-2">Нет в наличии</span>
          )}
        </div>
        
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-primary">{currentProduct.price.toFixed(2)} ₽</h2>
        </div>
        
        <div className="divider"></div>
        
        <p className="mt-4">{currentProduct.description}</p>
        
        <div className="mt-8">
          <p>
            {currentProduct.quantity > 0 
              ? `В наличии (${currentProduct.quantity} шт.)` 
              : "Нет в наличии"}
          </p>
        </div>
        
        <div className="mt-8 flex items-center">
          <div className="join">
            <button 
              className="btn btn-sm join-item" 
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              -
            </button>
            <input 
              type="text" 
              className="input input-bordered input-sm join-item w-16 text-center" 
              value={quantity} 
              readOnly
            />
            <button 
              className="btn btn-sm join-item" 
              onClick={incrementQuantity}
              disabled={currentProduct.quantity <= quantity}
            >
              +
            </button>
          </div>
          
          <button 
            className={`btn ${isInCart ? 'btn-success' : 'btn-primary'} ml-4`}
            onClick={handleAddToCart}
            disabled={currentProduct.quantity === 0}
          >
            {isInCart ? 'Обновить корзину' : 'Добавить в корзину'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
