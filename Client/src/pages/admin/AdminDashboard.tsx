import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllOrders } from '../../store/slices/orderSlice';

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

  // Calculate statistics from orders
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
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-base-100 shadow">
          <div className="stat-title">Total Sales</div>
          <div className="stat-value">${statistics.totalSales.toFixed(2)}</div>
          <div className="stat-desc">All-time revenue</div>
        </div>
        
        <div className="stat bg-base-100 shadow">
          <div className="stat-title">Total Orders</div>
          <div className="stat-value">{orders.length}</div>
          <div className="stat-desc">All orders</div>
        </div>
        
        <div className="stat bg-base-100 shadow">
          <div className="stat-title">Pending Orders</div>
          <div className="stat-value">{statistics.createdOrders}</div>
          <div className="stat-desc">Require attention</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Order Status</h2>
            <div className="divider mt-0"></div>
            
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="badge badge-warning mr-2"></span>
                  <span>Pending</span>
                </div>
                <span className="font-bold">{statistics.createdOrders}</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="badge badge-info mr-2"></span>
                  <span>Processing</span>
                </div>
                <span className="font-bold">{statistics.inProgressOrders}</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="badge badge-primary mr-2"></span>
                  <span>Shipped</span>
                </div>
                <span className="font-bold">{statistics.completedOrders}</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="badge badge-error mr-2"></span>
                  <span>Cancelled</span>
                </div>
                <span className="font-bold">{statistics.cancelledOrders}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <div className="divider mt-0"></div>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/admin/products" className="btn btn-primary">
                Manage Products
              </Link>
              <Link to="/admin/orders" className="btn btn-primary">
                Manage Orders
              </Link>
              <Link to="/admin/users" className="btn btn-primary">
                Manage Users
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Recent Orders</h2>
          <div className="divider mt-0"></div>
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order.orderId}>
                    <td>#{order.orderId}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.userId}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${
                        order.status === 'Created' ? 'badge-warning' :
                        order.status === 'InProgress' ? 'badge-info' :
                        order.status === 'Completed' ? 'badge-primary' :
                        'badge-error'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/orders#${order.orderId}`} className="btn btn-xs btn-outline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="card-actions justify-end mt-4">
            <Link to="/admin/orders" className="btn btn-sm btn-primary">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
