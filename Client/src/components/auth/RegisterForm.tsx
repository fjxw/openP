import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register, clearError } from '../../store/slices/authSlice';
import Alert from '../ui/Alert';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { isLoading, error } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    if (password !== confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError("Пароль должен содержать не менее 6 символов");
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await dispatch(register({ username, email, password }));
    if (register.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg max-w-md mx-auto">
      <div className="card-body px-6 py-8">
        <h2 className="card-title text-2xl text-center mb-8">Регистрация аккаунта</h2>
        
        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => dispatch(clearError())} 
          />
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="form-control">
            <div className="text-sm font-medium mb-2">Имя пользователя</div>
            <input 
              type="text" 
              placeholder="Введите имя пользователя" 
              className="input input-bordered w-full" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
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
          
          <div className="form-control">
            <div className="text-sm font-medium mb-2">Подтверждение пароля</div>
            <input 
              type="password" 
              placeholder="Повторите пароль" 
              className="input input-bordered w-full" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordError && (
              <p className="text-xs text-error mt-2">{passwordError}</p>
            )}
          </div>
          
          <div className="form-control mt-2">
            <button 
              type="submit" 
              className="btn btn-primary w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : 'Зарегистрироваться'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
