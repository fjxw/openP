import React from 'react';
import { Routes, Route, Navigate } from 'react-router';

import Layout from '../components/layout/Layout';

import HomePage from '../pages/HomePage';
import ProductPage from '../pages/ProductPage';
import CartPage from '../pages/CartPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderConfirmationPage from '../pages/OrderConfirmationPage';
import OrdersPage from '../pages/OrdersPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';

import ProtectedRoute from './ProtectedRoute';

const allowedRoles: string[] = ["Admin"];
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
      
        <Route index element={<HomePage />} />
        <Route path="products/:id" element={<ProductPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        
      
        <Route path="cart" element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="orders" element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        } />
        <Route path="orders/:id" element={
          <ProtectedRoute>
            <OrderConfirmationPage />
          </ProtectedRoute>
        } />
        
        <Route path="admin" element={
          <ProtectedRoute allowedRoles={allowedRoles}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="admin/products" element={
          <ProtectedRoute allowedRoles={allowedRoles}>
            <AdminProducts />
          </ProtectedRoute>
        } />
        <Route path="admin/users" element={
          <ProtectedRoute allowedRoles={allowedRoles}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="admin/orders" element={
          <ProtectedRoute allowedRoles={allowedRoles}>
            <AdminOrders />
          </ProtectedRoute>
        } />
        

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
