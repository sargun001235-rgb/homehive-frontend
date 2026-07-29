import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Store, ShoppingBag, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuthStore } from '../../store/useAuthStore';

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role,
        phone: data.phone,
        city: data.city,
        address: data.address,
      };

      const response = await api.post('/auth/register', payload);
      const { token, ...user } = response.data;
      setAuth(user, token);
      
      toast.success('Account created successfully!');
      
      if (user.role === 'seller') {
        navigate('/dashboard/seller');
      } else {
        navigate('/dashboard/customer');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">Create an account</h2>
        <p className="text-foreground/60">Join GharSe and connect with your local community.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          type="button"
          onClick={() => setRole('customer')}
          className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all ${
            role === 'customer' 
              ? 'border-primary bg-primary/5 text-primary' 
              : 'border-gray-200 bg-white/50 text-foreground/60 hover:border-primary/50 hover:bg-gray-50'
          }`}
        >
          <ShoppingBag className={`w-8 h-8 mb-2 ${role === 'customer' ? 'text-primary' : 'text-gray-400'}`} />
          <span className="font-semibold text-sm">Shopper</span>
          <span className="text-xs opacity-70 mt-1">I want to buy local</span>
          {role === 'customer' && (
            <motion.div layoutId="role-indicator" className="absolute inset-0 border-2 border-primary rounded-2xl" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setRole('seller')}
          className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all ${
            role === 'seller' 
              ? 'border-primary bg-primary/5 text-primary' 
              : 'border-gray-200 bg-white/50 text-foreground/60 hover:border-primary/50 hover:bg-gray-50'
          }`}
        >
          <Store className={`w-8 h-8 mb-2 ${role === 'seller' ? 'text-primary' : 'text-gray-400'}`} />
          <span className="font-semibold text-sm">Creator</span>
          <span className="text-xs opacity-70 mt-1">I want to sell</span>
          {role === 'seller' && (
            <motion.div layoutId="role-indicator" className="absolute inset-0 border-2 border-primary rounded-2xl" />
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Row 1: Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute inset-y-0 left-0 pl-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                placeholder="Jane Doe"
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message as string}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute inset-y-0 left-0 pl-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' } })}
                type="email"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message as string}</p>}
          </div>
        </div>

        {/* Row 2: Phone and City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute inset-y-0 left-0 pl-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                {...register('phone', { required: 'Phone is required' })}
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                placeholder="+91 9876543210"
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message as string}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1">City</label>
            <div className="relative">
              <MapPin className="absolute inset-y-0 left-0 pl-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                {...register('city', { required: 'City is required' })}
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                placeholder="Mumbai"
              />
            </div>
            {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message as string}</p>}
          </div>
        </div>

        {/* Row 3: Address */}
        <div>
          <label className="block text-xs font-semibold text-foreground/80 mb-1">Address</label>
          <textarea
            {...register('address', { required: 'Address is required' })}
            rows={2}
            className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none resize-none"
            placeholder="123 Local Street, Neighborhood..."
          />
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message as string}</p>}
        </div>

        {/* Row 4: Passwords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute inset-y-0 left-0 pl-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                type="password"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message as string}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute inset-y-0 left-0 pl-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                {...register('confirmPassword', { 
                  required: 'Confirm Password is required',
                  validate: value => value === password || 'Passwords do not match'
                })}
                type="password"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message as string}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3.5 px-4 mt-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-sm font-semibold text-white bg-foreground hover:bg-primary transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed items-center"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          {isLoading ? 'Creating account...' : `Sign up as ${role === 'seller' ? 'Creator' : 'Shopper'}`}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/60">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
