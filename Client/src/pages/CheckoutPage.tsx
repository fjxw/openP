import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCart } from '../store/slices/cartSlice';
import { createOrderFromCart } from '../store/slices/orderSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { useProductDetails } from '../hooks/useProductDetails';

const validatePhoneNumber = (phone: string) => {
  const cleanedPhone = phone.replace(/[^\d+]/g, '');
  const phoneRegex = /^\+7\d{10}$/;
  return phoneRegex.test(cleanedPhone);
};

const formatPhoneNumber = (input: string) => {
  let value = input.replace(/[^\d+]/g, '');
  
  if (!value.startsWith('+')) {
    value = '+' + value;
  }
  
  if (value.startsWith('+') && !value.startsWith('+7') && value.length > 1) {
    value = '+7' + value.substring(1);
  }
  
  if (value.length <= 12) {
    return value;
  }
  
  return value.slice(0, 12);
};

const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items = [], totalPrice, isLoading: cartLoading } = useAppSelector(state => state.cart);
  const { isLoading: orderLoading, error: orderError } = useAppSelector(state => state.orders);
  
  const { processedItems, isLoading: productsLoading, loadingError } = useProductDetails(items);
  
  const [formData, setFormData] = useState({
    address: '',
  });

  const [phone, setPhone] = useState('+7');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
    
    if (formattedPhone.length < 12) {
      setPhoneError('');
    } else if (!validatePhoneNumber(formattedPhone)) {
      setPhoneError('Неверный формат номера телефона');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(phone)) {
      setPhoneError('Введите корректный номер телефона в формате +7XXXXXXXXXX');
      return;
    }

    if (!formData.address) {
      return;
    }
    
    const result = await dispatch(createOrderFromCart({
      address: formData.address,
      phone: phone
    }));
    
    if (createOrderFromCart.fulfilled.match(result)) {
      navigate(`/orders/${result.payload.orderId}`);
    }
  };

  const isLoading = cartLoading || productsLoading;
  const error = orderError || loadingError;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (items.length === 0 || items.reduce((total, item) => total + item.quantity, 0) === 0) {
    return (
      <Alert type="warning" message="Ваша корзина пуста. Добавьте товары перед оформлением заказа." />
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Оформление заказа</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {error && <Alert type="error" message={error} />}
          
          <form onSubmit={handleSubmit}>
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-xl mb-6">Информация о доставке</h2>
                
                <div className="form-control mb-6">
                  <div className="mb-2 text-sm font-medium">Номер телефона</div>
                  <input
                    type="tel"
                    className={`input input-bordered w-full ${phoneError ? 'input-error' : ''}`}
                    placeholder="+7XXXXXXXXXX"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                  />
                  {phoneError && (
                    <p className="text-error text-xs mt-1">{phoneError}</p>
                  )}
                  <p className="text-xs mt-1 text-gray-500">Формат: +7 и 10 цифр</p>
                </div>
                
                <div className="form-control mb-6">
                  <div className="mb-2 text-sm font-medium">Адрес доставки</div>
                  <textarea
                    name="address"
                    placeholder="Введите полный адрес доставки"
                    className="textarea textarea-bordered h-24 w-full"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <div className="card-actions mt-6">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-block"
                    disabled={!!phoneError || phone.length < 12 || orderLoading}
                  >
                    {orderLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : 'Оформить заказ'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <div className="lg:col-span-1">
          <div className="card bg-base-200 sticky top-4">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Сводка заказа</h2>
              <div className="divider mt-0 mb-4"></div>
              
              <div className="space-y-3">
                {processedItems.map(item => {
                  const product = item.product;
                  return (
                    <div key={item.productId} className="flex justify-between">
                      <span className="font-medium">
                        {product.name} × {item.quantity}
                      </span>
                      <span>{(product.price * item.quantity).toFixed(2)} ₽</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="divider my-4"></div>
              
              <div className="flex justify-between mb-2">
                <span>Подытог</span>
                <span>{(totalPrice ?? 0).toFixed(2)} ₽</span>
              </div>
              <div className="flex justify-between mb-3">
                <span>Доставка</span>
                <span>Бесплатно</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Итого</span>
                <span>{(totalPrice ?? 0).toFixed(2)} ₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
