// pages/OrdersPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { fetchMyOrders, selectOrders, selectOrderLoading } from '../slices/OrderSlice';
import '../styles/OrdersPage.css';

const STATUS_STYLES = {
  PENDING:    { class: 'badge-warning',  label: 'Pending'    },
  CONFIRMED:  { class: 'badge-info',     label: 'Confirmed'  },
  PROCESSING: { class: 'badge-info',     label: 'Processing' },
  SHIPPED:    { class: 'badge-primary',  label: 'Shipped'    },
  DELIVERED:  { class: 'badge-success',  label: 'Delivered'  },
  CANCELLED:  { class: 'badge-danger',   label: 'Cancelled'  },
};

const PAYMENT_STYLES = {
  PENDING:  { class: 'badge-warning', label: 'Pending' },
  PAID:     { class: 'badge-success', label: 'Paid'    },
  FAILED:   { class: 'badge-danger',  label: 'Failed'  },
  REFUNDED: { class: 'badge-info',    label: 'Refunded'},
};

const OrdersPage = () => {
  const dispatch  = useDispatch();
  const orders    = useSelector(selectOrders);
  const loading   = useSelector(selectOrderLoading);
  const location  = useLocation();
  const justOrdered = location.state?.success;

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  if (loading && !orders.length) {
    return <div className="page-loader"><div className="spinner" /></div>;
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1>My Orders</h1>
          {justOrdered && (
            <div className="order-success-banner">
              🎉 Your order was placed successfully! We'll update you on the status.
            </div>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>Your order history will appear here once you shop.</p>
            <Link to="/products" className="btn btn-accent">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const orderStatus   = STATUS_STYLES[order.orderStatus]   || { class: 'badge-info', label: order.orderStatus };
              const paymentStatus = PAYMENT_STYLES[order.paymentStatus]|| { class: 'badge-info', label: order.paymentStatus };

              return (
                <div key={order.orderId} className="order-card">
                  <div className="order-card-header">
                    <div className="order-meta">
                      <span className="order-number">#{order.orderNumber}</span>
                      <span className="order-date">
                        {new Date(order.placedAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="order-badges">
                      <span className={`badge ${orderStatus.class}`}>{orderStatus.label}</span>
                      <span className={`badge ${paymentStatus.class}`}>{paymentStatus.label}</span>
                    </div>
                  </div>

                  <div className="order-items-preview">
                    {order.items?.slice(0, 3).map(item => (
                      <div key={item.orderItemId} className="order-item-row">
                        <img
                          src={item.productImage || `https://placehold.co/48x48/f1f5f9/94a3b8?text=${item.productName.charAt(0)}`}
                          alt={item.productName}
                          onError={e => { e.target.src = `https://placehold.co/48x48/f1f5f9/94a3b8?text=${item.productName.charAt(0)}`; }}
                        />
                        <div className="order-item-info">
                          <span className="order-item-name">{item.productName}</span>
                          <span className="order-item-qty">×{item.quantity}</span>
                        </div>
                        <span className="order-item-price">₹{item.totalPrice?.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <p className="more-items">+{order.items.length - 3} more items</p>
                    )}
                  </div>

                  <div className="order-card-footer">
                    <div className="order-total">
                      Total: <strong>₹{order.totalAmount?.toLocaleString('en-IN')}</strong>
                    </div>
                    {order.orderStatus === 'DELIVERED' && (
                      <span className="delivery-date">
                        Delivered {order.deliveredAt
                          ? new Date(order.deliveredAt).toLocaleDateString('en-IN')
                          : ''}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;