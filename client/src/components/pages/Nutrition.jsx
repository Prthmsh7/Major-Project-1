import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const Nutrition = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  })

  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    meal: 'breakfast'
  })

  const [showAddForm, setShowAddForm] = useState(false)
  const { theme } = useTheme()

  const mealTypes = [
    { key: 'breakfast', name: 'Breakfast', icon: '🌅' },
    { key: 'lunch', name: 'Lunch', icon: '☀️' },
    { key: 'dinner', name: 'Dinner', icon: '🌙' },
    { key: 'snacks', name: 'Snacks', icon: '🍎' }
  ]

  const handleAddFood = (e) => {
    e.preventDefault()
    if (!newFood.name || !newFood.calories) return

    const food = {
      id: Date.now(),
      ...newFood,
      calories: parseFloat(newFood.calories) || 0,
      protein: parseFloat(newFood.protein) || 0,
      carbs: parseFloat(newFood.carbs) || 0,
      fat: parseFloat(newFood.fat) || 0
    }

    setMeals(prev => ({
      ...prev,
      [newFood.meal]: [...prev[newFood.meal], food]
    }))

    setNewFood({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      meal: 'breakfast'
    })
    setShowAddForm(false)
  }

  const handleDeleteFood = (mealType, foodId) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter(food => food.id !== foodId)
    }))
  }

  const getTotalNutrients = () => {
    const allFoods = Object.values(meals).flat()
    return allFoods.reduce((totals, food) => ({
      calories: totals.calories + food.calories,
      protein: totals.protein + food.protein,
      carbs: totals.carbs + food.carbs,
      fat: totals.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 })
  }

  const totals = getTotalNutrients()

  const getCalorieGoal = () => 2000 // Default goal
  const getProteinGoal = () => 150 // Default goal in grams
  const getCarbsGoal = () => 250 // Default goal in grams
  const getFatGoal = () => 65 // Default goal in grams

  return (
    <div className={`max-w-6xl mx-auto p-4 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className={`text-3xl font-light mb-2 ${theme === 'light' ? 'text-light-text-primary' : 'text-gradient'}`}>Nutrition Tracking</h1>
            <p className={`${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Monitor your daily nutrition and maintain a balanced diet.</p>
          </div>
          <div className="flex space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-light-input-background border border-light-input-border text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent' : 'bg-dark-input-background border border-dark-input-border text-dark-text-primary focus:ring-2 focus:ring-dark-accent focus:border-dark-accent'}`}
            />
            <button
              onClick={() => setShowAddForm(true)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${theme === 'light' ? 'bg-light-accent text-white hover:bg-opacity-90' : 'bg-dark-accent text-white hover:bg-opacity-90'}`}
            >
              Add Food
            </button>
          </div>
        </div>
      </div>

      {/* Add Food Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
            <div className="p-6">
              <h2 className={`text-xl font-medium mb-4 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>Add Food Item</h2>
              <form onSubmit={handleAddFood} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Food Name</label>
                  <input
                    type="text"
                    value={newFood.name}
                    onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                    placeholder="Enter food name"
                    required
                    className={`w-full p-3 rounded-lg ${theme === 'light' ? 'bg-light-input-background border border-light-input-border text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent' : 'bg-dark-input-background border border-dark-input-border text-dark-text-primary focus:ring-2 focus:ring-dark-accent focus:border-dark-accent'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Meal</label>
                  <select
                    value={newFood.meal}
                    onChange={(e) => setNewFood({...newFood, meal: e.target.value})}
                    className={`w-full p-3 rounded-lg ${theme === 'light' ? 'bg-light-input-background border border-light-input-border text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent' : 'bg-dark-input-background border border-dark-input-border text-dark-text-primary focus:ring-2 focus:ring-dark-accent focus:border-dark-accent'}`}
                  >
                    {mealTypes.map(meal => (
                      <option key={meal.key} value={meal.key}>{meal.icon} {meal.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Calories</label>
                    <input
                      type="number"
                      value={newFood.calories}
                      onChange={(e) => setNewFood({...newFood, calories: e.target.value})}
                      placeholder="0"
                      required
                      className={`w-full p-3 rounded-lg ${theme === 'light' ? 'bg-light-input-background border border-light-input-border text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent' : 'bg-dark-input-background border border-dark-input-border text-dark-text-primary focus:ring-2 focus:ring-dark-accent focus:border-dark-accent'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Protein (g)</label>
                    <input
                      type="number"
                      value={newFood.protein}
                      onChange={(e) => setNewFood({...newFood, protein: e.target.value})}
                      placeholder="0"
                      className={`w-full p-3 rounded-lg ${theme === 'light' ? 'bg-light-input-background border border-light-input-border text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent' : 'bg-dark-input-background border border-dark-input-border text-dark-text-primary focus:ring-2 focus:ring-dark-accent focus:border-dark-accent'}`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Carbs (g)</label>
                    <input
                      type="number"
                      value={newFood.carbs}
                      onChange={(e) => setNewFood({...newFood, carbs: e.target.value})}
                      placeholder="0"
                      className={`w-full p-3 rounded-lg ${theme === 'light' ? 'bg-light-input-background border border-light-input-border text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent' : 'bg-dark-input-background border border-dark-input-border text-dark-text-primary focus:ring-2 focus:ring-dark-accent focus:border-dark-accent'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Fat (g)</label>
                    <input
                      type="number"
                      value={newFood.fat}
                      onChange={(e) => setNewFood({...newFood, fat: e.target.value})}
                      placeholder="0"
                      className={`w-full p-3 rounded-lg ${theme === 'light' ? 'bg-light-input-background border border-light-input-border text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent' : 'bg-dark-input-background border border-dark-input-border text-dark-text-primary focus:ring-2 focus:ring-dark-accent focus:border-dark-accent'}`}
                    />
                  </div>
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
                    Add Food
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-xl shadow-sm text-center ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
          <div className={`text-3xl font-light mb-2 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{totals.calories}</div>
          <div className={`text-sm mb-1 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Calories</div>
          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-dark-text-tertiary'}`}>
            Goal: {getCalorieGoal()} ({Math.round((totals.calories / getCalorieGoal()) * 100)}%)
          </div>
        </div>
        <div className={`p-6 rounded-xl shadow-sm text-center ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
          <div className={`text-3xl font-light mb-2 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{totals.protein}g</div>
          <div className={`text-sm mb-1 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Protein</div>
          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-dark-text-tertiary'}`}>
            Goal: {getProteinGoal()}g ({Math.round((totals.protein / getProteinGoal()) * 100)}%)
          </div>
        </div>
        <div className={`p-6 rounded-xl shadow-sm text-center ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
          <div className={`text-3xl font-light mb-2 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{totals.carbs}g</div>
          <div className={`text-sm mb-1 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Carbs</div>
          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-dark-text-tertiary'}`}>
            Goal: {getCarbsGoal()}g ({Math.round((totals.carbs / getCarbsGoal()) * 100)}%)
          </div>
        </div>
        <div className={`p-6 rounded-xl shadow-sm text-center ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
          <div className={`text-3xl font-light mb-2 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{totals.fat}g</div>
          <div className={`text-sm mb-1 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Fat</div>
          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-dark-text-tertiary'}`}>
            Goal: {getFatGoal()}g ({Math.round((totals.fat / getFatGoal()) * 100)}%)
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-6">
        {mealTypes.map(mealType => (
          <div key={mealType.key} className={`rounded-xl shadow-md overflow-hidden ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
            <div className={`p-6 border-b ${theme === 'light' ? 'border-light-border' : 'border-dark-border'}`}>
              <h3 className={`text-lg font-medium flex items-center ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
                <span className={`text-2xl mr-3 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{mealType.icon}</span>
                {mealType.name}
              </h3>
            </div>
            <div className="p-6">
              {meals[mealType.key].length === 0 ? (
                <p className={`text-center py-8 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>No items added yet</p>
              ) : (
                <div className="space-y-3">
                  {meals[mealType.key].map(food => (
                    <div key={food.id} className={`flex justify-between items-center p-4 rounded-lg border shadow-sm ${theme === 'light' ? 'bg-light-input-background border-light-input-border' : 'bg-dark-input-background border-dark-input-border'}`}>
                      <div className="flex-1">
                        <div className={`font-medium ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{food.name}</div>
                        <div className={`text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                          {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fat}g fat
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteFood(mealType.key, food.id)}
                        className={`text-red-500 hover:text-red-700 transition-colors duration-200 rounded-lg ${theme === 'light' ? 'hover:bg-red-50' : 'hover:bg-red-900 hover:bg-opacity-20'} ml-4`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
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
              Advanced nutrition features including food database integration, barcode scanning, 
              meal planning, recipe suggestions, and detailed analytics will be available in future updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Nutrition
