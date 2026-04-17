// pages/CheckoutPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, selectCart, selectCartItems } from '../slices/CartSlice';
import { createOrder, verifyPayment, selectRazorpayData, selectOrderLoading, clearRazorpayData } from '../slices/OrderSlice';
import toast from 'react-hot-toast';
import '../styles/CheckoutPage.css';

const CheckoutPage = () => {
  const dispatch      = useDispatch();
  const navigate      = useNavigate();
  const cart          = useSelector(selectCart);
  const items         = useSelector(selectCartItems);
  const razorpayData  = useSelector(selectRazorpayData);
  const orderLoading  = useSelector(selectOrderLoading);

  const [form, setForm] = useState({
    fullName: '', addressLine: '', city: '', state: '', pincode: '', phone: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  // When Razorpay order is created → open payment modal
  useEffect(() => {
    if (razorpayData) {
      openRazorpay(razorpayData);
      dispatch(clearRazorpayData());
    }
  }, [razorpayData, dispatch]);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())    e.fullName    = 'Required';
    if (!form.addressLine.trim()) e.addressLine = 'Required';
    if (!form.city.trim())        e.city        = 'Required';
    if (!form.state.trim())       e.state       = 'Required';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Valid 6-digit pincode required';
    if (!/^\d{10}$/.test(form.phone))  e.phone   = 'Valid 10-digit phone required';
    return e;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    dispatch(createOrder(form));
  };

  const openRazorpay = (data) => {
    const options = {
      key:      data.razorpayKeyId,
      amount:   data.amount,
      currency: data.currency,
      name:     'ShopNest',
      description: `Order #${data.orderNumber}`,
      order_id: data.razorpayOrderId,
      prefill: {
        name:    data.customerName,
        email:   data.customerEmail,
        contact: data.customerPhone,
      },
      theme: { color: '#f97316' },
      handler: (response) => {
        // Payment success — verify with backend
        dispatch(verifyPayment({
          razorpayOrderId:   response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        })).then((action) => {
          if (action.type.endsWith('/fulfilled')) {
            navigate('/orders', { state: { success: true } });
          }
        });
      },
      modal: {
        ondismiss: () => {
          toast.error('Payment cancelled. Your order is saved and can be retried.');
        }
      }
    };

    // If Razorpay SDK is loaded
    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Demo mode: simulate payment success
      toast('Demo Mode: Simulating payment success...', { icon: '💳' });
      setTimeout(() => {
        dispatch(verifyPayment({
          razorpayOrderId:   data.razorpayOrderId,
          razorpayPaymentId: 'pay_demo_' + Math.random().toString(36).slice(2),
          razorpaySignature: 'mock_signature_valid',
        })).then((action) => {
          if (action.type.endsWith('/fulfilled')) {
            navigate('/orders', { state: { success: true } });
          }
        });
      }, 1500);
    }
  };

  if (!items.length) {
    navigate('/cart'); return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const Field = ({ name, label, placeholder, span }) => (
    <div className={`form-group ${span ? 'span-2' : ''}`}>
      <label className="form-label">{label}</label>
      <input
        className={`form-input ${errors[name] ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={form[name]}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
      />
      {errors[name] && <span className="form-error">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="checkout-layout">
            {/* Shipping Form */}
            <div className="checkout-left">
              <div className="checkout-section">
                <h2 className="checkout-section-title">
                  <span className="step-num">1</span> Shipping Address
                </h2>
                <div className="address-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                    name="fullName"
                    className={`form-input ${errors[name] ? 'input-error' : ''}`}
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={handleChange}
                    />
                    {errors[name] && <span className="form-error">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input
                    name="addressLine"
                    className={`form-input ${errors[name] ? 'input-error' : ''}`}
                    placeholder="Street, Landmark"
                    value={form.addressLine}
                    onChange={handleChange}
                    />
                    {errors[name] && <span className="form-error">{errors.addressLine}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                    name="city"
                    className={`form-input ${errors[name] ? 'input-error' : ''}`}
                    placeholder="Mumbai"
                    value={form.city}
                    onChange={handleChange}
                    />
                    {errors[name] && <span className="form-error">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                    name="state"
                    className={`form-input ${errors[name] ? 'input-error' : ''}`}
                    placeholder="Maharashtra"
                    value={form.state}
                    onChange={handleChange}
                    />
                    {errors[name] && <span className="form-error">{errors.state}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input
                    name="pincode"
                    className={`form-input ${errors[name] ? 'input-error' : ''}`}
                    placeholder="400001"
                    value={form.pincode}
                    onChange={handleChange}
                    />
                    {errors[name] && <span className="form-error">{errors.pincode}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                    name="phone"
                    className={`form-input ${errors[name] ? 'input-error' : ''}`}
                    placeholder="9999988888"
                    value={form.phone}
                    onChange={handleChange}
                    />
                    {errors[name] && <span className="form-error">{errors.phone}</span>}
                  </div>
    </div>
                  {/* <Field name="fullName"    label="Full Name"    placeholder="John Doe"        span />
                  <Field name="addressLine" label="Address"      placeholder="Street, Landmark" span />
                  <Field name="city"        label="City"         placeholder="Mumbai" />
                  <Field name="state"       label="State"        placeholder="Maharashtra" />
                  <Field name="pincode"     label="Pincode"      placeholder="400001" />
                  <Field name="phone"       label="Phone Number" placeholder="9876543210" />
                </div> */}
              </div>

              <div className="checkout-section">
                <h2 className="checkout-section-title">
                  <span className="step-num">2</span> Payment Method
                </h2>
                <div className="payment-option selected">
                  <div className="payment-option-icon">💳</div>
                  <div>
                    <strong>Razorpay</strong>
                    <p>Credit/Debit Card, UPI, Net Banking, Wallets</p>
                  </div>
                  <svg className="payment-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="checkout-right">
              <div className="checkout-section order-summary-section">
                <h2 className="checkout-section-title">
                  <span className="step-num">3</span> Order Summary
                </h2>
                <div className="checkout-items">
                  {items.map(item => (
                    <div key={item.cartItemId} className="checkout-item">
                      <img
                        src={item.productImage || `https://placehold.co/56x56/f1f5f9/94a3b8?text=${item.productName.charAt(0)}`}
                        alt={item.productName}
                        onError={e => { e.target.src = `https://placehold.co/56x56/f1f5f9/94a3b8?text=${item.productName.charAt(0)}`; }}
                      />
                      <div className="checkout-item-info">
                        <span className="checkout-item-name">{item.productName}</span>
                        <span className="checkout-item-qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="checkout-item-price">₹{item.totalPrice?.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="divider" />

                <div className="checkout-totals">
                  <div className="checkout-total-row">
                    <span>Subtotal</span>
                    <span>₹{cart?.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="checkout-total-row">
                    <span>Shipping</span>
                    <span className={cart?.shippingCharge === 0 ? 'free-shipping' : ''}>
                      {cart?.shippingCharge === 0 ? 'FREE' : `₹${cart?.shippingCharge}`}
                    </span>
                  </div>
                  <div className="checkout-total-row total-row">
                    <span>Total</span>
                    <span>₹{cart?.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button type="submit" className="btn btn-accent btn-full btn-lg" disabled={orderLoading}>
                  {orderLoading
                    ? <><span className="btn-spinner" /> Processing...</>
                    : <>Pay ₹{cart?.totalAmount?.toLocaleString('en-IN')} via Razorpay</>
                  }
                </button>

                <p className="secure-badge">🔒 Secured by Razorpay — 256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;