// components/product/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartLoading } from '../slices/CartSlice';
import { selectIsLoggedIn } from '../slices/AuthSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductCard.css';

const StarRating = ({ rating }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="stars">
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const loading    = useSelector(selectCartLoading);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) { navigate('/login'); return; }
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  const placeholderImg = `https://placehold.co/400x300/f1f5f9/94a3b8?text=${encodeURIComponent(product.name.split(' ')[0])}`;

  const getDirectImageUrl = (url) => {
  if (!url) return placeholderImg;
  // Already a direct image URL
  if (url.includes('images.pexels.com') || url.match(/\.(jpg|jpeg|png|webp)$/i)) return url;
  // Extract ID from Pexels page URL
  const match = url.match(/(\d+)\/?$/);
  if (match && url.includes('pexels.com')) {
    return `https://images.pexels.com/photos/${match[1]}/pexels-photo-${match[1]}.jpeg`;
  }
  return placeholderImg;
};

  console.log('Image URL:', product.imageUrl);
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-image">
        <img
          // src={product.imageUrl || placeholderImg}
          src={getDirectImageUrl(product.imageUrl)}
          alt={product.name}
          onError={(e) => { e.target.src = placeholderImg; }}
        />
        {product.discountPercent > 0 && (
          <span className="discount-badge">-{product.discountPercent}%</span>
        )}
        {product.stockQuantity === 0 && (
          <div className="out-of-stock-overlay">Out of Stock</div>
        )}
      </div>

      <div className="product-card-body">
        {product.brand && (
          <span className="product-brand">{product.brand}</span>
        )}
        <h3 className="product-name">{product.name}</h3>

        <div className="product-rating">
          <StarRating rating={product.rating || 0} />
          <span className="review-count">({product.reviewCount || 0})</span>
        </div>

        <div className="product-price-row">
          <div className="product-prices">
            <span className="product-price">₹{product.price?.toLocaleString('en-IN')}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="product-original-price">
                ₹{product.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={loading || product.stockQuantity === 0}
            aria-label="Add to cart"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;