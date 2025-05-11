import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { useProductDetails } from '../hooks/useProductDetails';

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items = [], totalPrice, isLoading: cartLoading, error: cartError } = useAppSelector((state) => state.cart);
  
  const { processedItems, isLoading: productsLoading, loadingError } = useProductDetails(items);
  
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (productId: number, quantity: number) => {
    dispatch(updateCartItem({ productId, quantity }));
  };
  
  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const isLoading = cartLoading || productsLoading;

  const error = cartError || loadingError;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (processedItems.length === 0 || processedItems.reduce((total, item) => total + item.quantity, 0) === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Ваша корзина пуста</h2>
        <p className="mb-6">Добавьте товары в козину.</p>
        <Link to="/" className="btn btn-primary">
          К покупкам
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Корзина</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Количество</th>
                  <th>Цена</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {processedItems.map((item) => {
                  const prod = item.product;
                  return (
                    <tr key={prod.productId}>
                      <td>{prod.name}</td>
                      <td>
                        <div className="flex items-center">
                          <button
                            className="btn btn-sm"
                            onClick={() =>
                              handleQuantityChange(prod.productId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            className="btn btn-sm"
                            onClick={() =>
                              handleQuantityChange(prod.productId, item.quantity + 1)
                            }
                            disabled={item.quantity >= prod.quantity}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>{(prod.price * item.quantity).toFixed(2)} ₽</td>
                      <td>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleRemoveItem(prod.productId)}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Итого заказа</h2>
              <div className="divider mt-0"></div>
              
              <div className="flex justify-between mb-2">
                <span>Подытог</span>
                <span>{totalPrice?.toFixed(2) || '0.00'} ₽</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Доставка</span>
                <span>Рассчитывается при оформлении</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Итого</span>
                <span>{totalPrice?.toFixed(2) || '0.00'} ₽</span>
              </div>
              
              <div className="card-actions mt-6">
                <Link to="/checkout" className="btn btn-primary btn-block">
                  Оформить заказ
                </Link>
                <Link to="/" className="btn btn-outline btn-block">
                  Продолжить покупки
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;