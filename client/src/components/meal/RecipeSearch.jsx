import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX, FiClock, FiZap, FiDroplet } from 'react-icons/fi';

const sampleRecipes = [
  { 
    id: 1, 
    name: 'Oatmeal with Berries', 
    calories: 300, 
    protein: 10, 
    carbs: 50, 
    fat: 8, 
    prepTime: 10,
    tags: ['breakfast', 'quick', 'vegetarian'],
    ingredients: ['oats', 'mixed berries', 'honey', 'almond milk']
  },
  { 
    id: 2, 
    name: 'Grilled Chicken Salad', 
    calories: 450, 
    protein: 35, 
    carbs: 20, 
    fat: 25, 
    prepTime: 20,
    tags: ['lunch', 'high-protein', 'low-carb'],
    ingredients: ['chicken breast', 'mixed greens', 'cherry tomatoes', 'cucumber', 'olive oil']
  },
  { 
    id: 3, 
    name: 'Vegetable Stir Fry', 
    calories: 350, 
    protein: 12, 
    carbs: 45, 
    fat: 15, 
    prepTime: 25,
    tags: ['dinner', 'vegetarian', 'vegan'],
    ingredients: ['broccoli', 'bell peppers', 'carrots', 'tofu', 'soy sauce']
  },
  { 
    id: 4, 
    name: 'Protein Smoothie', 
    calories: 250, 
    protein: 25, 
    carbs: 30, 
    fat: 5, 
    prepTime: 5,
    tags: ['snack', 'quick', 'high-protein', 'post-workout'],
    ingredients: ['protein powder', 'banana', 'spinach', 'almond butter', 'almond milk']
  },
  { 
    id: 5, 
    name: 'Avocado Toast', 
    calories: 320, 
    protein: 8, 
    carbs: 35, 
    fat: 18, 
    prepTime: 10,
    tags: ['breakfast', 'vegetarian', 'quick'],
    ingredients: ['whole grain bread', 'avocado', 'eggs', 'red pepper flakes']
  },
  { 
    id: 6, 
    name: 'Quinoa Bowl', 
    calories: 400, 
    protein: 15, 
    carbs: 60, 
    fat: 12, 
    prepTime: 30,
    tags: ['lunch', 'vegan', 'high-fiber'],
    ingredients: ['quinoa', 'chickpeas', 'cucumber', 'cherry tomatoes', 'lemon tahini dressing']
  }
];

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
const dietaryOptions = ['Vegetarian', 'Vegan', 'High-Protein', 'Low-Carb', 'Quick Meals'];

export default function RecipeSearch({ onSelectRecipe, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    mealType: [],
    dietary: [],
    maxPrepTime: 60,
    maxCalories: 1000
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState(sampleRecipes);

  useEffect(() => {
    const results = sampleRecipes.filter(recipe => {
      // Search term filter
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Meal type filter
      const matchesMealType = filters.mealType.length === 0 || 
        filters.mealType.some(type => recipe.tags.some(tag => tag === type.toLowerCase()));
      
      // Dietary filter
      const matchesDietary = filters.dietary.length === 0 ||
        filters.dietary.some(diet => {
          const dietLower = diet.toLowerCase();
          if (dietLower === 'vegetarian') return recipe.tags.includes('vegetarian');
          if (dietLower === 'vegan') return recipe.tags.includes('vegan');
          if (dietLower === 'high-protein') return recipe.protein >= 20;
          if (dietLower === 'low-carb') return recipe.carbs <= 30;
          if (dietLower === 'quick meals') return recipe.prepTime <= 15;
          return true;
        });
      
      // Prep time filter
      const matchesPrepTime = recipe.prepTime <= filters.maxPrepTime;
      
      // Calories filter
      const matchesCalories = recipe.calories <= filters.maxCalories;
      
      return matchesSearch && matchesMealType && matchesDietary && matchesPrepTime && matchesCalories;
    });
    
    setFilteredRecipes(results);
  }, [searchTerm, filters]);

  const toggleFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      mealType: [],
      dietary: [],
      maxPrepTime: 60,
      maxCalories: 1000
    });
    setSearchTerm('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Search Recipes</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search recipes or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1 rounded-full ${filters.mealType.length > 0 || filters.dietary.length > 0 ? 'text-blue-500' : 'text-gray-400'} hover:text-blue-500`}
                title="Filters"
              >
                <FiFilter className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700 dark:text-gray-200">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear all
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meal Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {mealTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => toggleFilter('mealType', type.toLowerCase())}
                        className={`px-3 py-1 rounded-full text-sm ${
                          filters.mealType.includes(type.toLowerCase())
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dietary</h4>
                  <div className="flex flex-wrap gap-2">
                    {dietaryOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => toggleFilter('dietary', option.toLowerCase())}
                        className={`px-3 py-1 rounded-full text-sm ${
                          filters.dietary.includes(option.toLowerCase())
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Prep Time: {filters.maxPrepTime} min
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="120"
                      step="5"
                      value={filters.maxPrepTime}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrepTime: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Calories: {filters.maxCalories}
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="50"
                      value={filters.maxCalories}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxCalories: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-8">
              <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No recipes found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map(recipe => (
                <div 
                  key={recipe.id} 
                  className="group relative bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => onSelectRecipe(recipe)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{recipe.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {recipe.calories} cal
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                      {recipe.prepTime} min • 
                      <FiZap className="ml-2 mr-1 h-4 w-4 text-yellow-500" />
                      {recipe.protein}g protein • 
                      <FiDroplet className="ml-2 mr-1 h-4 w-4 text-red-500" />
                      {recipe.carbs}g carbs
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {recipe.tags.slice(0, 3).map(tag => (
                        <span 
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Ingredients
                      </h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {recipe.ingredients.join(', ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
