import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN'; // Thêm 'USER' để khớp với dữ liệu
  name?: string;
  co_code_ld?: string; // Thêm nếu cần từ token custom
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
    if (storedIdToken && storedCustomToken) {
      try {
        const decodedIdToken = jwtDecode(storedIdToken) as any;
        const decodedCustomToken = jwtDecode(storedCustomToken) as any;

        if (decodedIdToken.exp * 1000 > Date.now()) {
          setToken(storedIdToken);
          setCustomToken(storedCustomToken);
          setUser({
            id: decodedIdToken.sub,
            email: decodedIdToken.email,
            role: decodedCustomToken.role || 'USER', // Lấy role từ token custom
            name: decodedIdToken.name || undefined,
            co_code_ld: decodedCustomToken.co_code_ld || undefined,
          });
        } else {
          localStorage.removeItem('vpbank_id_token');
          localStorage.removeItem('vpbank_custom_token');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('vpbank_id_token');
        localStorage.removeItem('vpbank_custom_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (idToken: string, customToken: string) => {
    try {
      const decodedIdToken = jwtDecode(idToken) as any;
      const decodedCustomToken = customToken ? jwtDecode(customToken) as any : {};

      setToken(idToken);
      setCustomToken(customToken || null);
      setUser({
        id: decodedIdToken.sub,
        email: decodedIdToken.email,
        role: decodedCustomToken.role || 'USER',
        name: decodedIdToken.name || undefined,
        co_code_ld: decodedCustomToken.co_code_ld || undefined,
      });

      localStorage.setItem('vpbank_id_token', idToken);
      localStorage.setItem('vpbank_custom_token', customToken);
      if (customToken) localStorage.setItem('vpbank_custom_token', customToken);
    } catch (error) {
      console.error('Failed to decode token:', error);
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