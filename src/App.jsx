import React, { useState, useEffect, useRef, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InquiryModal from './components/InquiryModal';
import InteractiveBackground from './components/InteractiveBackground';

import Home from './pages/Home';
import About from './pages/About';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Gallery from './pages/Gallery';
import Export from './pages/Export';
import Contact from './pages/Contact';
import ECatalogue from './pages/ECatalogue';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminInquiries from './pages/AdminInquiries';
import AdminGallery from './components/AdminGallery';
import AdminLayout from './components/AdminLayout';

// Global Scroll To Top on Route/Search Parameter Changes
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);

  return null;
}

// Hidden Keyboard Shortcut (Ctrl+Shift+L) to Navigate to Admin Login
function SecretKeyboardShortcutListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
        e.preventDefault();
        navigate('/cepsa-owner-portal');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return null;
}

// Protected Route Guard for Admin Pages
function ProtectedAdminRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to="/cepsa-owner-portal" replace />;
  }
  return children;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/cepsa-owner-portal';

  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedProductCode, setSelectedProductCode] = useState('');

  const handleOpenInquiry = (code = '') => {
    setSelectedProductCode(code);
    setInquiryModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F5F0] text-slate-900 selection:bg-[#B17F59] selection:text-white relative">
      <ScrollToTop />
      <SecretKeyboardShortcutListener />

      {/* Global Interactive Cursor Movement & Parallax Ambient Glow (Available on All Pages) */}
      {!isAdminRoute && <InteractiveBackground />}

      {!isAdminRoute && <Navbar onOpenInquiry={handleOpenInquiry} />}

      <main className="flex-1 bg-[#F8F5F0]">
        <Routes>
          <Route path="/" element={<Home onOpenInquiry={handleOpenInquiry} />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Catalog onOpenInquiry={handleOpenInquiry} />} />
          <Route path="/catalog" element={<Catalog onOpenInquiry={handleOpenInquiry} />} />
          <Route path="/products/:id" element={<ProductDetail onOpenInquiry={handleOpenInquiry} />} />
          <Route path="/gallery" element={<Gallery onOpenInquiry={handleOpenInquiry} />} />
          <Route path="/export" element={<Export />} />
          <Route path="/contact" element={<Contact onOpenInquiry={handleOpenInquiry} />} />
          <Route path="/e-catalogue" element={<ECatalogue onOpenInquiry={handleOpenInquiry} />} />

          {/* Secret Admin Routes */}
          <Route path="/cepsa-owner-portal" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedAdminRoute>
                <AdminProducts />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/inquiries"
            element={
              <ProtectedAdminRoute>
                <AdminInquiries />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminGallery />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}

      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        productCode={selectedProductCode}
      />
    </div>
  );
}

import { ToastProvider } from './context/ToastContext';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}
