import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAppSelector } from '../store/hooks';

import LoadingSpinner from '../components/ui/LoadingSpinner';

interface UserRouteProps {
  children: ReactNode;
}

const UserRoute: React.FC<UserRouteProps> = ({ children }) => {
  const { isAdmin, isLoading } = useAppSelector(state => state.auth);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default UserRoute;
