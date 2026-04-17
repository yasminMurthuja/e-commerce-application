// pages/ProductDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, selectSelectedProduct, selectProductLoading } from '../slices/ProductSlice';
import { addToCart, selectCartLoading } from '../slices/CartSlice';
import { selectIsLoggedIn } from '../slices/AuthSlice';
import '../styles/ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id }       = useParams();
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const product      = useSelector(selectSelectedProduct);
  const loading      = useSelector(selectProductLoading);
  const cartLoading  = useSelector(selectCartLoading);
  const isLoggedIn   = useSelector(selectIsLoggedIn);
  const [qty, setQty]     = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => { dispatch(fetchProductById(id)); }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    dispatch(addToCart({ productId: product.id, quantity: qty }));
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    dispatch(addToCart({ productId: product.id, quantity: qty }));
    navigate('/cart');
  };

  if (loading || !product) {
    return <div className="page-loader"><div className="spinner" /></div>;
  }

  const placeholder = `https://placehold.co/600x450/f1f5f9/94a3b8?text=${encodeURIComponent(product.name.split(' ')[0])}`;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => navigate('/products')}>Products</button>
          <span>›</span>
          <span>{product.category}</span>
          <span>›</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          {/* Image */}
          <div className="product-detail-image-wrapper">
            <img
              src={product.imageUrl || placeholder}
              alt={product.name}
              onError={e => { e.target.src = placeholder; }}
              className="product-detail-image"
            />
            {product.discountPercent > 0 && (
              <span className="detail-discount-badge">-{product.discountPercent}% OFF</span>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            {product.brand && <span className="detail-brand">{product.brand}</span>}
            <h1 className="detail-title">{product.name}</h1>

            {/* Rating */}
            <div className="detail-rating">
              <div className="detail-stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < Math.round(product.rating || 0) ? 'star-filled' : 'star-empty'}>★</span>
                ))}
              </div>
              <span className="detail-rating-text">
                {product.rating?.toFixed(1) || '0.0'} ({product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="detail-price-block">
              <span className="detail-price">₹{product.price?.toLocaleString('en-IN')}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="detail-original">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                  <span className="detail-savings">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className={`detail-stock ${product.stockQuantity > 0 ? 'in-stock' : 'out-stock'}`}>
              {product.stockQuantity > 0
                ? `✓ In Stock (${product.stockQuantity} available)`
                : '✗ Out of Stock'}
            </div>

            {/* Quantity */}
            {product.stockQuantity > 0 && (
              <div className="qty-selector">
                <span className="qty-label">Quantity</span>
                <div className="qty-controls">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stockQuantity, q + 1))} disabled={qty >= product.stockQuantity}>+</button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="detail-actions">
              <button
                className="btn btn-outline btn-lg"
                onClick={handleAddToCart}
                disabled={cartLoading || product.stockQuantity === 0}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-accent btn-lg"
                onClick={handleBuyNow}
                disabled={product.stockQuantity === 0}
              >
                Buy Now
              </button>
            </div>

            {/* Badges */}
            <div className="detail-badges">
              <span>🚚 Free delivery above ₹499</span>
              <span>🔒 Secure Razorpay payment</span>
              <span>↩️ 7-day return</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <div className="tab-headers">
            {['description', 'specifications'].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {activeTab === 'description' && (
              <p className="detail-description">
                {product.description || 'No description available for this product.'}
              </p>
            )}
            {activeTab === 'specifications' && (
              <table className="spec-table">
                <tbody>
                  <tr><td>Brand</td><td>{product.brand || 'N/A'}</td></tr>
                  <tr><td>Category</td><td>{product.category}</td></tr>
                  <tr><td>Stock</td><td>{product.stockQuantity} units</td></tr>
                  <tr><td>Rating</td><td>{product.rating?.toFixed(1)} / 5.0</td></tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;