import { useState } from 'react';
import { FiSearch, FiPlus, FiX } from 'react-icons/fi';

const AddFoodForm = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [foodItems, setFoodItems] = useState([]);
  const [quantity, setQuantity] = useState('1');
  const [selectedFood, setSelectedFood] = useState(null);

  // Mock food database - replace with actual API call
  const foodDatabase = [
    { id: 1, name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, serving: '1 medium (182g)' },
    { id: 2, name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
    { id: 3, name: 'White Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, serving: '100g' },
    { id: 4, name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, serving: '100g' },
  ];

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFood = () => {
    if (!selectedFood) return;
    
    const newFoodItem = {
      ...selectedFood,
      quantity: parseFloat(quantity),
      meal: selectedMeal,
      id: Date.now()
    };
    
    setFoodItems([...foodItems, newFoodItem]);
    setSelectedFood(null);
    setQuantity('1');
  };

  const removeFoodItem = (id) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Add Food</h2>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Food Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full p-3 pl-10 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
              {filteredFoods.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredFoods.map((food) => (
                    <li 
                      key={food.id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 ${selectedFood?.id === food.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                      onClick={() => setSelectedFood(food)}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">{food.name}</span>
                        <span className="text-sm text-gray-500">{food.calories} cal</span>
                      </div>
                      <div className="flex justify-between mt-1 text-sm text-gray-500">
                        <span>P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g</span>
                        <span>{food.serving}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No foods found. Try a different search term.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Food Details and Add to Meal */}
        <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Add to Meal</h3>
          
          {selectedFood ? (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">{selectedFood.name}</h4>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>Calories: <span className="font-medium">{selectedFood.calories}</span></div>
                <div>Protein: <span className="font-medium">{selectedFood.protein}g</span></div>
                <div>Carbs: <span className="font-medium">{selectedFood.carbs}g</span></div>
                <div>Fat: <span className="font-medium">{selectedFood.fat}g</span></div>
              </div>
            </div>
          ) : (
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Select a food to see details
            </p>
          )}

          <div className="mb-4">
            <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              min="0.1"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="meal" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Meal
            </label>
            <select
              id="meal"
              value={selectedMeal}
              onChange={(e) => setSelectedMeal(e.target.value)}
              className="w-full p-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snacks">Snacks</option>
            </select>
          </div>

          <button
            onClick={handleAddFood}
            disabled={!selectedFood}
            className={`flex items-center justify-center w-full px-4 py-2 text-white rounded-lg ${selectedFood ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Add to {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)}
          </button>
        </div>
      </div>

      {/* Added Foods */}
      {foodItems.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Added Foods</h3>
          <div className="overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                    Food
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                    Meal
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                    Calories
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                    Protein
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                    Carbs
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                    Fat
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {foodItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.quantity} serving(s)</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap capitalize">
                      {item.meal}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {Math.round(item.calories * item.quantity)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {Math.round(item.protein * item.quantity * 10) / 10}g
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {Math.round(item.carbs * item.quantity * 10) / 10}g
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {Math.round(item.fat * item.quantity * 10) / 10}g
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <button
                        onClick={() => removeFoodItem(item.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white" colSpan="2">
                    Total
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {Math.round(foodItems.reduce((sum, item) => sum + (item.calories * item.quantity), 0))}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {Math.round(foodItems.reduce((sum, item) => sum + (item.protein * item.quantity), 0) * 10) / 10}g
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {Math.round(foodItems.reduce((sum, item) => sum + (item.carbs * item.quantity), 0) * 10) / 10}g
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {Math.round(foodItems.reduce((sum, item) => sum + (item.fat * item.quantity), 0) * 10) / 10}g
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <button className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Save All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFoodForm;
