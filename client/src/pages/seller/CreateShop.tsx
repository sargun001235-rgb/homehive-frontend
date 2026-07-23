import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Store, UploadCloud, Loader2, ArrowRight, X, ArrowLeft, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useShopStore } from '../../store/useShopStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Link } from 'react-router-dom';

const SHOP_CATEGORIES = [
  'Home Bakery',
  'Cloud Kitchen',
  'Handmade Crafts',
  'Art & Paintings',
  'Jewelry',
  'Clothing & Apparel',
  'Other',
];

export default function CreateShop() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchMyShop, myShop } = useShopStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      const previewUrl = URL.createObjectURL(file);
      if (type === 'logo') {
        setLogoFile(file);
        setLogoPreview(previewUrl);
      } else {
        setBannerFile(file);
        setBannerPreview(previewUrl);
      }
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.url;
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      let logoUrl = '';
      let bannerUrl = '';

      if (logoFile) logoUrl = await uploadImage(logoFile);
      if (bannerFile) bannerUrl = await uploadImage(bannerFile);

      const payload = {
        name: data.name,
        category: data.category,
        description: data.description,
        city: data.city,
        address: data.address,
        phone: data.phone,
        businessHours: data.businessHours,
        logo: logoUrl,
        banner: bannerUrl,
        socialLinks: {
          instagram: data.instagram,
          facebook: data.facebook,
          whatsapp: data.whatsapp,
        }
      };

      await api.post('/shop', payload);
      await fetchMyShop();
      toast.success('Shop created successfully!');
      navigate('/dashboard/seller');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create shop');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-12 relative">
      
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <Link to={myShop ? "/dashboard/seller" : "/"} className="flex items-center text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {myShop ? "Back to Dashboard" : "Back to Home"}
        </Link>
        <button onClick={handleLogout} className="flex items-center text-sm font-semibold text-red-500 hover:text-red-600 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-red-100 hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-[3rem] border border-gray-200 shadow-2xl overflow-hidden relative mt-8">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary to-accent opacity-20"></div>
        
        <div className="p-8 md:p-12 relative z-10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
              <Store className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight mb-3">Create your Shop</h1>
            <p className="text-foreground/60 text-lg max-w-lg mx-auto">Set up your professional profile to start selling your products to local customers.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Image Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">Shop Logo</label>
                <div 
                  className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${logoPreview ? 'border-primary/50 bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50'} h-48`}
                  onClick={() => logoInputRef.current?.click()}
                >
                  <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                  {logoPreview ? (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-md">
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={(e) => { e.stopPropagation(); setLogoFile(null); setLogoPreview(''); }} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"><X className="w-3 h-3"/></button>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-foreground">Click to upload logo</p>
                      <p className="text-xs text-foreground/50 mt-1">1:1 Square recommended</p>
                    </>
                  )}
                </div>
              </div>

              {/* Banner Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">Shop Banner</label>
                <div 
                  className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${bannerPreview ? 'border-primary/50 bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50'} h-48`}
                  onClick={() => bannerInputRef.current?.click()}
                >
                  <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                  {bannerPreview ? (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm">
                      <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={(e) => { e.stopPropagation(); setBannerFile(null); setBannerPreview(''); }} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full"><X className="w-3 h-3"/></button>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-foreground">Click to upload banner</p>
                      <p className="text-xs text-foreground/50 mt-1">16:9 Landscape recommended</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Shop Name</label>
                <input {...register('name', { required: 'Required' })} type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Sarah's Bakehouse" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message as string}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1.5">Category</label>
                <select {...register('category', { required: 'Required' })} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                  <option value="">Select a category</option>
                  {SHOP_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message as string}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Description</label>
              <textarea {...register('description', { required: 'Required', minLength: { value: 20, message: 'Too short' } })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" placeholder="Tell customers about your passion, ingredients, and story..." />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message as string}</p>}
            </div>

            <hr className="border-gray-100" />

            {/* Location & Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-1.5">City</label>
                <input {...register('city', { required: 'Required' })} type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Mumbai" />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Address (for local pickups)</label>
                <input {...register('address', { required: 'Required' })} type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="123 Street Name" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Phone Number</label>
                <input {...register('phone', { required: 'Required' })} type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="+91 9876543210" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Business Hours</label>
                <input {...register('businessHours', { required: 'Required' })} type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Mon-Sat, 9 AM - 6 PM" />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Instagram (Optional)</label>
                <input {...register('instagram')} type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none transition-all text-sm" placeholder="instagram.com/shop" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Facebook (Optional)</label>
                <input {...register('facebook')} type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none transition-all text-sm" placeholder="facebook.com/shop" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">WhatsApp (Optional)</label>
                <input {...register('whatsapp')} type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none transition-all text-sm" placeholder="Wa.me link or number" />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-primary/20 text-lg font-bold text-white bg-foreground hover:bg-primary transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed items-center"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
                {isLoading ? 'Setting up Shop...' : 'Create Shop and Continue'}
                {!isLoading && <ArrowRight className="w-6 h-6 ml-2" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
