import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/orderSlice';
import type { OrderWithProductDetails, Order } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import productService from '../../api/productService';
import { translateOrderStatusToRussian } from '../../utils/translations';

// Оставляем константу на английском для отправки на сервер
const ORDER_STATUSES = ['Created', 'InProgress', 'Completed', 'Cancelled'] as const;

const AdminOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading, error } = useAppSelector(state => state.orders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  
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
    try {
      setUpdatingStatus(status);
      const resultAction = await dispatch(updateOrderStatus({ id, status }));
      
      if (updateOrderStatus.fulfilled.match(resultAction)) {
        // Если у нас выбран этот заказ, обновим его локальное состояние
        if (selectedOrder && selectedOrder.orderId === id) {
          setSelectedOrder({
            ...selectedOrder,
            status: status
          });
        }
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setUpdatingStatus(null);
    }
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
      <h1 className="text-3xl font-bold mb-6">Управление заказами</h1>
      
      {error && <Alert type="error" message={error} />}
      
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>ID заказа</th>
                  <th>Дата</th>
                  <th>Клиент</th>
                  <th>Товары</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.orderId} id={String(order.orderId)}>
                    <td>{order.orderId}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{String(order.userId)}</td>
                    <td>{order.items.reduce((total, item) => total + item.quantity, 0)}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {translateOrderStatusToRussian(order.status)}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary" 
                        onClick={() => handleOpenModal(order)}
                      >
                        Управление
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
                Заказ #{selectedOrder.orderId}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold">Адрес доставки:</h4>
                  <p className="whitespace-pre-wrap">{selectedOrder.address}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Контакт:</h4>
                  <p>{selectedOrder.phone}</p>
                  <h4 className="font-semibold mt-2">Дата:</h4>
                  <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="overflow-x-auto mb-4">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Товар</th>
                      <th>Цена</th>
                      <th>Количество</th>
                      <th>Итого</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map(item => (
                      <tr key={item.productId}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="avatar">
                              <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                                <img 
                                  src={productService.getProductImage(item.productId) || "https://picsum.photos/100/100"} 
                                  alt={item.product?.name || "Product"}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <div>{item.product?.name || "Loading..."}</div>
                          </div>
                        </td>
                        <td>${item.product?.price?.toFixed(2) || "0.00"}</td>
                        <td>{item.quantity}</td>
                        <td>${((item.product?.price || 0) * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-right font-bold">Итого:</td>
                      <td className="font-bold">${selectedOrder.totalPrice.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="divider"></div>
              
              <div>
                <h4 className="font-semibold mb-2">Обновить статус:</h4>
                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUSES.map((status) => (
                    <button 
                      key={status} 
                      className={`btn btn-sm ${selectedOrder?.status === status ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleStatusChange(selectedOrder!.orderId, status)}
                      disabled={updatingStatus !== null}
                    >
                      {updatingStatus === status ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        translateOrderStatusToRussian(status)
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          
          <div className="modal-action">
            <button className="btn" onClick={handleCloseModal}>Закрыть</button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={handleCloseModal}></div>
      </dialog>
    </div>
  );
};

export default AdminOrders;
