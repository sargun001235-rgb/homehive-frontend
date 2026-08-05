import { Store, Package, Plus, BarChart2, User, Settings, LogOut, Menu, ClipboardList, Bell, Tag } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useShopStore } from '../store/useShopStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';

export default function SellerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const { myShop, fetchMyShop, isLoading: shopLoading } = useShopStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef<HTMLDivElement>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    fetchMyShop();
    fetchNotifications();
  }, [fetchMyShop, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    { icon: Tag, label: 'Coupons', path: '/dashboard/seller/coupons' },
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
          {isSidebarOpen && <span className="font-bold text-xl text-foreground truncate">GharSe Seller</span>}
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

              <div className="relative border-l border-gray-200 pl-4" ref={notifRef}>
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors relative flex items-center justify-center"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                  )}
                </button>
                
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-10 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 flex flex-col max-h-[400px]"
                    >
                      <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 sticky top-0">
                        <h3 className="font-bold text-foreground">Notifications</h3>
                        {unreadCount > 0 && (
                          <button onClick={() => markAsRead('all')} className="text-xs font-bold text-primary hover:text-primary/80">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="overflow-y-auto flex-1 p-2">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500 text-sm">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map(notif => (
                            <div 
                              key={notif._id} 
                              onClick={() => !notif.read && markAsRead(notif._id)}
                              className={`p-3 rounded-xl mb-1 cursor-pointer transition-colors ${!notif.read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-gray-50'}`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h4 className={`text-sm ${!notif.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{notif.title}</h4>
                                {!notif.read && <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>}
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{notif.message}</p>
                              <span className="text-[10px] text-gray-400 mt-2 block font-medium">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-foreground/50 capitalize">{myShop.name}</p>
                </div>
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/20">
                  {myShop.logo ? <img src={`${myShop.logo}`} alt="logo" className="w-full h-full object-cover"/> : user?.name?.charAt(0).toUpperCase()}
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
