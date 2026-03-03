import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'store' | 'manager';
  redirectTo?: string;
}

export default function ProtectedRoute({ children, requiredRole, redirectTo }: Props) {
  const { user, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    const target = redirectTo || (requiredRole === 'admin' ? '/admin/login' : '/mobile/login');
    return <Navigate to={target} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // If admin trying to access store, etc. - redirect to their own area
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'store') return <Navigate to="/store" replace />;
    if (role === 'manager') return <Navigate to="/manager" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
