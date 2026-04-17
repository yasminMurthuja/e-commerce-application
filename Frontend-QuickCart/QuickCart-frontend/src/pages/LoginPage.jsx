// pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectIsLoggedIn, selectAuthLoading, clearError } from '../slices/AuthSlice';
import '../styles/AuthPage.css';

const LoginPage = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const loading    = useSelector(selectAuthLoading);

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isLoggedIn) navigate(from, { replace: true });
    return () => dispatch(clearError());
  }, [isLoggedIn, navigate, from, dispatch]);

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    dispatch(loginUser(form));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <span className="logo-icon">Q</span>
            <span className="logo-text">Quickcart</span>
          </Link>
          <h1>Welcome back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-accent btn-full" disabled={loading}>
            {loading ? <><span className="btn-spinner" /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="demo-hint">
          <p><strong>Demo Admin:</strong> admin@shopnest.com / admin123</p>
          <p><strong>Demo User:</strong> user@shopnest.com / user123</p>
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one →</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;