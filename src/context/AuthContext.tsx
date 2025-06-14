import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authAPI } from '../lib/api.js';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Simple token validation (in production, verify with server)
        const tokenData = JSON.parse(atob(token));
        if (tokenData.exp > Date.now() / 1000) {
          setUser(userData);
          console.log('User restored from token:', userData.email);
        } else {
          console.log('Token expired, clearing storage');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    
    try {
      console.log('Attempting login with database...');
      const response = await authAPI.login(email, password);
      
      if (response.success && response.user && response.token) {
        const userData: User = {
          id: response.user.id.toString(),
          email: response.user.email,
          name: response.user.name,
          role: response.user.role
        };
        
        setUser(userData);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('Login successful from database:', userData.email);
        return true;
      } else {
        setError(response.message || 'Login gagal');
        return false;
      }
    } catch (error) {
      console.error('Database login error:', error);
      setError('Gagal terhubung ke database. Pastikan XAMPP MySQL berjalan dan backend tersedia.');
      
      // Only use hardcoded admin as absolute fallback when database is completely unavailable
      if (email === 'admin@septictank.com' && password === 'admin123') {
        console.log('Using fallback admin login');
        const adminUser: User = {
          id: '1',
          email: 'admin@septictank.com',
          name: 'Admin (Fallback)',
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        setError('Login berhasil (mode fallback). Untuk fitur lengkap, pastikan database tersedia.');
        return true;
      }
      
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};