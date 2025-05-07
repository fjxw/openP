import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCart } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';

const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, isLoading: cartLoading } = useAppSelector(state => state.cart);
  const { isLoading: orderLoading, error } = useAppSelector(state => state.orders);
  
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.address || !formData.phone) {
      return;
    }
    
    const result = await dispatch(createOrder({
      address: formData.address,
      phone: formData.phone
    }));
    
    if (createOrder.fulfilled.match(result)) {
      navigate(`/orders/${result.payload.id}`);
    }
  };

  if (cartLoading) {
    return <LoadingSpinner />;
  }

  if (items.length === 0) {
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
                    type="text"
                    name="phone"
                    placeholder="+1 (123) 456-7890"
                    className="input input-bordered"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
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
                    disabled={orderLoading}
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
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between">
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="divider"></div>
              
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
