import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await verifyToken(token);
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Verify token with server
  const verifyToken = async (token) => {
    try {
      setLoading(true);
      const response = await api.get('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (err) {
      console.error('Token verification failed:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Register new user
  const register = async (username, email, password) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/register', { 
        username, 
        email, 
        password 
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Logout user
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/auth');
  }, [navigate]);

  // Clear any auth errors
  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
