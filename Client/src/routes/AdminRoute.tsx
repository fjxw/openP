import React from 'react';
import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default AdminRoute;
