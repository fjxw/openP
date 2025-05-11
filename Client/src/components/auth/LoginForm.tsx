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
      <div className="card-body px-6 py-8">
        <h2 className="card-title text-2xl text-center mb-8">Вход в аккаунт</h2>
        
        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => dispatch(clearError())} 
          />
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="form-control">
            <div className="text-sm font-medium mb-2">Email</div>
            <input 
              type="email" 
              placeholder="email@mail.ru" 
              className="input input-bordered w-full" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-control">
            <div className="text-sm font-medium mb-2">Пароль</div>
            <input 
              type="password" 
              placeholder="Введите пароль" 
              className="input input-bordered w-full" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-control mt-2">
            <button 
              type="submit" 
              className="btn btn-primary w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : 'Войти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
