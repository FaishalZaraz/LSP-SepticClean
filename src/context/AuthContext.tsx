import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authAPI } from '../lib/api.js';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string, role?: string) => Promise<boolean>;
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
      const response = await authAPI.login(email.trim(), password);
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
        return true;
      } else {
        setError(response.message || 'Login gagal');
        return false;
      }
    } catch (error) {
      setError('Gagal terhubung ke database. Pastikan XAMPP MySQL berjalan dan backend tersedia.');
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, role: string = 'customer'): Promise<boolean> => {
    setError(null);
    try {
      let regName = name;
      let regRole = role;
      if (email.trim().toLowerCase() === 'admin@septictank.com') {
        regName = 'Admin';
        regRole = 'admin';
      }
      const response = await authAPI.register(email, password, regName, regRole);
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
        return true;
      } else {
        setError(response.message || 'Registrasi gagal');
        return false;
      }
    } catch (error: any) {
      // Cek jika error dari response API (misal: email sudah ada, password salah, dll)
      if (error && error.message && typeof error.message === 'string') {
        setError(error.message);
      } else if (error && error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
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
    <AuthContext.Provider value={{ user, login, logout, register, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};