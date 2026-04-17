// components/layout/Navbar.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser, selectIsLoggedIn, selectIsAdmin } from '../slices/AuthSlice';
import { selectCartCount, resetCart } from '../slices/CartSlice';
import '../styles/Navbar.css';

const Navbar = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const user       = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAdmin    = useSelector(selectIsAdmin);
  const cartCount  = useSelector(selectCartCount);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCart());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">Q</span>
          <span className="logo-text">QuickCart</span>
        </Link>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="navbar-search-input"
          />
          <button type="submit" className="navbar-search-btn" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </form>

        {/* Nav Actions */}
        <nav className="navbar-actions">
          <Link to="/products" className="nav-link">Products</Link>

          {isAdmin && (
            <Link to="/admin" className="nav-link nav-admin">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Admin
            </Link>
          )}

          {isLoggedIn && !isAdmin && (
            <Link to="/cart" className="nav-cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {isLoggedIn ? (
            <div className="nav-user">
              <div className="user-avatar">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="user-dropdown">
                <div className="user-dropdown-name">{user?.fullName}</div>
                <div className="user-dropdown-email">{user?.email}</div>
                <div className="dropdown-divider" />
                {!isAdmin && (
                  <Link to="/orders" className="dropdown-item">My Orders</Link>
                )}
                <button onClick={handleLogout} className="dropdown-item dropdown-logout">
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login"    className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-accent btn-sm">Sign Up</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          {isLoggedIn ? (
            <>
              {!isAdmin && <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart ({cartCount})</Link>}
              {!isAdmin && <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>}
              {isAdmin  && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>}
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;