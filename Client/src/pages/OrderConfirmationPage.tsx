import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrderById, clearCurrentOrder } from '../store/slices/orderSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import productService from '../api/productService';

const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentOrder, isLoading, error } = useAppSelector(state => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(Number(id)));
    }
    
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!currentOrder) {
    return <Alert type="warning" message="Order not found" />;
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-success p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-success-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-xl">Thank you for your purchase.</p>
      </div>
      
      <div className="card bg-base-100 shadow-lg mb-8">
        <div className="card-body">
          <h2 className="card-title">Order #{String(currentOrder.orderId).substring(0, 8)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-bold">Shipping Address:</h3>
              <p className="whitespace-pre-wrap">{currentOrder.address}</p>
            </div>
            <div>
              <h3 className="font-bold">Contact:</h3>
              <p>{currentOrder.phone}</p>
              <h3 className="font-bold mt-2">Status:</h3>
              <div className="badge badge-primary">{currentOrder.status}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-lg mb-8">
        <div className="card-body">
          <h2 className="card-title">Order Items</h2>
          <div className="divider mt-0"></div>
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {currentOrder.items?.map(item => (
                  <tr key={item.productId}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                            <img 
                              src={productService.getProductImage(item.productId) || "https://picsum.photos/100/100"} 
                              alt={item.product?.name || "Product"} 
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div>{item.product?.name || "Unknown Product"}</div>
                      </div>
                    </td>
                    <td>${item.product?.price?.toFixed(2) || "0.00"}</td>
                    <td>{item.quantity}</td>
                    <td>${((item.product?.price || 0) * item.quantity).toFixed(2)}</td>
                  </tr>
                )) || <tr><td colSpan={4} className="text-center">Нет товаров в заказе</td></tr>}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right font-bold">Total:</td>
                  <td className="font-bold">${currentOrder.totalPrice?.toFixed(2) || '0.00'}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        <Link to="/" className="btn btn-outline">
          Continue Shopping
        </Link>
        <Link to="/orders" className="btn btn-primary">
          View All Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
