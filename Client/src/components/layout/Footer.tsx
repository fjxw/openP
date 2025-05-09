import React from 'react';
import { Link } from 'react-router';

const Footer: React.FC = () => {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content mt-auto">
      <nav>
        <header className="footer-title">Shop</header> 
        <Link to="/" className="link link-hover">Home</Link>
        <Link to="/" className="link link-hover">Products</Link>
        <Link to="/cart" className="link link-hover">Cart</Link>
      </nav> 
      <nav>
        <header className="footer-title">Account</header> 
        <Link to="/profile" className="link link-hover">Profile</Link>
        <Link to="/orders" className="link link-hover">Orders</Link>
        <Link to="/login" className="link link-hover">Login</Link>
        <Link to="/register" className="link link-hover">Register</Link>
      </nav> 
      <nav>
        <header className="footer-title">Legal</header> 
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
        <a className="link link-hover">Cookie policy</a>
      </nav>
    </footer>
  );
};

export default Footer;
