import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { theme } = useTheme()

  const navigation = [
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
    { name: 'Assistant', href: '/dashboard/assistant', icon: '🤖' },
    { name: 'About', href: '/dashboard/about', icon: 'ℹ️' },
    { name: 'Pantry', href: '/dashboard/pantry', icon: '📦' },
    { name: 'Nutrition', href: '/dashboard/nutrition', icon: '🥗' }
  ]

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
        ${theme === 'light' ? 'bg-light-card-background border-r border-light-border' : 'bg-dark-card-background border-r border-dark-border'}
      `}>
        
        {/* Logo */}
        <div className={`p-6 border-b ${theme === 'light' ? 'border-light-border' : 'border-dark-border'}`}>
          <h2 className={`text-xl font-light tracking-wide ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary text-gradient'}`}>
            Premium Dashboard
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`
                  flex items-center px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? `${theme === 'light' ? 'bg-light-input-background text-light-accent font-semibold' : 'bg-dark-input-background text-dark-accent font-semibold'}` 
                    : `${theme === 'light' ? 'text-light-text-secondary hover:bg-light-input-background' : 'text-dark-text-secondary hover:bg-dark-input-background'}`
                  }
                `}
              >
                <span className={`text-lg mr-3 ${isActive ? 'text-current' : ''}`}>
                  {item.icon}
                </span>
                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            )
          })}
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
      </div>
    </>
  )
}

export default Sidebar
