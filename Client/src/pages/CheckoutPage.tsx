import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCart } from '../store/slices/cartSlice';
import { createOrderFromCart } from '../store/slices/orderSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { useProductDetails } from '../hooks/useProductDetails';

// Add this function for phone validation
const validatePhoneNumber = (phone: string) => {
  // Remove any non-digit characters except the plus sign at the beginning
  const cleanedPhone = phone.replace(/[^\d+]/g, '');
  
  // Check if it matches the format +7 followed by 10 digits
  const phoneRegex = /^\+7\d{10}$/;
  return phoneRegex.test(cleanedPhone);
};

// Add this function for phone formatting
const formatPhoneNumber = (input: string) => {
  // Remove all non-digit characters except the plus sign
  let value = input.replace(/[^\d+]/g, '');
  
  // Ensure it starts with +7
  if (!value.startsWith('+')) {
    value = '+' + value;
  }
  
  if (value.startsWith('+') && !value.startsWith('+7') && value.length > 1) {
    value = '+7' + value.substring(1);
  }
  
  if (value.length <= 12) {
    return value;
  }
  
  // Limit to +7 plus 10 digits
  return value.slice(0, 12);
};

const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items = [], totalPrice, isLoading: cartLoading } = useAppSelector(state => state.cart);
  const { isLoading: orderLoading, error: orderError } = useAppSelector(state => state.orders);
  
  // Используем наш хук для загрузки деталей продуктов
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
      <Alert type="warning" message="Your cart is empty. Please add items before checkout." />
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {error && <Alert type="error" message={error} />}
          
          <form onSubmit={handleSubmit}>
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">Shipping Information</h2>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    className={`input input-bordered ${phoneError ? 'input-error' : ''}`}
                    placeholder="+7XXXXXXXXXX"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                  />
                  {phoneError && (
                    <label className="label">
                      <span className="label-text-alt text-error">{phoneError}</span>
                    </label>
                  )}
                  <label className="label">
                    <span className="label-text-alt">Format: +7 and 10 digits</span>
                  </label>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Delivery Address</span>
                  </label>
                  <textarea
                    name="address"
                    placeholder="Enter your full address"
                    className="textarea textarea-bordered h-24"
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
                    ) : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <div className="lg:col-span-1">
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Order Summary</h2>
              <div className="divider mt-0"></div>
              
              <div className="space-y-2">
                {processedItems.map(item => {
                  const product = item.product;
                  return (
                    <div key={item.productId} className="flex justify-between">
                      <span>
                        {product.name} × {item.quantity}
                      </span>
                      <span>${(product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="divider"></div>
              
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${(totalPrice ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(totalPrice ?? 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
