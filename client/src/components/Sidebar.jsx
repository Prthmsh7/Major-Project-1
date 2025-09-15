import { Link, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FiSettings, FiHelpCircle, FiPackage, FiActivity, FiLogOut } from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <FiActivity className="w-5 h-5" /> },
    { name: 'Pantry', href: '/dashboard/pantry', icon: <FiPackage className="w-5 h-5" /> },
    { name: 'Nutrition', href: '/dashboard/nutrition', icon: <FiActivity className="w-5 h-5" /> },
    { name: 'Assistant', href: '/dashboard/assistant', icon: <RiRobot2Line className="w-5 h-5" /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <FiSettings className="w-5 h-5" /> },
    { name: 'Help', href: '/dashboard/help', icon: <FiHelpCircle className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  // Check if a nav item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col border-r border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-800 shadow-lg lg:shadow-none
        `}
        aria-label="Sidebar"
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            NutriTrack
          </h1>
          {user && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) => `
                group flex items-center px-3 py-2.5 text-sm font-medium rounded-md
                transition-colors duration-150
                ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70'
                }`
              }
            >
              <span 
                className={`
                  mr-3 flex-shrink-0
                  ${isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'}
                  `}
              >
                {item.icon}
              </span>
              {item.name}
            </NavLink>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="
                group w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md
                text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70
                transition-colors duration-150
              "
            >
              <FiLogOut className="mr-3 w-5 h-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400" />
              Sign out
            </button>
          </div>
        </nav>

        {/* User section */}
        <div className={`p-4 border-t ${theme === 'light' ? 'border-light-border' : 'border-dark-border'}`}>
          <div className="flex items-center mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 border ${theme === 'light' ? 'bg-light-input-background border-light-input-border' : 'bg-dark-input-background border-dark-input-border'}`}>
              <span className={`text-sm font-medium ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
                {user?.username || 'User'}
              </p>
              <p className={`text-xs truncate ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 justify-center
                     ${theme === 'light' ? 'bg-light-input-background text-light-text-secondary hover:bg-red-100 hover:text-red-700' : 'bg-dark-input-background text-dark-text-secondary hover:bg-red-900 hover:text-red-400'}
                     border ${theme === 'light' ? 'border-light-input-border' : 'border-dark-input-border'}`}
          >
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
