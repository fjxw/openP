import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getCurrentUser } from '../../store/slices/authSlice';
import { fetchCart } from '../../store/slices/cartSlice';
import { useLocation } from 'react-router';

const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isAdmin } = useAppSelector(state => state.auth);
  const location = useLocation();

  useEffect(() => {
  
    dispatch(getCurrentUser());
    
    
    if (!isAdmin) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAdmin]);


  if (isAuthenticated && isAdmin && location.pathname === '/') {
    return <Navigate to="/admin" replace />;
  }

  
  const userOnlyPaths = ['/cart', '/orders', '/checkout'];
  if (isAuthenticated && isAdmin && userOnlyPaths.some(path => location.pathname.startsWith(path))) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {isAdmin ? <AdminHeader /> : <Header />}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      {isAdmin ? <AdminFooter /> : <Footer />}
    </div>
  );
};

export default Layout;
