import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';
import AuthPage from '@/components/AuthPage';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

function AppContent() {
  const { user, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  // Set theme based on route
  useEffect(() => {
    if (location.pathname === '/') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [location.pathname, setTheme]);

  // Apply theme to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Routes>
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LandingPage />
            )
          } 
        />
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
        />
        <Route 
          path="/dashboard/*" 
          element={user ? <Dashboard /> : <Navigate to="/auth" replace />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
