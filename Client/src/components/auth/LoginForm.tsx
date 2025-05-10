import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, clearError } from '../../store/slices/authSlice';
import Alert from '../ui/Alert';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isLoading, error } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to home
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) return;
    
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg max-w-md mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl text-center">Login</h2>
        
        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => dispatch(clearError())} 
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              className="input input-bordered" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input 
              type="password" 
              placeholder="password" 
              className="input input-bordered" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="label">
              <Link to="/forgot-password" className="label-text-alt link link-hover">
                Забыли пароль?
              </Link>
            </label>
          </div>
          
          <div className="form-control mt-6">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : 'Login'}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p>
              Don't have an account? <Link to="/register" className="link link-primary">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
