import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  // Redirect if user is already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-md mx-auto">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
