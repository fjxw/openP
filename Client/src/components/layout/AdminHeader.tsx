import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

const AdminHeader: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="navbar bg-base-100 px-4">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 text-base-content rounded-box w-52">
            <li><Link to="/admin">Панель управления</Link></li>
            <li><Link to="/admin/products">Управление товарами</Link></li>
            <li><Link to="/admin/orders">Управление заказами</Link></li>
            <li><Link to="/admin/users">Управление пользователями</Link></li>
          </ul>
        </div>
        <Link to="/" className="text-xl font-bold ml-4">openP</Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/admin">Панель управления</Link></li>
          <li><Link to="/admin/products">Товары</Link></li>
          <li><Link to="/admin/orders">Заказы</Link></li>
          <li><Link to="/admin/users">Пользователи</Link></li>
        </ul>
      </div>
      
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-primary text-primary-content">
              <span className="flex items-center justify-center h-full text-lg font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'А'}
              </span>
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 text-base-content rounded-box w-52">
            <li><Link to="/profile">Профиль</Link></li>
            <li><a onClick={handleLogout}>Выход</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
