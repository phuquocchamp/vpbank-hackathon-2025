import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('vpbank_token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken) as any;
        
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser({
            id: decoded.sub,
            email: decoded.email,
            role: decoded['custom:role'] || 'user',
            name: decoded.name
          });
        } else {
          // Token expired, remove it
          localStorage.removeItem('vpbank_token');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('vpbank_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    try {
      const decoded = jwtDecode(newToken) as any;
      
      setToken(newToken);
      setUser({
        id: decoded.sub,
        email: decoded.email,
        role: decoded['custom:role'] || 'user',
        name: decoded.name
      });
      
      localStorage.setItem('vpbank_token', newToken);
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vpbank_token');
  };

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};