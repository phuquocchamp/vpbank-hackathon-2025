import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN'; // Thêm 'USER' để khớp với dữ liệu
  name?: string;
  co_code_ld?: string; // Thêm nếu cần từ token custom
}

interface CustomTokenPayload {
  role?: 'USER' | 'ADMIN';
  co_code_ld?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null; // idToken từ Cognito
  customToken: string | null; // token custom chứa role, co_code_ld
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (idToken: string, customToken: string) => void;
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
  const [token, setToken] = useState<string | null>(null); // idToken
  const [customToken, setCustomToken] = useState<string | null>(null); // token custom
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app start
  useEffect(() => {
    const storedIdToken = localStorage.getItem('vpbank_id_token');
    const storedCustomToken = localStorage.getItem('vpbank_custom_token');

    console.log('AuthContext: Checking stored tokens', {
      hasIdToken: !!storedIdToken,
      hasCustomToken: !!storedCustomToken
    });

    if (storedIdToken) {
      try {
        const decodedIdToken = jwtDecode(storedIdToken) as any;
        console.log('AuthContext: Decoded ID token', decodedIdToken);

        if (decodedIdToken.exp * 1000 > Date.now()) {
          let decodedCustomToken: CustomTokenPayload = {};

          if (storedCustomToken) {
            try {
              decodedCustomToken = jwtDecode(storedCustomToken) as CustomTokenPayload;
              console.log('AuthContext: Decoded custom token', decodedCustomToken);
            } catch (error) {
              console.error('AuthContext: Failed to decode custom token', error);
            }
          }

          setToken(storedIdToken);
          setCustomToken(storedCustomToken);

          const userData = {
            id: decodedIdToken.sub,
            email: decodedIdToken.email,
            role: decodedCustomToken?.role || 'USER',
            name: decodedIdToken.name || undefined,
            co_code_ld: decodedCustomToken?.co_code_ld || "",
          };

          console.log('AuthContext: Setting user data', userData);
          setUser(userData);
        } else {
          console.log('AuthContext: Tokens expired, removing from storage');
          localStorage.removeItem('vpbank_id_token');
          localStorage.removeItem('vpbank_custom_token');
        }
      } catch (error) {
        console.error('AuthContext: Invalid token:', error);
        localStorage.removeItem('vpbank_id_token');
        localStorage.removeItem('vpbank_custom_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (idToken: string, customToken: string) => {
    console.log('AuthContext: Login called', { hasIdToken: !!idToken, hasCustomToken: !!customToken });

    try {
      const decodedIdToken = jwtDecode(idToken) as any;
      console.log('AuthContext: Login - Decoded ID token', decodedIdToken);

      let decodedCustomToken: CustomTokenPayload = {};
      if (customToken) {
        try {
          decodedCustomToken = jwtDecode(customToken) as CustomTokenPayload;
          console.log('AuthContext: Login - Decoded custom token', decodedCustomToken);
        } catch (error) {
          console.error('AuthContext: Failed to decode custom token during login', error);
        }
      }

      setToken(idToken);
      setCustomToken(customToken || null);

      const userData = {
        id: decodedIdToken.sub,
        email: decodedIdToken.email,
        role: decodedCustomToken.role || 'USER',
        name: decodedIdToken.name || undefined,
        co_code_ld: decodedCustomToken.co_code_ld || "",
      };

      console.log('AuthContext: Login - Setting user data', userData);
      setUser(userData);

      localStorage.setItem('vpbank_id_token', idToken);
      if (customToken) {
        localStorage.setItem('vpbank_custom_token', customToken);
      }
    } catch (error) {
      console.error('AuthContext: Failed to decode token during login:', error);
    }
  };

  const logout = () => {
    setToken(null);
    setCustomToken(null);
    setUser(null);
    localStorage.removeItem('vpbank_id_token');
    localStorage.removeItem('vpbank_custom_token');
  };

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  const value: AuthContextType = {
    user,
    token,
    customToken,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};