import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllOrders } from '../../store/slices/orderSlice';
import { translateOrderStatusToRussian } from '../../utils/translations';
import { formatShortDate } from '../../utils/dateUtils';

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector(state => state.orders);
  const [statistics, setStatistics] = useState({
    totalSales: 0,
    createdOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  });

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orders.length > 0) {
      const stats = {
        totalSales: orders.reduce((sum, order) => sum + order.totalPrice, 0),
        createdOrders: orders.filter(o => o.status === 'Created').length,
        inProgressOrders: orders.filter(o => o.status === "InProgress").length,
        completedOrders: orders.filter(o => o.status === 'Completed').length,
        cancelledOrders: orders.filter(o => o.status === 'Cancelled').length,
      };
      setStatistics(stats);
    }
  }, [orders]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Панель управления</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-base-100 shadow">
          <div className="stat-title">Общая выручка</div>
          <div className="stat-value">{statistics.totalSales.toFixed(2)} ₽</div>
          <div className="stat-desc">Все продажи</div>
        </div>
        
        <div className="stat bg-base-100 shadow">
          <div className="stat-title">Всего заказов</div>
          <div className="stat-value">{orders.length}</div>
          <div className="stat-desc">Все заказы</div>
        </div>
        
        <div className="stat bg-base-100 shadow">
          <div className="stat-title">Ожидающие заказы</div>
          <div className="stat-value">{statistics.createdOrders}</div>
          <div className="stat-desc">Требуют внимания</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Статусы заказов</h2>
            <div className="divider mt-0"></div>
            
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="badge badge-warning mr-2"></span>
                  <span>{translateOrderStatusToRussian('Created')}</span>
                </div>
                <span className="font-bold">{statistics.createdOrders}</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="badge badge-info mr-2"></span>
                  <span>{translateOrderStatusToRussian('InProgress')}</span>
                </div>
                <span className="font-bold">{statistics.inProgressOrders}</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="badge badge-primary mr-2"></span>
                  <span>{translateOrderStatusToRussian('Completed')}</span>
                </div>
                <span className="font-bold">{statistics.completedOrders}</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="badge badge-error mr-2"></span>
                  <span>{translateOrderStatusToRussian('Cancelled')}</span>
                </div>
                <span className="font-bold">{statistics.cancelledOrders}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Быстрые действия</h2>
            <div className="divider mt-0"></div>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/admin/products" className="btn btn-primary">
                Управление товарами
              </Link>
              <Link to="/admin/orders" className="btn btn-primary">
                Управление заказами
              </Link>
              <Link to="/admin/users" className="btn btn-primary">
                Управление пользователями
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Последние заказы</h2>
          <div className="divider mt-0"></div>
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>ID заказа</th>
                  <th>Дата</th>
                  <th>Клиент</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order.orderId}>
                    <td>#{order.orderId}</td>
                    <td>{formatShortDate(order.orderDate)}</td>
                    <td>{order.userId}</td>
                    <td>{order.totalPrice.toFixed(2)} ₽</td>
                    <td>
                      <span className={`badge ${
                        order.status === 'Created' ? 'badge-warning' :
                        order.status === 'InProgress' ? 'badge-info' :
                        order.status === 'Completed' ? 'badge-primary' :
                        'badge-error'
                      }`}>
                        {translateOrderStatusToRussian(order.status)}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/orders#${order.orderId}`} className="btn btn-xs btn-outline">
                        Просмотр
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="card-actions justify-end mt-4">
            <Link to="/admin/orders" className="btn btn-sm btn-primary">
              Все заказы
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
