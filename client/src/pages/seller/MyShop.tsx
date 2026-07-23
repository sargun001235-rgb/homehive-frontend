import { Store, MapPin, Clock, Phone, Edit, Instagram, Facebook } from 'lucide-react';
import { useShopStore } from '../../store/useShopStore';
import { Link } from 'react-router-dom';

export default function MyShop() {
  const { myShop } = useShopStore();

  if (!myShop) {
    return (
      <div className="p-8 text-center">
        <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground">You don't have a shop yet</h2>
        <Link to="/shop/create" className="text-primary mt-2 inline-block font-medium hover:underline">Create Shop</Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">My Shop Profile</h1>
          <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-semibold transition-colors">
            <Edit className="w-4 h-4 mr-2" /> Edit Details
          </button>
        </div>

        {/* Shop Preview Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="h-48 md:h-64 bg-gray-100 relative">
            {myShop.banner ? (
              <img src={`http://localhost:5000${myShop.banner}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary/20 to-accent/20"></div>
            )}
          </div>
          
          <div className="px-8 pb-8 relative">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden -mt-12 md:-mt-16 mb-4 relative z-10">
              {myShop.logo ? (
                <img src={`http://localhost:5000${myShop.logo}`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-gray-300">{myShop.name.charAt(0)}</span>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-foreground mb-1">{myShop.name}</h2>
                <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">{myShop.category}</p>
                <p className="text-foreground/70 leading-relaxed max-w-2xl whitespace-pre-line">{myShop.description}</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 min-w-[250px]">
                <h3 className="font-bold text-foreground mb-4">Business Details</h3>
                <div className="space-y-3 text-sm text-foreground/70">
                  <div className="flex items-center"><MapPin className="w-4 h-4 mr-3 text-gray-400" /> {myShop.city}</div>
                  <div className="flex items-center"><Clock className="w-4 h-4 mr-3 text-gray-400" /> {myShop.businessHours}</div>
                  <div className="flex items-center"><Phone className="w-4 h-4 mr-3 text-gray-400" /> {myShop.phone}</div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-bold text-foreground mb-4">Social Links</h3>
                  <div className="flex space-x-3">
                    {myShop.socialLinks?.instagram && <div className="p-2 bg-pink-50 text-pink-500 rounded-lg"><Instagram className="w-4 h-4" /></div>}
                    {myShop.socialLinks?.facebook && <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Facebook className="w-4 h-4" /></div>}
                    {!myShop.socialLinks?.instagram && !myShop.socialLinks?.facebook && <span className="text-sm text-gray-400">None added</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
