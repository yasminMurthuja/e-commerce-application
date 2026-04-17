import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, selectIsLoggedIn, selectAuthLoading, clearError } from '../slices/AuthSlice';
import '../styles/AuthPage.css';

const RegisterPage = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const loading    = useSelector(selectAuthLoading);

  const [form, setForm] = useState({
    fullName:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
    phoneNumber:     ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isLoggedIn) navigate('/', { replace: true });
    return () => dispatch(clearError());
  }, [isLoggedIn, navigate, dispatch]);

  // Update a single field in the form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())                        e.fullName        = 'Full name is required';
    if (!form.email)                                  e.email           = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))        e.email           = 'Invalid email';
    if (!form.password)                               e.password        = 'Password is required';
    else if (form.password.length < 6)                e.password        = 'Min 6 characters';
    if (form.password !== form.confirmPassword)       e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...payload } = form;
    dispatch(registerUser(payload));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <span className="logo-icon">Q</span>
            <span className="logo-text">QuickCart</span>
          </Link>
          <h1>Create account</h1>
          <p>Join thousands of happy shoppers</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className={`form-input ${errors.fullName ? 'input-error' : ''}`}
              placeholder="John Doe"
              value={form.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <span className="form-error">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              className="form-input"
              placeholder="+91 9876543210"
              value={form.phoneNumber}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              placeholder="Min 6 characters"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-accent btn-full"
            disabled={loading}
          >
            {loading
              ? <><span className="btn-spinner" /> Creating account...</>
              : 'Create Account'
            }
          </button>

        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in →</Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;