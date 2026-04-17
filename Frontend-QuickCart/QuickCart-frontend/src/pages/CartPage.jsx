// pages/CartPage.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCart, updateCartItem, removeFromCart, clearCart,
  selectCart, selectCartItems, selectCartLoading
} from '../slices/CartSlice';
import '../styles/CartPage.css';

// ── Pexels URL fixer ──────────────────────────────────────────────
const getDirectImageUrl = (url, fallback) => {
  if (!url) return fallback;
  if (url.includes('images.pexels.com') || url.match(/\.(jpg|jpeg|png|webp)$/i)) return url;
  const match = url.match(/(\d+)\/?$/);
  if (match && url.includes('pexels.com')) {
    return `https://images.pexels.com/photos/${match[1]}/pexels-photo-${match[1]}.jpeg`;
  }
  return fallback;
};
// ─────────────────────────────────────────────────────────────────

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart     = useSelector(selectCart);
  const items    = useSelector(selectCartItems);
  const loading  = useSelector(selectCartLoading);

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  const handleQtyChange = (cartItemId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateCartItem({ cartItemId, quantity: newQty }));
  };

  const handleRemove = (cartItemId) => {
    dispatch(removeFromCart(cartItemId));
  };

  if (loading && !cart) {
    return <div className="page-loader"><div className="spinner" /></div>;
  }

  if (!items.length) {
    return (
      <div className="cart-empty-page">
        <div className="container">
          <div className="cart-empty">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" className="btn btn-accent btn-lg">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">
          Shopping Cart
          <span className="cart-title-count">({cart?.totalItems || 0} items)</span>
        </h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span />
            </div>

            {items.map(item => {
              const fallback = `https://placehold.co/80x80/f1f5f9/94a3b8?text=${encodeURIComponent(item.productName.charAt(0))}`;
              const imgSrc   = getDirectImageUrl(item.productImage, fallback);

              return (
                <div key={item.cartItemId} className="cart-item">
                  <div className="cart-item-product">
                    <img
                      src={imgSrc}
                      alt={item.productName}
                      onError={e => { e.target.src = fallback; }}
                    />
                    <div>
                      <Link to={`/products/${item.productId}`} className="cart-item-name">
                        {item.productName}
                      </Link>
                      {item.brand && <span className="cart-item-brand">{item.brand}</span>}
                    </div>
                  </div>
                  <div className="cart-item-price">₹{item.unitPrice?.toLocaleString('en-IN')}</div>
                  <div className="cart-item-qty">
                    <button onClick={() => handleQtyChange(item.cartItemId, item.quantity - 1)} disabled={item.quantity <= 1 || loading}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQtyChange(item.cartItemId, item.quantity + 1)} disabled={item.quantity >= item.stockQuantity || loading}>+</button>
                  </div>
                  <div className="cart-item-total">₹{item.totalPrice?.toLocaleString('en-IN')}</div>
                  <button className="cart-item-remove" onClick={() => handleRemove(item.cartItemId)} disabled={loading} aria-label="Remove item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              );
            })}

            <button className="btn btn-ghost btn-sm clear-cart-btn" onClick={() => dispatch(clearCart())}>
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({cart?.totalItems || 0} items)</span>
                <span>₹{cart?.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={cart?.shippingCharge === 0 ? 'free-shipping' : ''}>
                  {cart?.shippingCharge === 0 ? 'FREE' : `₹${cart?.shippingCharge}`}
                </span>
              </div>
              {cart?.shippingCharge > 0 && (
                <div className="free-shipping-hint">
                  Add ₹{(499 - cart?.subtotal).toFixed(0)} more for free shipping!
                </div>
              )}
            </div>

            <div className="divider" />

            <div className="summary-total">
              <span>Total</span>
              <span>₹{cart?.totalAmount?.toLocaleString('en-IN')}</span>
            </div>

            <button
              className="btn btn-accent btn-full btn-lg"
              onClick={() => navigate('/checkout')}
              disabled={loading}
            >
              Proceed to Checkout
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>

            <Link to="/products" className="btn btn-ghost btn-full continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;