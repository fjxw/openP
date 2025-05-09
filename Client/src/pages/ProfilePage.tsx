import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { deleteAccount, logout } from '../store/slices/authSlice';
import Alert from '../components/ui/Alert';

const ProfilePage: React.FC = () => {
  const { user, error } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
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
    return <Alert type="warning" message="You are not logged in" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body items-center text-center">
            <div className="avatar">
              <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xl">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
            <h2 className="card-title mt-4">{user.username}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="badge badge-primary mt-2">{user.role}</div>
          </div>
        </div>
      </div>
      
      <div className="md:col-span-2">
        <div className="card bg-base-100 shadow-lg mb-8">
          <div className="card-body">
            <h2 className="card-title">Account Settings</h2>
            <div className="divider mt-0"></div>
            
            {error && <Alert type="error" message={error} />}
            
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="text" 
                value={user.email} 
                className="input input-bordered w-full" 
                disabled 
              />
            </div>
            
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input 
                type="text" 
                value={user.username} 
                className="input input-bordered w-full" 
                disabled 
              />
            </div>
            
            <div className="form-control w-full mb-8">
              <label className="label">
                <span className="label-text">Theme</span>
              </label>
              <div className="flex flex-wrap gap-2">
                <button 
                  className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handleThemeChange('light')}
                >
                  Light
                </button>
                <button 
                  className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handleThemeChange('dark')}
                >
                  Dark
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleLogout} className="btn btn-outline btn-primary">
                Logout
              </button>
              <button onClick={() => setIsDeleteModalOpen(true)} className="btn btn-error">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Account Modal */}
      <dialog id="delete_modal" className={`modal ${isDeleteModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Account</h3>
          <p className="py-4">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be lost.
          </p>
          <div className="modal-action">
            <button className="btn" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleDeleteAccount}>
              Delete
            </button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={() => setIsDeleteModalOpen(false)}></div>
      </dialog>
    </div>
  );
};

export default ProfilePage;
