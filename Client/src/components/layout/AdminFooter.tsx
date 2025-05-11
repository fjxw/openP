import React from 'react';
import { Link } from 'react-router';

const AdminFooter: React.FC = () => {
  return (
    <footer className="footer p-10 bg-base-100 text-neutral-content mt-auto">
      <nav>
        <header className="footer-title">Админ-навигация</header> 
        <Link to="/admin" className="link link-hover">Панель управления</Link>
        <Link to="/admin/products" className="link link-hover">Управление товарами</Link>
        <Link to="/admin/orders" className="link link-hover">Управление заказами</Link>
        <Link to="/admin/users" className="link link-hover">Управление пользователями</Link>
      </nav> 
    </footer>
  );
};

export default AdminFooter;
