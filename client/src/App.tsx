import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';
import SellerLayout from './layouts/SellerLayout';

// Lazy load pages for performance optimization
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const SellerDashboard = React.lazy(() => import('./pages/dashboards/SellerDashboard'));
const SellerAnalytics = React.lazy(() => import('./pages/seller/SellerAnalytics'));
const SellerProfile = React.lazy(() => import('./pages/seller/SellerProfile'));
const SellerSettings = React.lazy(() => import('./pages/seller/SellerSettings'));
const SellerCoupons = React.lazy(() => import('./pages/seller/SellerCoupons'));
const MyShop = React.lazy(() => import('./pages/seller/MyShop'));
const CustomerDashboard = React.lazy(() => import('./pages/dashboards/CustomerDashboard'));
const CreateShop = React.lazy(() => import('./pages/seller/CreateShop'));
const ProductManagement = React.lazy(() => import('./pages/seller/ProductManagement'));
const OrderManagement = React.lazy(() => import('./pages/seller/OrderManagement'));
const ShopPage = React.lazy(() => import('./pages/public/ShopPage'));
const ProductDetails = React.lazy(() => import('./pages/public/ProductDetails'));
const CartPage = React.lazy(() => import('./pages/public/CartPage'));
const CheckoutPage = React.lazy(() => import('./pages/customer/CheckoutPage'));
const OrderSuccess = React.lazy(() => import('./pages/customer/OrderSuccess'));

// Loading Fallback
const PageLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Landing Page */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            {/* Public/Customer specific */}
            <Route path="/shop/:id" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>

          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRole="customer" />}>
            <Route path="/dashboard/customer" element={<CustomerDashboard />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRole="seller" />}>
            <Route element={<SellerLayout />}>
              <Route path="/dashboard/seller" element={<SellerDashboard />} />
              <Route path="/dashboard/seller/orders" element={<OrderManagement />} />
              <Route path="/dashboard/seller/shop" element={<MyShop />} />
              <Route path="/dashboard/seller/products" element={<ProductManagement />} />
              <Route path="/dashboard/seller/coupons" element={<SellerCoupons />} />
              <Route path="/dashboard/seller/analytics" element={<SellerAnalytics />} />
              <Route path="/dashboard/seller/profile" element={<SellerProfile />} />
              <Route path="/dashboard/seller/settings" element={<SellerSettings />} />
            </Route>
            {/* Shop Creation stands alone, out of layout typically, but protected */}
            <Route path="/shop/create" element={<CreateShop />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
