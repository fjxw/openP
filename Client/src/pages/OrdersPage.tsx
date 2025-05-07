import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserOrders } from '../store/slices/orderSlice';
import { OrderStatus } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';

const OrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading, error } = useAppSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'badge-warning';
      case OrderStatus.PROCESSING:
        return 'badge-info';
      case OrderStatus.SHIPPED:
        return 'badge-primary';
      case OrderStatus.DELIVERED:
        return 'badge-success';
      case OrderStatus.CANCELLED:
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">No Orders Found</h2>
        <p className="mb-6">You haven't placed any orders yet.</p>
        <Link to="/" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="card-title">
                    Order #{order.id.substring(0, 8)}
                    <div className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </div>
                  </h2>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold">${order.totalPrice.toFixed(2)}</div>
                  <div className="text-sm">{order.items.length} items</div>
                </div>
              </div>
              
              <div className="divider my-2"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {order.items.slice(0, 4).map(item => (
                  <div key={item.product.id} className="flex flex-col items-center">
                    <div className="avatar mb-2">
                      <div className="w-16 h-16">
                        <img 
                          src={item.product.image || "https://picsum.photos/100/100"} 
                          alt={item.product.name}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium line-clamp-1">{item.product.name}</div>
                      <div className="text-xs">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="flex items-center justify-center">
                    <div className="text-sm font-medium">+{order.items.length - 4} more items</div>
                  </div>
                )}
              </div>
              
              <div className="card-actions justify-end mt-4">
                <Link 
                  to={`/orders/${order.id}`} 
                  className="btn btn-sm btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
