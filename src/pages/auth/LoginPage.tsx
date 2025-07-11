import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'admin' | 'client'>('client');
  
  // Mock login function
  const handleLogin = () => {
    // Redirect based on role
    if (role === 'admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/client';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            VPBank Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose your role to continue
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Login as:
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'client')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="client">Client User</option>
              <option value="admin">Admin User</option>
            </select>
          </div>
          <button
            onClick={handleLogin}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login as {role}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
