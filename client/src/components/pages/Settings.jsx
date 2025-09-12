import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const Settings = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    language: 'en',
    timezone: 'UTC'
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className={`max-w-4xl mx-auto p-4 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-light mb-2 ${theme === 'light' ? 'text-light-text-primary' : 'text-gradient'}`}>Settings</h1>
        <p className={`${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Manage your account preferences and application settings.</p>
      </div>

      <div className="grid gap-6">
        {/* Account Information */}
        <div className={`p-6 rounded-xl shadow-md ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
          <h2 className={`text-xl font-medium mb-4 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>Account Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Username</label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className={`cursor-not-allowed ${theme === 'light' ? 'bg-gray-100 border-gray-300 text-gray-600' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className={`cursor-not-allowed ${theme === 'light' ? 'bg-gray-100 border-gray-300 text-gray-600' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className={`p-6 rounded-xl shadow-md ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
          <h2 className={`text-xl font-medium mb-4 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>Appearance</h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className={`w-full p-3 rounded-lg ${theme === 'light' ? 'bg-light-input-background border border-light-input-border text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent' : 'bg-dark-input-background border border-dark-input-border text-dark-text-primary focus:ring-2 focus:ring-dark-accent focus:border-dark-accent'}`}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className={`p-6 rounded-xl shadow-md ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
          <h2 className={`text-xl font-medium mb-4 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>Email Notifications</p>
                <p className={`text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer-focus:outline-none after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${theme === 'light' ? 'bg-gray-300 peer-checked:bg-light-accent peer-checked:after:translate-x-full' : 'bg-gray-700 peer-checked:bg-dark-accent peer-checked:after:translate-x-full'}`}></div>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          <button className={`px-6 py-3 rounded-lg transition-colors duration-200 ${theme === 'light' ? 'text-light-text-secondary hover:bg-light-input-background' : 'text-dark-text-secondary hover:bg-dark-input-background'}`}>
            Cancel
          </button>
          <button className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${theme === 'light' ? 'bg-light-accent text-white hover:bg-opacity-90' : 'bg-dark-accent text-white hover:bg-opacity-90'}`}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
