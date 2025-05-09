import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/orderSlice';
import type { Order } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';

const ORDER_STATUSES = ['Created', 'InProgress', 'Completed', 'Cancelled'] as const;

const AdminOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading, error } = useAppSelector(state => state.orders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);
  
  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };
  
  const handleStatusChange = async (id: number, status: string) => {
    await dispatch(updateOrderStatus({ id, status }));
    handleCloseModal();
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Created':
        return 'badge-warning';
      case 'InProgress':
        return 'badge-info';
      case 'Completed':
        return 'badge-primary';
      case 'Cancelled':
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      
      {error && <Alert type="error" message={error} />}
      
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} id={String(order.id)}>
                    <td>#{order.id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{String(order.userId)}</td>
                    <td>{order.items.length}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary" 
                        onClick={() => handleOpenModal(order)}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Order Detail Modal */}
      <dialog id="order_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-3xl">
          {selectedOrder && (
            <>
              <h3 className="font-bold text-lg mb-4">
                Order #{selectedOrder.id}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold">Shipping Address:</h4>
                  <p className="whitespace-pre-wrap">{selectedOrder.address}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Contact:</h4>
                  <p>{selectedOrder.phone}</p>
                  <h4 className="font-semibold mt-2">Date:</h4>
                  <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="overflow-x-auto mb-4">
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
                    {selectedOrder.items.map(item => (
                      <tr key={item.product.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="avatar">
                              <div className="w-10 h-10">
                                <img 
                                  src={item.product.image || "https://picsum.photos/100/100"} 
                                  alt={item.product.name}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <div>{item.product.name}</div>
                          </div>
                        </td>
                        <td>${item.product.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-right font-bold">Total:</td>
                      <td className="font-bold">${selectedOrder.totalPrice.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="divider"></div>
              
              <div>
                <h4 className="font-semibold mb-2">Update Status:</h4>
                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUSES.map((status) => (
                    <button 
                      key={status} 
                      className={`btn btn-sm ${selectedOrder.status === status ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleStatusChange(selectedOrder.id, status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          
          <div className="modal-action">
            <button className="btn" onClick={handleCloseModal}>Close</button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={handleCloseModal}></div>
      </dialog>
    </div>
  );
};

export default AdminOrders;
