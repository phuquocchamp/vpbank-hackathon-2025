import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mock AWS Cognito authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Login successful, token contains role info
      login(data.token);
      
      // Navigate based on role or return to intended page
      if (from === '/') {
        const userRole = JSON.parse(atob(data.token.split('.')[1]))['custom:role'];
        navigate(userRole === 'admin' ? '/admin' : '/client', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login functions for testing
  const handleDemoLogin = (role: 'user' | 'admin') => {
    const demoToken = createDemoToken(role);
    login(demoToken);
    navigate(role === 'admin' ? '/admin' : '/client', { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>VPBank Hackathon</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo buttons for testing */}
          <div className="mt-6 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Demo Login:</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('user')}
                className="flex-1"
              >
                Login as User
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('admin')}
                className="flex-1"
              >
                Login as Admin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to create demo token
const createDemoToken = (role: 'user' | 'admin') => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: role === 'admin' ? 'admin-123' : 'user-123',
    email: role === 'admin' ? 'admin@vpbank.com' : 'user@vpbank.com',
    name: role === 'admin' ? 'Admin User' : 'Demo User',
    'custom:role': role,
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = 'demo-signature';

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export default LoginPage;
