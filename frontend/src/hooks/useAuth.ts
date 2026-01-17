import { useState, useEffect } from 'react';
import { authService } from '@/services/auth';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/types/user.types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated on mount
    const currentUser = authService.getUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    
    const response = await authService.login(credentials);
    
    if (response.success && response.user) {
      setUser(response.user);
    } else {
      setError(response.error || 'Login failed');
    }
    
    setIsLoading(false);
    return response;
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    
    const response = await authService.register(data);
    
    if (response.success && response.user) {
      setUser(response.user);
    } else {
      setError(response.error || 'Registration failed');
    }
    
    setIsLoading(false);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
  };
};
