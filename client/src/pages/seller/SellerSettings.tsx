import { Bell, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SellerSettings() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
          <p className="text-foreground/60 text-sm">Manage your preferences and configurations</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center">
            <Bell className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-lg font-bold">Notifications</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">New Order Alerts</p>
                <p className="text-sm text-foreground/60">Receive email when a new order is placed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Marketing Emails</p>
                <p className="text-sm text-foreground/60">Receive tips and updates from GharSe</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center">
            <Lock className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-lg font-bold">Security</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <p className="font-bold text-foreground">Password</p>
                <p className="text-sm text-foreground/60">Last changed 2 months ago</p>
              </div>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors">
                Change Password
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl border border-red-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-red-100 flex items-center bg-red-50">
            <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Delete Account</p>
                <p className="text-sm text-foreground/60 max-w-md">Permanently delete your account, shop, and all products. This action cannot be undone.</p>
              </div>
              <button className="px-6 py-2.5 bg-red-600 text-white rounded-full text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                Delete Account
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
