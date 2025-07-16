import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const AuthGuard = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to appropriate dashboard based on role
  const redirectPath = user?.role === 'ADMIN' ? '/admin' : '/client';
  return <Navigate to={redirectPath} replace />;
};

export default AuthGuard;