import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

const LandingPage = () => {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${theme === 'dark' ? 'bg-dark-background text-dark-text' : 'bg-light-background text-light-text'}`}>
      {/* Background elements for visual interest */}
      <div className="absolute inset-0 z-0 opacity-10" style={{
        background: `radial-gradient(circle at 20% 20%, ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px),
                     radial-gradient(circle at 80% 80%, ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        backgroundPosition: '0 0, 40px 40px'
      }} />

      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-gradient-to-br from-purple-800 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
      <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-br from-pink-500 to-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gradient-to-br from-green-400 to-teal-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />

      <div className="relative z-10 text-center max-w-4xl mx-auto p-12 bg-dark-card-background rounded-3xl shadow-2xl backdrop-blur-sm">
        <h1 className="text-7xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 leading-tight">
            Premium Dashboard
        </h1>
        <p className="text-xl font-light mb-12 text-dark-text-secondary max-w-2xl mx-auto leading-relaxed">
          Experience the future of digital interaction with our premium, 
          minimalist dashboard designed for the discerning user.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            to="/auth"
            className="button-primary px-10 py-4 text-xl font-semibold transform hover:scale-105 transition-transform duration-300 ease-out"
          >
            Get Started
          </Link>
          <Link
            to="/auth"
            className="button-secondary px-8 py-4 text-xl font-medium transform hover:scale-105 transition-transform duration-300 ease-out"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-20 text-sm text-dark-text-tertiary">
          © 2024 Premium Dashboard. All rights reserved.
        </div>
      </div>
    </div>
  )
}

export default LandingPage
