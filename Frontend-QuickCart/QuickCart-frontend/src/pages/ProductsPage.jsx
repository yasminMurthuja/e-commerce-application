// pages/ProductsPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  fetchProducts, fetchCategories, searchProducts,
  selectProducts, selectCategories, selectProductLoading,
  selectTotalPages, selectCurrentPage,
} from '../slices/ProductSlice';
import { productAPI } from '../service/Api';
import ProductCard from '../components/ProductCard';
import '../styles/ProductsPage.css';

const ProductsPage = () => {
  const dispatch      = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const products      = useSelector(selectProducts);
  const categories    = useSelector(selectCategories);
  const loading       = useSelector(selectProductLoading);
  const totalPages    = useSelector(selectTotalPages);
  const currentPage   = useSelector(selectCurrentPage);

  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy]           = useState('createdAt');
  const [direction, setDirection]     = useState('desc');
  const [page, setPage]               = useState(0);
  const [searchKeyword]               = useState(searchParams.get('search') || '');

  const loadProducts = useCallback(() => {
    const params = { page, size: 12, sortBy, direction };
    if (searchKeyword) {
      dispatch(searchProducts({ keyword: searchKeyword, params }));
    } else if (selectedCat) {
      productAPI.getByCategory(selectedCat, params).then(res => {
        dispatch({ type: 'products/fetchAll/fulfilled', payload: res.data.data });
      });
    } else {
      dispatch(fetchProducts(params));
    }
  }, [dispatch, page, sortBy, direction, selectedCat, searchKeyword]);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);
  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleCategoryChange = (cat) => {
    setSelectedCat(cat);
    setPage(0);
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  };

  const handleSortChange = (e) => {
    const [newSort, newDir] = e.target.value.split(',');
    setSortBy(newSort);
    setDirection(newDir);
    setPage(0);
  };

  return (
    <div className="products-page">
      <div className="container">

        {/* Page Header */}
        <div className="products-header">
          <div>
            <h1>
              {searchKeyword
                ? `Search: "${searchKeyword}"`
                : selectedCat || 'All Products'}
            </h1>
            <p className="products-count">
              {loading ? 'Loading...' : `${products.length} products found`}
            </p>
          </div>
          <div className="products-controls">
            <select
              className="form-input sort-select"
              value={`${sortBy},${direction}`}
              onChange={handleSortChange}
            >
              <option value="createdAt,desc">Newest First</option>
              <option value="price,asc">Price: Low to High</option>
              <option value="price,desc">Price: High to Low</option>
              <option value="rating,desc">Top Rated</option>
              <option value="name,asc">Name A–Z</option>
            </select>
          </div>
        </div>

        <div className="products-layout">

          {/* Sidebar Filters */}
          <aside className="products-sidebar">
            <div className="filter-section">
              <h3 className="filter-title">Categories</h3>
              <ul className="filter-list">
                <li>
                  <button
                    className={`filter-btn ${selectedCat === '' ? 'active' : ''}`}
                    onClick={() => handleCategoryChange('')}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat}>
                    <button
                      className={`filter-btn ${selectedCat === cat ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(cat)}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="products-main">
            {loading ? (
              <div className="page-loader"><div className="spinner" /></div>
            ) : products.length > 0 ? (
              <>
                <div className="products-grid">
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setPage(p => p - 1)}
                      disabled={page === 0}
                    >
                      ← Prev
                    </button>
                    <div className="page-numbers">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          className={`page-num ${i === currentPage ? 'active' : ''}`}
                          onClick={() => setPage(i)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page >= totalPages - 1}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-products">
                <div className="empty-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try a different category or search term</p>
                <button className="btn btn-accent" onClick={() => handleCategoryChange('')}>
                  View All Products
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;