// App.jsx - Root application component with routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store/index';         

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Route Guards
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoutes';

// Pages
import HomePage          from './pages/HomePage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import ProductsPage      from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage          from './pages/CartPage';
import CheckoutPage      from './pages/CheckoutPage';
import OrdersPage        from './pages/OrdersPage';
import AdminDashboard    from './pages/AdminDashboard';

import './index.css';

// Wraps every page with Navbar at top and Footer at bottom
const AppLayout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }}>
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    // Provider makes the Redux store available to every component in the app
    <Provider store={store}>
      <Router>

        {/* Shows small popup notifications (success, error, etc.) */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.9rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />

        <Routes>

          {/* ── Public routes — anyone can visit these ── */}
          <Route path="/" element={
            <AppLayout><HomePage /></AppLayout>
          } />
          <Route path="/login" element={
            <AppLayout><LoginPage /></AppLayout>
          } />
          <Route path="/register" element={
            <AppLayout><RegisterPage /></AppLayout>
          } />
          <Route path="/products" element={
            <AppLayout><ProductsPage /></AppLayout>
          } />
          <Route path="/products/:id" element={
            <AppLayout><ProductDetailPage /></AppLayout>
          } />

          {/* ── Protected routes — only logged-in users can visit ── */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <AppLayout><CartPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <AppLayout><CheckoutPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <AppLayout><OrdersPage /></AppLayout>
            </ProtectedRoute>
          } />

          {/* ── Admin routes — only users with ADMIN role can visit ── */}
          <Route path="/admin" element={
            <AdminRoute>
              <AppLayout><AdminDashboard /></AppLayout>
            </AdminRoute>
          } />
          <Route path="/admin/*" element={
            <AdminRoute>
              <AppLayout><AdminDashboard /></AppLayout>
            </AdminRoute>
          } />

          {/* ── 404 fallback — shown when no route matches ── */}
          <Route path="*" element={
            <AppLayout>
              <div style={{
                minHeight: '60vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '40px'
              }}>
                <div style={{ fontSize: '4rem' }}>🔍</div>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem' }}>Page Not Found</h2>
                <p style={{ color: '#64748b' }}>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-accent">Go Home</a>
              </div>
            </AppLayout>
          } />

        </Routes>
      </Router>
    </Provider>
  );
}

export default App;