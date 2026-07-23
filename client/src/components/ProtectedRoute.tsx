import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface ProtectedRouteProps {
  allowedRole?: 'customer' | 'seller';
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    if (user?.role === 'seller') {
      return <Navigate to="/dashboard/seller" replace />;
    } else {
      return <Navigate to="/dashboard/customer" replace />;
    }
  }

  return <Outlet />;
}
