import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  name?: string;
  co_code_ld?: string;
}

interface DecodedIdToken {
  sub: string;
  email: string;
  name?: string;
  'custom:role'?: 'USER' | 'ADMIN';
  'custom:co_code_ld'?: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null; // idToken từ Cognito
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (idToken: string) => void;
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
    const storedIdToken = localStorage.getItem('vpbank_id_token');

    console.log('AuthContext: Checking stored token', {
      hasIdToken: !!storedIdToken
    });

    if (storedIdToken) {
      try {
        const decodedToken = jwtDecode<DecodedIdToken>(storedIdToken);
        console.log('AuthContext: Decoded token', decodedToken);

        if (decodedToken.exp * 1000 > Date.now()) {
          setToken(storedIdToken);

          const userData: User = {
            id: decodedToken.sub,
            email: decodedToken.email,
            role: decodedToken['custom:role'] || 'USER',
            name: decodedToken.name,
            co_code_ld: decodedToken['custom:co_code_ld'],
          };

          console.log('AuthContext: Setting user data', userData);
          setUser(userData);
        } else {
          console.log('AuthContext: Token expired, removing from storage');
          localStorage.removeItem('vpbank_id_token');
        }
      } catch (error) {
        console.error('AuthContext: Invalid token:', error);
        localStorage.removeItem('vpbank_id_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (idToken: string) => {
    console.log('AuthContext: Login called', { hasIdToken: !!idToken });

    try {
      const decodedToken = jwtDecode<DecodedIdToken>(idToken);
      console.log('AuthContext: Login - Decoded token', decodedToken);

      setToken(idToken);

      const userData: User = {
        id: decodedToken.sub,
        email: decodedToken.email,
        role: decodedToken['custom:role'] || 'USER',
        name: decodedToken.name,
        co_code_ld: decodedToken['custom:co_code_ld'],
      };

      console.log('AuthContext: Login - Setting user data', userData);
      setUser(userData);

      localStorage.setItem('vpbank_id_token', idToken);
    } catch (error) {
      console.error('AuthContext: Failed to decode token during login:', error);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vpbank_id_token');
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
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};