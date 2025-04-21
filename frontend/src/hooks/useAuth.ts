import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useToast } from './useToast';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  fullName: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', {
        username,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await api.post('/api/auth/register', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  }, [navigate]);

  const checkAuth = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get<User>('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      logout();
      showToast('Session expired. Please login again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, logout, showToast]);

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await api.put<User>('/api/auth/profile', data);
      setUser(response.data);
      showToast('Profile updated successfully', 'success');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await api.post('/api/auth/password-reset', { email });
      showToast('Password reset instructions sent to your email', 'success');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to request password reset');
    }
  };

  const confirmPasswordReset = async (token: string, newPassword: string) => {
    try {
      await api.put('/api/auth/password-reset', { token, newPassword });
      showToast('Password reset successful. Please login with your new password.', 'success');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    confirmPasswordReset,
  };
};
