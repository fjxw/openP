import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import { useAppDispatch } from '../../store/hooks';
import { getCurrentUser } from '../../store/slices/authSlice';
import { fetchCart } from '../../store/slices/cartSlice';

const Layout: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Try to fetch current user on app start
    dispatch(getCurrentUser());
    
    // Also fetch cart (will succeed only if user is logged in)
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
