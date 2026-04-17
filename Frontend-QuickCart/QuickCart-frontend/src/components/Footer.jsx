// components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-brand">
        <div className="footer-logo">
          <span className="logo-icon">Q</span>
          <span className="logo-text">QuickCart</span>
        </div>
        <p className="footer-tagline">Your one-stop destination for premium shopping.</p>
      </div>
      <div className="footer-links">
        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?category=Electronics">Electronics</Link>
          <Link to="/products?category=Clothing">Clothing</Link>
          <Link to="/products?category=Books">Books</Link>
        </div>
        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Returns</a>
          <a href="#">Shipping Info</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="container">
        <p>© 2025 QuickCart. Built with React, Redux Toolkit & Spring Boot.</p>
      </div>
    </div>
  </footer>
);

export default Footer;