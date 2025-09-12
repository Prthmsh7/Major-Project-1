import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const About = () => {
  const { theme } = useTheme()
  const features = [
    {
      title: 'Premium Design',
      description: 'Luxurious dark theme with matte finish and minimalist aesthetics',
      icon: '✨'
    },
    {
      title: 'Secure Authentication',
      description: 'JWT-based authentication with SQLite database for user management',
      icon: '🔐'
    },
    {
      title: 'Responsive Layout',
      description: 'Fully responsive design that works seamlessly across all devices',
      icon: '📱'
    },
    {
      title: 'Modern Technology',
      description: 'Built with React, Node.js, and Express for optimal performance',
      icon: '⚡'
    }
  ]

  const stats = [
    { label: 'Version', value: '1.0.0' },
    { label: 'Build', value: '2024.1' },
    { label: 'Status', value: 'Active' },
    { label: 'License', value: 'MIT' }
  ]

  return (
    <div className={`max-w-6xl mx-auto p-4 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
      <div className="mb-12">
        <h1 className={`text-4xl font-light mb-4 ${theme === 'light' ? 'text-light-text-primary' : 'text-gradient'}`}>About Premium Dashboard</h1>
        <p className={`text-xl max-w-3xl leading-relaxed ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
          A sophisticated, minimalist dashboard application designed for the modern user who values 
          both functionality and aesthetic excellence. Built with premium materials and attention to detail.
        </p>
      </div>

      {/* Hero Section */}
      <div className="mb-16">
        <div className={`p-12 text-center relative overflow-hidden rounded-2xl shadow-md ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, ${theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} 1px, transparent 1px),
                               radial-gradient(circle at 80% 80%, ${theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              backgroundPosition: '0 0, 20px 20px'
            }} />
          </div>
          
          <div className="relative z-10">
            <div className={`text-6xl mb-6 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>🎨</div>
            <h2 className={`text-3xl font-light mb-4 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>Crafted with Precision</h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
              Every pixel, every interaction, and every detail has been carefully considered 
              to create an experience that feels both powerful and effortless.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className={`text-2xl font-light mb-8 text-center ${theme === 'light' ? 'text-light-text-primary' : 'text-gradient'}`}>Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-sm transition-all duration-300 ${theme === 'light' ? 'bg-light-card-background border border-light-border hover:border-light-accent' : 'bg-dark-card-background border border-dark-border hover:border-dark-accent'}`}
            >
              <div className="flex items-start space-x-4">
                <div className={`text-3xl ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{feature.icon}</div>
                <div>
                  <h3 className={`text-lg font-medium mb-2 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{feature.title}</h3>
                  <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-16">
        <h2 className={`text-2xl font-light mb-8 text-center ${theme === 'light' ? 'text-light-text-primary' : 'text-gradient'}`}>Project Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-sm text-center ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}
            >
              <div className={`text-2xl font-light mb-1 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{stat.value}</div>
              <div className={`text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="mb-16">
        <h2 className={`text-2xl font-light mb-8 text-center ${theme === 'light' ? 'text-light-text-primary' : 'text-gradient'}`}>Technology Stack</h2>
        <div className={`p-8 rounded-xl shadow-md ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-light-accent' : 'text-dark-accent'}`}>Frontend</h3>
              <ul className={`space-y-2 text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                <li>• React 18</li>
                <li>• Vite</li>
                <li>• React Router</li>
                <li>• Axios</li>
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-blue-600' : 'text-green-400'}`}>Backend</h3>
              <ul className={`space-y-2 text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                <li>• Node.js</li>
                <li>• Express.js</li>
                <li>• JWT Authentication</li>
                <li>• bcryptjs</li>
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`}>Database</h3>
              <ul className={`space-y-2 text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                <li>• SQLite3</li>
                <li>• Local Storage</li>
                <li>• Future: MongoDB</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`text-center text-sm opacity-70 mt-12 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
        <p>© 2024 Premium Dashboard. Built with passion and attention to detail.</p>
      </div>
    </div>
  )
}

export default About
