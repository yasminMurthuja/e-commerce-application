// pages/HomePage.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, selectProducts, selectCategories, selectProductLoading } from '../slices/ProductSlice';
import ProductCard from '../components/ProductCard';
import '../styles/HomePage.css';

const CATEGORY_ICONS = {
  Electronics: '💻', Clothing: '👗', Books: '📚',
  Sports: '⚽', Home: '🏠', Beauty: '💄',
  Toys: '🧸', Food: '🍎', Default: '🛍️'
};

const HomePage = () => {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const products    = useSelector(selectProducts);
  const categories  = useSelector(selectCategories);
  const loading     = useSelector(selectProductLoading);

  useEffect(() => {
    dispatch(fetchProducts({ page: 0, size: 8, sortBy: 'createdAt', direction: 'desc' }));
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="home-page">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <span className="hero-eyebrow">New Collection 2025</span>
              <h1 className="hero-title">
                Discover Products<br />
                <span className="hero-accent">You'll Love</span>
              </h1>
              <p className="hero-subtitle">
                Shop thousands of premium products with fast delivery,
                secure payments via Razorpay, and easy returns.
              </p>
              <div className="hero-actions">
                <Link to="/products" className="btn btn-accent btn-lg">
                  Shop Now
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
                <Link to="/register" className="btn btn-outline btn-lg">
                  Create Account
                </Link>
              </div>
              <div className="hero-stats">
                <div className="stat"><strong>10K+</strong><span>Products</span></div>
                <div className="stat-divider" />
                <div className="stat"><strong>50K+</strong><span>Customers</span></div>
                <div className="stat-divider" />
                <div className="stat"><strong>4.8★</strong><span>Rating</span></div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-card hero-card-1">
                <span>📦</span>
                <div>
                  <strong>Free Delivery</strong>
                  <p>Orders above ₹499</p>
                </div>
              </div>
              <div className="hero-card hero-card-2">
                <span>🔒</span>
                <div>
                  <strong>Secure Payment</strong>
                  <p>Razorpay Protected</p>
                </div>
              </div>
              <div className="hero-card hero-card-3">
                <span>↩️</span>
                <div>
                  <strong>Easy Returns</strong>
                  <p>7-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <section className="section categories-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Shop by Category</h2>
              <Link to="/products" className="section-link">View All →</Link>
            </div>
            <div className="categories-grid">
              {categories.map(cat => (
                <button
                  key={cat}
                  className="category-card"
                  onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`)}
                >
                  <span className="category-icon">
                    {CATEGORY_ICONS[cat] || CATEGORY_ICONS.Default}
                  </span>
                  <span className="category-name">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ── */}
      <section className="section products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest Products</h2>
            <Link to="/products" className="section-link">See All →</Link>
          </div>
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : products.length > 0 ? (
            <div className="grid-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="empty-state">
              <p>No products yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Features Banner ── */}
      <section className="features-banner">
        <div className="container">
          <div className="features-grid">
            {[
              { icon: '🚀', title: 'Fast Delivery', desc: 'Get your order within 2-3 days' },
              { icon: '🔐', title: 'Secure Checkout', desc: 'Razorpay encrypted payments' },
              { icon: '🎁', title: 'Best Deals', desc: 'Daily offers and discounts' },
              { icon: '📞', title: '24/7 Support', desc: 'Always here to help you' },
            ].map(f => (
              <div key={f.title} className="feature-item">
                <span className="feature-icon">{f.icon}</span>
                <div>
                  <strong>{f.title}</strong>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;