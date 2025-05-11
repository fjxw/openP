import React from 'react';
import { Link } from 'react-router';

const Footer: React.FC = () => {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content mt-auto">
      <nav>
        <header className="footer-title">openP</header> 
        <Link to="/" className="link link-hover">Домашняя страница</Link>
        <Link to="/profile" className="link link-hover">Профиль</Link>
        <Link to="/orders" className="link link-hover">Заказы</Link>
        <Link to="/cart" className="link link-hover">Корзина</Link>
      </nav> 
    </footer>
  );
};

export default Footer;
