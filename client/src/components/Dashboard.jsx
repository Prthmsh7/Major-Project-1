import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Settings from './pages/Settings'
import Assistant from './pages/Assistant'
import About from './pages/About'
import Pantry from './pages/Pantry'
import Nutrition from './pages/Nutrition'
import { useTheme } from '../contexts/ThemeContext'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen flex ${theme === 'light' ? 'bg-light-background text-light-text-primary' : 'bg-dark-background text-dark-text-primary'}`}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className={`px-6 py-4 flex items-center justify-between shadow-md ${theme === 'light' ? 'bg-light-card-background border-b border-light-border' : 'bg-dark-card-background border-b border-dark-border'}`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${theme === 'light' ? 'text-light-text-secondary hover:bg-light-input-background' : 'text-dark-text-secondary hover:bg-dark-input-background'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center space-x-4">
            <h1 className={`text-2xl font-light ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary text-gradient'}`}>
              {getPageTitle(location.pathname)}
            </h1>
          </div>

          <div className="w-8" /> {/* Spacer for mobile */}
        </header>

        {/* Page content */}
        <main className={`flex-1 p-6 ${theme === 'light' ? 'bg-light-background' : 'bg-dark-background'}`}>
          <Routes>
            <Route path="/" element={<Settings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/about" element={<About />} />
            <Route path="/pantry" element={<Pantry />} />
            <Route path="/nutrition" element={<Nutrition />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

const getPageTitle = (pathname) => {
  const titles = {
    '/dashboard': 'Settings',
    '/dashboard/': 'Settings',
    '/dashboard/settings': 'Settings',
    '/dashboard/assistant': 'Assistant',
    '/dashboard/about': 'About',
    '/dashboard/pantry': 'Pantry',
    '/dashboard/nutrition': 'Nutrition'
  }
  return titles[pathname] || 'Dashboard'
}

export default Dashboard
