import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import SellerLayout from './layouts/SellerLayout';
import SellerDashboard from './pages/dashboards/SellerDashboard';
import SellerAnalytics from './pages/seller/SellerAnalytics';
import SellerProfile from './pages/seller/SellerProfile';
import SellerSettings from './pages/seller/SellerSettings';
import MyShop from './pages/seller/MyShop';
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import CreateShop from './pages/seller/CreateShop';
import ProductManagement from './pages/seller/ProductManagement';
import OrderManagement from './pages/seller/OrderManagement';
import ShopPage from './pages/public/ShopPage';
import ProductDetails from './pages/public/ProductDetails';
import CartPage from './pages/public/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderSuccess from './pages/customer/OrderSuccess';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
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
            <Route path="/dashboard/seller/analytics" element={<SellerAnalytics />} />
            <Route path="/dashboard/seller/profile" element={<SellerProfile />} />
            <Route path="/dashboard/seller/settings" element={<SellerSettings />} />
          </Route>
          {/* Shop Creation stands alone, out of layout typically, but protected */}
          <Route path="/shop/create" element={<CreateShop />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
