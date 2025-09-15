import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { FiMenu, FiX, FiBell, FiSearch, FiUser } from 'react-icons/fi';
import Sidebar from './Sidebar';
import Settings from './pages/Settings';
import Assistant from './pages/Assistant';
import About from './pages/About';
import Pantry from './pages/Pantry';
import Nutrition from './pages/Nutrition';
import { useTheme } from '../contexts/ThemeContext';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();

  // Handle scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <header 
          className={`sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-shadow duration-200 ${isScrolled ? 'shadow-sm' : ''}`}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side - Mobile menu button */}
              <div className="flex items-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  onClick={() => setSidebarOpen(true)}
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {sidebarOpen ? (
                    <FiX className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <FiMenu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>

                {/* Breadcrumb */}
                <nav className="ml-4 flex items-center text-sm" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2">
                    <li>
                      <div className="text-gray-500 dark:text-gray-400">
                        Dashboard
                      </div>
                    </li>
                    {location.pathname !== '/dashboard' && (
                      <>
                        <li>
                          <span className="text-gray-400 mx-2">/</span>
                        </li>
                        <li>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {getPageTitle(location.pathname)}
                          </span>
                        </li>
                      </>
                    )}
                  </ol>
                </nav>
              </div>

              {/* Right side - Search and user menu */}
              <div className="flex items-center">
                <div className="relative max-w-xs">
                  <label htmlFor="search" className="sr-only">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </div>

                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <FiBell className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <div className="ml-3 relative">
                    <button
                      type="button"
                      className="max-w-xs bg-white dark:bg-gray-800 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      id="user-menu"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Page title and actions */}
              <div className="md:flex md:items-center md:justify-between mb-6">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {getPageTitle(location.pathname)}
                  </h1>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                  {/* Action buttons can go here */}
                </div>
              </div>

              {/* Main content area */}
              <div className="mt-6">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<Settings />} />
        <Route path="settings" element={<Settings />} />
        <Route path="assistant" element={<Assistant />} />
        <Route path="about" element={<About />} />
        <Route path="pantry" element={<Pantry />} />
        <Route path="nutrition" element={<Nutrition />} />
      </Routes>
    </DashboardLayout>
  );
};

// Helper function to get page title from pathname
const getPageTitle = (pathname) => {
  const path = pathname.split('/').pop();
  switch (path) {
    case 'settings':
      return 'Settings';
    case 'assistant':
      return 'AI Assistant';
    case 'about':
      return 'About Us';
    case 'pantry':
      return 'My Pantry';
    case 'nutrition':
      return 'Nutrition Tracker';
    case 'dashboard':
    case '':
      return 'Dashboard';
    default:
      return 'Dashboard';
  }
};

export default Dashboard;
