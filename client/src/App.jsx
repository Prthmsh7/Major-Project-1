import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LandingPage from '@/components/LandingPage'
import Dashboard from '@/components/Dashboard'
import AuthPage from '@/components/AuthPage'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'

function AppContent() {
  const { user, loading } = useAuth()
  const { theme, setTheme } = useTheme()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [location.pathname, setTheme])

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-xl opacity-70">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
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
          element={
            user ? (
              <Dashboard />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
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
