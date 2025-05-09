import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';


const Header: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const { items } = useAppSelector(state => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/">Home</Link></li>
            {isAuthenticated && (
              <>
                <li><Link to="/orders">My Orders</Link></li>
                <li><Link to="/profile">Profile</Link></li>
              </>
            )}
            {user?.role === 'Admin' && (
              <li>
                <a>Admin</a>
                <ul className="p-2">
                  <li><Link to="/admin">Dashboard</Link></li>
                  <li><Link to="/admin/products">Products</Link></li>
                  <li><Link to="/admin/orders">Orders</Link></li>
                  <li><Link to="/admin/users">Users</Link></li>
                </ul>
              </li>
            )}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">E-Shop</Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/">Home</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </>
          )}
          {user?.role === 'Admin' && (
            <li>
              <details>
                <summary>Admin</summary>
                <ul className="p-2 bg-base-100 z-10">
                  <li><Link to="/admin">Dashboard</Link></li>
                  <li><Link to="/admin/products">Products</Link></li>
                  <li><Link to="/admin/orders">Orders</Link></li>
                  <li><Link to="/admin/users">Users</Link></li>
                </ul>
              </details>
            </li>
          )}
        </ul>
      </div>
      
      <div className="navbar-end">
        <form onSubmit={handleSearch} className="form-control mr-2">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Search..." 
              className="input input-bordered input-sm" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-square btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
        
        <Link to="/cart" className="btn btn-ghost btn-circle mr-2">
          <div className="indicator">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {items.length > 0 && (
              <span className="badge badge-sm indicator-item">{items.length}</span>
            )}
          </div>
        </Link>
        
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <div className="flex items-center justify-center h-full bg-primary text-primary-content">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li><a onClick={handleLogout}>Logout</a></li>
            </ul>
          </div>
        ) : (
          <div className="flex">
            <Link to="/login" className="btn btn-sm btn-primary mr-2">Login</Link>
            <Link to="/register" className="btn btn-sm btn-outline">Register</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
