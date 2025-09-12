import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const { theme } = useTheme()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let result
      if (isLogin) {
        result = await login(formData.email, formData.password)
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        result = await register(formData.username, formData.email, formData.password)
      }

      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    setError('')
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    resetForm()
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'light' ? 'bg-light-background text-light-text' : 'bg-dark-background text-dark-text'}`}>
      <div className="w-full max-w-md bg-light-card-background rounded-2xl shadow-xl p-8 border border-light-border relative">
        <h2 className="text-3xl font-bold mb-6 text-light-text-primary text-center">
          {isLogin ? 'Welcome Back' : 'Create Your Account'}
        </h2>
        <p className="text-center text-light-text-secondary mb-8">
          {isLogin ? 'Sign in to continue to your dashboard' : 'Join us and start your journey'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-light-text-secondary mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required={!isLogin}
                className="w-full p-3 border border-light-input-border rounded-lg bg-light-input-background text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent"
                placeholder="Enter your username"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-light-text-secondary mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-light-input-border rounded-lg bg-light-input-background text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-text-secondary mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-light-input-border rounded-lg bg-light-input-background text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent"
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-light-text-secondary mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required={!isLogin}
                className="w-full p-3 border border-light-input-border rounded-lg bg-light-input-background text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent"
                placeholder="Confirm your password"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-light-accent text-white p-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-light-text-secondary hover:text-light-accent transition-colors duration-200"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
