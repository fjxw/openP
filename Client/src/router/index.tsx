import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from '../App';
import HomePage from '../pages/HomePage';
import ProductPage from '../pages/ProductPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrdersPage from '../pages/OrdersPage';
import OrderConfirmationPage from '../pages/OrderConfirmationPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminUsers from '../pages/admin/AdminUsers';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from '../routes/ProtectedRoute';
import AdminRoute from '../routes/AdminRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'products/:id',
        element: <ProductPage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'cart',
        element: <CartPage />
      },
      {
        path: 'checkout',
        element: <ProtectedRoute><CheckoutPage /></ProtectedRoute>
      },
      {
        path: 'orders',
        element: <ProtectedRoute><OrdersPage /></ProtectedRoute>
      },
      {
        path: 'orders/:id',
        element: <ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>
      },
      {
        path: 'admin',
        element: <AdminRoute><AdminDashboard /></AdminRoute>
      },
      {
        path: 'admin/products',
        element: <AdminRoute><AdminProducts /></AdminRoute>
      },
      {
        path: 'admin/orders',
        element: <AdminRoute><AdminOrders /></AdminRoute>
      },
      {
        path: 'admin/users',
        element: <AdminRoute><AdminUsers /></AdminRoute>
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
