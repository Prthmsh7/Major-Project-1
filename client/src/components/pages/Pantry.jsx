import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const Pantry = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Organic Quinoa', category: 'Grains', quantity: '2 lbs', expiry: '2024-03-15' },
    { id: 2, name: 'Extra Virgin Olive Oil', category: 'Oils', quantity: '500ml', expiry: '2025-12-01' },
    { id: 3, name: 'Black Beans', category: 'Legumes', quantity: '4 cans', expiry: '2026-06-30' },
    { id: 4, name: 'Himalayan Salt', category: 'Seasonings', quantity: '1 lb', expiry: '2027-01-01' }
  ])

  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: '',
    expiry: ''
  })

  const [showAddForm, setShowAddForm] = useState(false)
  const { theme } = useTheme()

  const categories = ['Grains', 'Legumes', 'Oils', 'Seasonings', 'Spices', 'Canned Goods', 'Beverages', 'Other']

  const handleAddItem = (e) => {
    e.preventDefault()
    if (!newItem.name || !newItem.category || !newItem.quantity) return

    const item = {
      id: Date.now(),
      ...newItem
    }
    setItems(prev => [...prev, item])
    setNewItem({ name: '', category: '', quantity: '', expiry: '' })
    setShowAddForm(false)
  }

  const handleDeleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'unknown', color: `${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}` }
    
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { status: 'expired', color: 'text-red-500' }
    if (diffDays <= 7) return { status: 'expiring soon', color: 'text-yellow-500' }
    if (diffDays <= 30) return { status: 'expiring this month', color: 'text-orange-500' }
    return { status: 'fresh', color: 'text-green-500' }
  }

  return (
    <div className={`max-w-6xl mx-auto p-4 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className={`text-3xl font-light mb-2 ${theme === 'light' ? 'text-light-text-primary' : 'text-gradient'}`}>Pantry Management</h1>
            <p className={`${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Track your food inventory and manage expiry dates.</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${theme === 'light' ? 'bg-light-accent text-white hover:bg-opacity-90' : 'bg-dark-accent text-white hover:bg-opacity-90'}`}
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
            <div className="p-6">
              <h2 className={`text-xl font-medium mb-4 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>Add New Item</h2>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Item Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="Enter item name"
                    required
                    className={`w-full p-3 rounded-lg ${theme === 'light' ? 'bg-light-input-background border border-light-input-border text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent' : 'bg-dark-input-background border border-dark-input-border text-dark-text-primary focus:ring-2 focus:ring-dark-accent focus:border-dark-accent'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    required
                    className={`w-full p-3 rounded-lg ${theme === 'light' ? 'bg-light-input-background border border-light-input-border text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent' : 'bg-dark-input-background border border-dark-input-border text-dark-text-primary focus:ring-2 focus:ring-dark-accent focus:border-dark-accent'}`}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Quantity</label>
                  <input
                    type="text"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                    placeholder="e.g., 2 lbs, 500ml"
                    required
                    className={`w-full p-3 rounded-lg ${theme === 'light' ? 'bg-light-input-background border border-light-input-border text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent' : 'bg-dark-input-background border border-dark-input-border text-dark-text-primary focus:ring-2 focus:ring-dark-accent focus:border-dark-accent'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={newItem.expiry}
                    onChange={(e) => setNewItem({...newItem, expiry: e.target.value})}
                    className={`w-full p-3 rounded-lg ${theme === 'light' ? 'bg-light-input-background border border-light-input-border text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent' : 'bg-dark-input-background border border-dark-input-border text-dark-text-primary focus:ring-2 focus:ring-dark-accent focus:border-dark-accent'}`}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${theme === 'light' ? 'text-light-text-secondary hover:bg-light-input-background' : 'text-dark-text-secondary hover:bg-dark-input-background'}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${theme === 'light' ? 'bg-light-accent text-white hover:bg-opacity-90' : 'bg-dark-accent text-white hover:bg-opacity-90'}`}
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-xl shadow-sm text-center ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
          <div className={`text-2xl font-light mb-1 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{items.length}</div>
          <div className={`text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Total Items</div>
        </div>
        <div className={`p-6 rounded-xl shadow-sm text-center ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
          <div className={`text-2xl font-light mb-1 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
            {items.filter(item => {
              const status = getExpiryStatus(item.expiry)
              return status.status === 'expiring soon' || status.status === 'expired'
            }).length}
          </div>
          <div className={`text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Expiring Soon</div>
        </div>
        <div className={`p-6 rounded-xl shadow-sm text-center ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
          <div className={`text-2xl font-light mb-1 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
            {new Set(items.map(item => item.category)).size}
          </div>
          <div className={`text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Categories</div>
        </div>
        <div className={`p-6 rounded-xl shadow-sm text-center ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
          <div className={`text-2xl font-light mb-1 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
            {items.filter(item => {
              const status = getExpiryStatus(item.expiry)
              return status.status === 'fresh'
            }).length}
          </div>
          <div className={`text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Fresh Items</div>
        </div>
      </div>

      {/* Items List */}
      <div className={`rounded-xl shadow-md overflow-hidden ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${theme === 'light' ? 'border-light-border' : 'border-dark-border'}`}>
              <tr>
                <th className={`text-left p-6 font-medium ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Item</th>
                <th className={`text-left p-6 font-medium ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Category</th>
                <th className={`text-left p-6 font-medium ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Quantity</th>
                <th className={`text-left p-6 font-medium ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Expiry</th>
                <th className={`text-left p-6 font-medium ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Status</th>
                <th className={`text-left p-6 font-medium ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const expiryStatus = getExpiryStatus(item.expiry)
                return (
                  <tr key={item.id} className={`border-b ${theme === 'light' ? 'border-light-border hover:bg-gray-50' : 'border-dark-border hover:bg-dark-input-background'} transition-colors duration-200`}>
                    <td className="p-6">
                      <div className={`font-medium ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{item.name}</div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-sm border ${theme === 'light' ? 'bg-light-input-background text-light-text-secondary border-light-input-border' : 'bg-dark-input-background text-dark-text-secondary border-dark-input-border'}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className={`p-6 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{item.quantity}</td>
                    <td className={`p-6 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                      {item.expiry ? new Date(item.expiry).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-6">
                      <span className={`text-sm font-medium ${expiryStatus.color}`}>
                        {expiryStatus.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className={`text-red-500 hover:text-red-700 transition-colors duration-200 rounded-lg ${theme === 'light' ? 'hover:bg-red-50' : 'hover:bg-red-900 hover:bg-opacity-20'}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature notice */}
      <div className={`mt-6 p-4 rounded-xl shadow-md ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
        <div className="flex items-start space-x-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900 bg-opacity-20 text-blue-400'}`}>
            <span className="text-sm">ℹ️</span>
          </div>
          <div>
            <p className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-light-accent' : 'text-dark-accent'}`}>Coming Soon</p>
            <p className={`text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
              Advanced pantry features including barcode scanning, recipe suggestions, 
              shopping lists, and inventory analytics will be available in future updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pantry
