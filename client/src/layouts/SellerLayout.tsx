import { Store, Package, Plus, BarChart2, User, Settings, LogOut, Menu, ClipboardList } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useShopStore } from '../store/useShopStore';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';

export default function SellerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const { myShop, fetchMyShop, isLoading: shopLoading } = useShopStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchMyShop();
  }, []);

  useEffect(() => {
    // Redirect logic: If a seller doesn't have a shop and they aren't on the create shop page, redirect them.
    // Wait, the create shop page is outside of this layout usually, or we can just redirect.
    if (!shopLoading && !myShop && location.pathname !== '/shop/create') {
      navigate('/shop/create');
    }
  }, [myShop, shopLoading, navigate, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: Store, label: 'Dashboard', path: '/dashboard/seller' },
    { icon: ClipboardList, label: 'Orders', path: '/dashboard/seller/orders' },
    { icon: Store, label: 'My Shop', path: '/dashboard/seller/shop' },
    { icon: Package, label: 'Products', path: '/dashboard/seller/products' },
    { icon: Plus, label: 'Add Product', path: '/dashboard/seller/products?new=true' },
    { icon: BarChart2, label: 'Analytics', path: '/dashboard/seller/analytics' },
    { icon: User, label: 'Profile', path: '/dashboard/seller/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/seller/settings' },
  ];

  if (shopLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col z-20`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {isSidebarOpen && <span className="font-bold text-xl text-foreground truncate">HomeHive Seller</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 mx-auto">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item, index) => {
              // Exact match for dashboard, prefix match for others to keep them active
              const isActive = item.path === '/dashboard/seller' 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path.split('?')[0]);

              return (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className={`w-full flex items-center px-3 py-3 rounded-xl transition-colors ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                    {isSidebarOpen && <span className="font-medium text-sm truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center justify-center p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="ml-3 font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (Optional, could just use page headers, but let's keep the global user header) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 z-10 shrink-0">
          {myShop && (
            <div className="flex items-center space-x-4">
              <Link to={`/shop/${myShop._id}`} className="text-sm font-semibold text-primary hover:underline">
                View Public Shop
              </Link>
              <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-foreground/50 capitalize">{myShop.name}</p>
                </div>
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/20">
                  {myShop.logo ? <img src={`http://localhost:5000${myShop.logo}`} alt="logo" className="w-full h-full object-cover"/> : user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
