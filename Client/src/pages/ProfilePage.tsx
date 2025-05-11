import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { deleteAccount, logout, updateUser } from '../store/slices/authSlice';
import Alert from '../components/ui/Alert';
import userService from '../api/userService';
import { useTheme } from '../hooks/useTheme';
import { translateRoleToRussian } from '../utils/translations';

const ProfilePage: React.FC = () => {
  const { user, error } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { theme, changeTheme, availableThemes } = useTheme();
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });

  const handleThemeChange = (newTheme: string) => {
    changeTheme(newTheme);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setFormData({
        username: user?.username || '',
        email: user?.email || '',
        password: '',
        confirmPassword: ''
      });
      setUpdateError(null);
      setSuccessMessage(null);
    }
    setIsEditing(!isEditing);
  };

  const validateForm = () => {
    if (
      formData.username === user?.username && 
      formData.email === user?.email && 
      !formData.password
    ) {
      setUpdateError('Необходимо внести изменения хотя бы в одно поле');
      return false;
    }
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      setUpdateError('Пароли не совпадают');
      return false;
    }
    
    if (formData.password && formData.password.length < 6) {
      setUpdateError('Пароль должен содержать не менее 6 символов');
      return false;
    }
    
    return true;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setUpdateError(null);
    setSuccessMessage(null);
    
    try {
      const updateData: any = {};
      
      if (formData.username !== user?.username) {
        updateData.username = formData.username;
      }
      
      if (formData.email !== user?.email) {
        updateData.email = formData.email;
      }
      
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      dispatch(updateUser({
        ...user,
        username: formData.username || user?.username,
        email: formData.email || user?.email
      }));
      
      setSuccessMessage('Профиль успешно обновлен');
      setIsEditing(false);
    } catch (error: any) {
      setUpdateError(error.message || 'Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('This action cannot be undone. Are you sure you want to delete your account?')) {
      const result = await dispatch(deleteAccount());
      if (deleteAccount.fulfilled.match(result)) {
        navigate('/');
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) {
    return <Alert type="warning" message="Вы не авторизованы" />;
  }

  const firstLetter = user.username ? user.username.charAt(0).toUpperCase() : 'П';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body items-center text-center">
            <div className="avatar">
              <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center relative">
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold">
                  {firstLetter}
                </span>
              </div>
            </div>
            <h2 className="card-title mt-4">{user.username || 'Пользователь'}</h2>
            <p className="text-sm text-gray-500">{user.email || ''}</p>
            <div className="badge badge-primary mt-2">{translateRoleToRussian(user.role)}</div>
          </div>
        </div>
      </div>
      
      <div className="md:col-span-2">
        <div className="card bg-base-100 shadow-lg mb-8">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">Настройки аккаунта</h2>
              <button 
                className={`btn btn-sm ${isEditing ? 'btn-outline' : 'btn-primary'}`} 
                onClick={handleEditToggle}
              >
                {isEditing ? 'Отмена' : 'Редактировать профиль'}
              </button>
            </div>
            <div className="divider mt-0"></div>
            
            {error && <Alert type="error" message={error} />}
            {updateError && <Alert type="error" message={updateError} onClose={() => setUpdateError(null)} />}
            {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />}
            
            {isEditing ? (
              <form onSubmit={handleProfileUpdate}>
                <div className="form-control w-full mb-4">
                  <label className="text-sm font-medium mb-2">Имя пользователя</label>
                  <input 
                    type="text" 
                    name="username"
                    value={formData.username} 
                    onChange={handleInputChange}
                    className="input input-bordered w-full" 
                    required
                  />
                </div>
                
                <div className="form-control w-full mb-4">
                  <label className="text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email} 
                    onChange={handleInputChange}
                    className="input input-bordered w-full" 
                    required
                  />
                </div>
                
                <div className="form-control w-full mb-4">
                  <label className="text-sm font-medium mb-2">Новый пароль</label>
                  <input 
                    type="password"
                    name="password"
                    value={formData.password} 
                    onChange={handleInputChange}
                    className="input input-bordered w-full" 
                    placeholder="Оставьте пустым, чтобы сохранить текущий пароль"
                  />
                </div>
                
                {formData.password && (
                  <div className="form-control w-full mb-6">
                    <label className="text-sm font-medium mb-2">Подтвердите новый пароль</label>
                    <input 
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword} 
                      onChange={handleInputChange}
                      className="input input-bordered w-full" 
                      required={!!formData.password}
                    />
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Сохранить изменения'}
                </button>
              </form>
            ) : (
              <>
                <div className="form-control w-full mb-4">
                  <label className="text-sm font-medium mb-2">Email</label>
                  <input 
                    type="text" 
                    value={user.email || ''} 
                    className="input input-bordered w-full" 
                    disabled 
                  />
                </div>
                
                <div className="form-control w-full mb-4">
                  <label className="text-sm font-medium mb-2">Имя пользователя</label>
                  <input 
                    type="text" 
                    value={user.username || ''} 
                    className="input input-bordered w-full" 
                    disabled 
                  />
                </div>
                
                <div className="form-control w-full mb-8">
                  <label className="text-sm font-medium mb-2">Тема</label>
                  <div className="flex flex-wrap gap-2">
                    {availableThemes.map(t => (
                      <button 
                        key={t.id}
                        className={`btn btn-sm ${theme === t.id ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleThemeChange(t.id)}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={handleLogout} className="btn btn-outline btn-primary">
                    Выйти
                  </button>
                  <button onClick={() => setIsDeleteModalOpen(true)} className="btn btn-error">
                    Удалить аккаунт
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <dialog id="delete_modal" className={`modal ${isDeleteModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Удаление аккаунта</h3>
          <p className="py-4">
            Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить, и все ваши данные будут потеряны.
          </p>
          <div className="modal-action">
            <button className="btn" onClick={() => setIsDeleteModalOpen(false)}>
              Отмена
            </button>
            <button className="btn btn-error" onClick={handleDeleteAccount}>
              Удалить
            </button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={() => setIsDeleteModalOpen(false)}></div>
      </dialog>
    </div>
  );
};

export default ProfilePage;
