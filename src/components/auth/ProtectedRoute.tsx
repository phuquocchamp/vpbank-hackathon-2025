import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Mock user type - thay thế bằng context/store thực tế
interface User {
  id: string;
  email: string;
  role: 'admin' | 'client';
  name: string;
}

// Mock authentication hook - thay thế bằng authentication logic thực tế
const useAuth = () => {
  // Giả lập user đã đăng nhập
  const user: User | null = {
    id: '1',
    email: 'user@vpbank.com',
    role: 'client', // Thay đổi thành 'admin' để test admin routes
    name: 'Test User'
  };
  
  const isAuthenticated = !!user;
  
  return { user, isAuthenticated };
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'client';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user?.role === 'admin' ? '/admin' : '/client';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
