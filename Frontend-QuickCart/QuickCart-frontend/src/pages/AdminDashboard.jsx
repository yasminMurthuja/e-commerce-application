// pages/admin/AdminDashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { adminAPI, productAPI } from '../service/Api';
import toast from 'react-hot-toast';
import '../styles/AdminDashboard.css';

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

const TABS = ['Dashboard', 'Products', 'Orders'];

const AdminDashboard = () => {
  const [activeTab,   setActiveTab]  = useState('Dashboard');
  const [stats,       setStats]      = useState(null);
  const [products,    setProducts]   = useState([]);
  const [orders,      setOrders]     = useState([]);
  const [loading,     setLoading]    = useState(false);
  const [showForm,    setShowForm]   = useState(false);
  const [editProduct, setEditProduct]= useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', originalPrice: '',
    stockQuantity: '', category: '', imageUrl: '', brand: ''
  });

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getDashboard();
      setStats(res.data.data);
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productAPI.getAll({ page: 0, size: 50 });
      setProducts(res.data.data.content || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, []);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllOrders();
      setOrders(res.data.data || []);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === 'Dashboard') loadDashboard();
    if (activeTab === 'Products')  loadProducts();
    if (activeTab === 'Orders')    loadOrders();
  }, [activeTab, loadDashboard, loadProducts, loadOrders]);

  const openAddForm = () => {
    setEditProduct(null);
    setForm({ name: '', description: '', price: '', originalPrice: '', stockQuantity: '', category: '', imageUrl: '', brand: '' });
    setShowForm(true);
  };
  const openEditForm = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name, description: p.description || '', price: p.price,
      originalPrice: p.originalPrice || '', stockQuantity: p.stockQuantity,
      category: p.category, imageUrl: p.imageUrl || '', brand: p.brand || ''
    });
    setShowForm(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price),
      originalPrice: parseFloat(form.originalPrice) || null,
      stockQuantity: parseInt(form.stockQuantity)
    };
    try {
      if (editProduct) {
        await adminAPI.updateProduct(editProduct.id, payload);
        toast.success('Product updated');
      } else {
        await adminAPI.createProduct(payload);
        toast.success('Product created');
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminAPI.deleteProduct(id);
      toast.success('Product deleted');
      loadProducts();
    } catch { toast.error('Failed to delete'); }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await adminAPI.updateOrderStatus(orderId, status);
      toast.success(`Order marked as ${status}`);
      loadOrders();
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage your store</p>
          </div>
          <div className="admin-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── DASHBOARD TAB ── */}
        {activeTab === 'Dashboard' && (
          <div className="dashboard-content">
            {loading ? (
              <div className="page-loader"><div className="spinner" /></div>
            ) : stats && (
              <>
                <div className="stats-grid">
                  {[
                    { label: 'Total Revenue',  value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`, icon: '💰', color: 'green'  },
                    { label: 'Total Orders',   value: stats.totalOrders,   icon: '📦', color: 'blue'   },
                    { label: 'Total Products', value: stats.totalProducts, icon: '🛍️', color: 'purple' },
                    { label: 'Total Users',    value: stats.totalUsers,    icon: '👥', color: 'orange' },
                  ].map(s => (
                    <div key={s.label} className={`stat-card stat-${s.color}`}>
                      <div className="stat-icon">{s.icon}</div>
                      <div className="stat-info">
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {stats.ordersByStatus && (
                  <div className="admin-section">
                    <h2 className="admin-section-title">Orders by Status</h2>
                    <div className="status-chips">
                      {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                        <div key={status} className="status-chip">
                          <span className={`badge badge-${status === 'DELIVERED' ? 'success' : status === 'CANCELLED' ? 'danger' : 'info'}`}>
                            {status}
                          </span>
                          <strong>{count}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {activeTab === 'Products' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2 className="admin-section-title">Products ({products.length})</h2>
              <button className="btn btn-accent" onClick={openAddForm}>+ Add Product</button>
            </div>

            {/* Product Form Modal */}
            {showForm && (
              <div className="modal-overlay" onClick={() => setShowForm(false)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
                  </div>
                  <form onSubmit={handleProductSubmit} className="product-form">
                    <div className="form-grid-2">
                      {[
                        { key: 'name',          label: 'Product Name *', required: true  },
                        { key: 'brand',         label: 'Brand'                            },
                        { key: 'category',      label: 'Category *',     required: true  },
                        { key: 'price',         label: 'Price (₹) *',    required: true, type: 'number' },
                        { key: 'originalPrice', label: 'MRP (₹)',        type: 'number'  },
                        { key: 'stockQuantity', label: 'Stock *',        required: true, type: 'number' },
                      ].map(f => (
                        <div key={f.key} className="form-group">
                          <label className="form-label">{f.label}</label>
                          <input
                            type={f.type || 'text'}
                            className="form-input"
                            value={form[f.key]}
                            required={f.required}
                            min={f.type === 'number' ? '0' : undefined}
                            step={f.type === 'number' ? '0.01' : undefined}
                            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Image URL</label>
                      <input type="url" className="form-input" value={form.imageUrl}
                        onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} />
                      {/* Live preview */}
                      {form.imageUrl && (
                        <img
                          src={getDirectImageUrl(form.imageUrl, '')}
                          alt="preview"
                          style={{ marginTop: 8, height: 80, borderRadius: 8, objectFit: 'cover' }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea className="form-input" rows={3} value={form.description}
                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                    </div>
                    <div className="modal-actions">
                      <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                      <button type="submit" className="btn btn-accent">{editProduct ? 'Update' : 'Create'} Product</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {loading ? <div className="page-loader"><div className="spinner" /></div> : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th><th>Category</th><th>Price</th>
                      <th>Stock</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => {
                      const fallback = `https://placehold.co/40x40/f1f5f9/94a3b8?text=${p.name.charAt(0)}`;
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="table-product-cell">
                              <img
                                src={getDirectImageUrl(p.imageUrl, fallback)}
                                alt={p.name}
                                onError={e => { e.target.src = fallback; }}
                              />
                              <div>
                                <span className="table-product-name">{p.name}</span>
                                <span className="table-product-brand">{p.brand || '—'}</span>
                              </div>
                            </div>
                          </td>
                          <td><span className="badge badge-accent">{p.category}</span></td>
                          <td className="price-cell">₹{p.price?.toLocaleString('en-IN')}</td>
                          <td className={p.stockQuantity < 5 ? 'low-stock' : ''}>{p.stockQuantity}</td>
                          <td>
                            <span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>
                              {p.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button className="btn btn-outline btn-sm" onClick={() => openEditForm(p)}>Edit</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === 'Orders' && (
          <div className="admin-section">
            <h2 className="admin-section-title">All Orders ({orders.length})</h2>
            {loading ? <div className="page-loader"><div className="spinner" /></div> : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th><th>Date</th><th>Customer</th>
                      <th>Amount</th><th>Payment</th><th>Status</th><th>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.orderId}>
                        <td className="order-num-cell">{o.orderNumber}</td>
                        <td>{new Date(o.placedAt).toLocaleDateString('en-IN')}</td>
                        <td>{o.items?.[0]?.productName ? `${o.items.length} item(s)` : '—'}</td>
                        <td className="price-cell">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`badge ${o.paymentStatus === 'PAID' ? 'badge-success' : o.paymentStatus === 'FAILED' ? 'badge-danger' : 'badge-warning'}`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${o.orderStatus === 'DELIVERED' ? 'badge-success' : o.orderStatus === 'CANCELLED' ? 'badge-danger' : 'badge-info'}`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td>
                          <select
                            className="form-input status-select"
                            value={o.orderStatus}
                            onChange={e => handleStatusChange(o.orderId, e.target.value)}
                          >
                            {['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;