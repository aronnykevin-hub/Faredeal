import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import FloatingScanner from '@/components/FloatingScanner';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';

// Pages and Components
import AdminPortal from '@/pages/AdminPortal';
import AdminProfile from '@/pages/AdminProfile';
import AdminAuth from '@/pages/AdminAuth';
import ManagerPortal from '@/pages/ManagerPortal';
import EmployeePortal from '@/pages/EmployeePortal';
import SupplierPortal from '@/pages/SupplierPortal';
import PortalLanding from '@/pages/PortalLanding';
import PaymentDashboard from '@/components/PaymentDashboard';
import Products from '@/pages/Products';
import Sales from '@/pages/Sales';
import Customers from '@/pages/Customers';
import Employees from '@/pages/Employees';
import Suppliers from '@/pages/Suppliers';
import Inventory from '@/pages/Inventory';
import Reports from '@/pages/Reports';
import POS from '@/pages/POS';
import CustomerDashboard from '@/pages/CustomerDashboard';
import CustomerPayment from '@/pages/CustomerPayment';
import CustomerDelivery from '@/pages/CustomerDelivery';

// Styles
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // Simple admin access check using #admin hash or localStorage
  const checkAdminAccess = () => {
    // Check for #admin in URL or stored admin access or admin-related paths
    const isAdminRoute = 
      window.location.hash === '#admin' || 
      window.location.pathname.includes('/admin') ||
      localStorage.getItem('adminKey') === 'true';
    
    return isAdminRoute;
  };

  // Auto-login based on access type
  useEffect(() => {
    const autoLogin = async () => {
      try {
        const isAdmin = checkAdminAccess();
        
        if (isAdmin) {
          // Store admin access flag
          localStorage.setItem('adminKey', 'true');
          // Admin auto-login
          localStorage.setItem('supermarket_user', JSON.stringify({
            id: 1,
            name: "System Admin",
            role: "admin",
            email: "admin",
            accessLevel: "system",
            timestamp: Date.now()
          }));
        } else {
          // Don't clear admin access if on admin routes
          if (!window.location.pathname.includes('/admin')) {
            localStorage.removeItem('adminKey');
          }
          // Regular portal auto-login
          localStorage.setItem('supermarket_user', JSON.stringify({
            id: Date.now(),
            name: "Portal User",
            role: "user",
            email: "user",
            accessLevel: "standard",
            timestamp: Date.now()
          }));
        }
      } catch (error) {
        console.log('Auto-login setup:', error);
      }
    };
    autoLogin();
  }, [window.location.search, window.location.hash, window.location.pathname]);

  const isAdmin = checkAdminAccess();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <div className={`app-container ${isAdmin ? 'admin-mode' : 'standard-mode'}`}>
            <Routes>
              {/* Main landing with portal selection */}
              <Route 
                path="/" 
                element={
                  isAdmin 
                    ? <Navigate to="/admin-portal" replace /> 
                    : <Navigate to="/portal-selection" replace />
                } 
              />
              
              {/* Admin authentication routes - always accessible */}
              <Route path="/admin-login" element={<AdminAuth />} />
              <Route path="/admin-auth" element={<AdminAuth />} />
              <Route path="/admin-signup" element={<AdminAuth />} />
              
              {/* Admin routes - protected, require authentication */}
              <Route 
                path="/admin-portal" 
                element={
                  <AdminProtectedRoute>
                    <AdminPortal />
                  </AdminProtectedRoute>
                } 
              />
              <Route 
                path="/system-admin" 
                element={
                  <AdminProtectedRoute>
                    <AdminPortal />
                  </AdminProtectedRoute>
                } 
              />
              <Route 
                path="/admin-dashboard" 
                element={
                  <AdminProtectedRoute>
                    <AdminPortal />
                  </AdminProtectedRoute>
                } 
              />
              <Route 
                path="/admin-profile" 
                element={
                  <AdminProtectedRoute>
                    <AdminProfile />
                  </AdminProtectedRoute>
                } 
              />
              
              {/* Direct access to all portals */}
              <Route path="/portal-selection" element={<PortalLanding />} />
              
              {/* Main portals - directly accessible */}
              <Route path="/manager-portal" element={<ManagerPortal />} />
              <Route path="/manager" element={<ManagerPortal />} />
              
              <Route path="/employee-portal" element={<EmployeePortal />} />
              <Route path="/employee" element={<EmployeePortal />} />
              <Route path="/cashier" element={<EmployeePortal />} />
              
              <Route path="/supplier-portal" element={<SupplierPortal />} />
              <Route path="/supplier" element={<SupplierPortal />} />
              
              <Route path="/customer-portal" element={<CustomerDashboard />} />
              <Route path="/customer-dashboard" element={<CustomerDashboard />} />
              
              {/* Operational features - accessible to all */}
              <Route path="/pos" element={<POS />} />
              <Route path="/products" element={<Products />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/reports" element={<Reports />} />
              
              {/* Customer services - directly accessible */}
              <Route path="/customer-payment" element={<CustomerPayment />} />
              <Route path="/customer-delivery" element={<CustomerDelivery />} />
              <Route path="/payment-dashboard" element={<PaymentDashboard />} />
              
              {/* Fallback route */}
              <Route 
                path="*" 
                element={
                  isAdmin 
                    ? <Navigate to="/admin-portal" replace />
                    : <Navigate to="/portal-selection" replace />
                } 
              />
            </Routes>
            
            {/* Global Floating Scanner */}
            <FloatingScanner />
            
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
