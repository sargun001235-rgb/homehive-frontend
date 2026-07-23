import { Mail, Shield, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { motion } from 'framer-motion';

export default function SellerProfile() {
  const { user } = useAuthStore();

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary/10 to-accent/10"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 mt-12">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center text-4xl font-bold text-primary">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            
            <div className="text-center md:text-left flex-1 mt-2">
              <h1 className="text-3xl font-bold text-foreground mb-1">{user?.name}</h1>
              <p className="text-foreground/60 flex items-center justify-center md:justify-start">
                <Mail className="w-4 h-4 mr-2" /> {user?.email}
              </p>
              
              <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold">
                <Shield className="w-4 h-4 mr-2" /> Seller Account
              </div>
            </div>
            
            <button className="bg-foreground text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary transition-colors shadow-lg">
              Edit Profile
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6">Account Verification</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 text-green-500 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Email Address</p>
                  <p className="text-sm text-foreground/60">Verified on registration</p>
                </div>
              </div>
              <span className="text-green-500 font-semibold text-sm">Verified</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mr-4">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Identity Verification</p>
                  <p className="text-sm text-foreground/60">Not required for current tier</p>
                </div>
              </div>
              <button className="text-sm font-bold text-primary">Verify Now</button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
