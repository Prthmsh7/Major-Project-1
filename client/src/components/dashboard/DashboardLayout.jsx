import { useState } from 'react';
import { FiHome, FiPieChart, FiPlusCircle, FiLogOut, FiCalendar } from 'react-icons/fi';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navigation = [
    { name: 'Dashboard', icon: FiHome, href: '/dashboard' },
    { name: 'Meal Planning', icon: FiCalendar, href: '/meal-planning' },
    { name: 'Nutrition', icon: FiPieChart, href: '/nutrition' },
    { name: 'Add Food', icon: FiPlusCircle, href: '/add-food' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4">
          <h1 className={`text-2xl font-bold text-blue-600 ${!sidebarOpen ? 'hidden' : 'block'}`}>
            NutriTracker
          </h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            ☰
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <div className="px-4 py-2">
            {sidebarOpen && user && (
              <div className="mb-6 p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <p className="font-medium text-gray-700 dark:text-gray-200">{user.username}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            )}
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
