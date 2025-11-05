import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

// Pages
import AuthPage from '@/components/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import NutritionPage from '@/pages/NutritionPage';
import MealPlanningPage from '@/pages/MealPlanningPage';
import PantryPage from '@/pages/PantryPage';

// Layouts
import DashboardLayout from '@/components/dashboard/DashboardLayout';

/**
 * Authentication Check Component
 * Shows loading state while checking authentication
 */
const AuthCheck = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
};

/**
 * Protected Route Component
 * Redirects to /auth if user is not authenticated
 */
const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

/**
 * Public Route Component
 * Only accessible when not authenticated
 */
const PublicRoute = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

/**
 * App Routes Component
 * Handles all the routing logic
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Only accessible when not logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Route>

      {/* Protected Routes - Only accessible when logged in */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/meal-planning" element={<MealPlanningPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/pantry" element={<PantryPage />} />
        </Route>
      </Route>

      {/* Catch all other routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

/**
 * App Content Component
 * Wraps the app with theme and auth providers
 */
const App = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <AuthCheck>
        <AppRoutes />
      </AuthCheck>
    </div>
  );
};

export default App;
