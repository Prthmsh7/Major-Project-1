import { useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, 
  FiPlus, 
  FiTrash2, 
  FiClock, 
  FiSearch, 
  FiShoppingCart, 
  FiShare2, 
  FiMail, 
  FiLink, 
  FiCopy,
  FiCheck,
  FiX,
  FiSave,
  FiFolder,
  FiGrid,
  FiList,
  FiPieChart,
  FiTrendingUp,
  FiShoppingBag
} from 'react-icons/fi';
import MealPlanCalendar from './MealPlanCalendar';
import RecipeSearch from './RecipeSearch';
import ShoppingList from './ShoppingList';
import MealPlanTemplates from './MealPlanTemplates';
import MealPlanAnalytics from './MealPlanAnalytics';
import GroceryList from './GroceryList';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const sampleRecipes = [
  { id: 1, name: 'Oatmeal with Berries', calories: 300, protein: 10, carbs: 50, fat: 8, prepTime: 10 },
  { id: 2, name: 'Grilled Chicken Salad', calories: 450, protein: 35, carbs: 20, fat: 25, prepTime: 20 },
  { id: 3, name: 'Vegetable Stir Fry', calories: 350, protein: 12, carbs: 45, fat: 15, prepTime: 25 },
];

const MealPlanning = () => {
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [selectedMealType, setSelectedMealType] = useState(mealTypes[0]);
  const [showRecipeSearch, setShowRecipeSearch] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [shareMethod, setShareMethod] = useState('link'); // 'link' or 'email'
  const [email, setEmail] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState('meals'); // 'meals' or 'analytics'
  const [showGroceryList, setShowGroceryList] = useState(false);
  const shareLinkRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    mealType: [],
    dietary: []
  });

  const handleAddRecipe = useCallback((recipe) => {
    const key = `${selectedDay}-${selectedMealType}`;
    setSelectedRecipes(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), {
        ...recipe,
        id: `${recipe.id}-${Date.now()}` // Ensure unique ID for each instance
      }]
    }));
    setShowRecipeSearch(false);
  }, [selectedDay, selectedMealType]);

  // Apply template to current plan
  // Apply template to current plan
  const applyTemplate = useCallback((templateRecipes) => {
    setSelectedRecipes(templateRecipes);
  }, []);

  // Handle day selection from calendar
  const handleDaySelect = (day) => {
    const dayName = format(day, 'EEEE');
    setSelectedDay(dayName);
  };

  // Handle recipe removal from calendar
  const handleRecipeRemove = (day, mealType, recipeId) => {
    const key = `${format(new Date(day), 'EEEE')}-${mealType}`;
    setSelectedRecipes(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter(recipe => recipe.id !== recipeId)
    }));
  };

  const removeRecipe = (day, mealType, recipeId) => {
    const key = `${day}-${mealType}`;
    setSelectedRecipes(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter(recipe => recipe.id !== recipeId)
    }));
  };

  const handleMealTypeClick = (mealType) => {
    setSelectedMealType(mealType);
    setShowRecipeSearch(true);
  };

  const getMealNutrition = (day, mealType) => {
    const key = `${day}-${mealType}`;
    const meals = selectedRecipes[key] || [];
    return meals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const getDayNutrition = (day) => {
    return mealTypes.reduce((acc, mealType) => {
      const nutrition = getMealNutrition(day, mealType);
      return {
        calories: acc.calories + nutrition.calories,
        protein: acc.protein + nutrition.protein,
        carbs: acc.carbs + nutrition.carbs,
        fat: acc.fat + nutrition.fat,
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  // Get all recipes for the shopping list
  const getAllRecipes = useMemo(() => {
    const allRecipes = [];
    Object.values(selectedRecipes).forEach(recipes => {
      allRecipes.push(...recipes);
    });
    return allRecipes;
  }, [selectedRecipes]);

  // Generate shareable link
  const generateShareLink = useCallback(() => {
    const baseUrl = window.location.origin + '/share/meal-plan';
    const planData = {
      recipes: selectedRecipes,
      date: new Date().toISOString(),
      // Add any other relevant data
    };
    const encodedData = btoa(JSON.stringify(planData));
    return `${baseUrl}?data=${encodedData}`;
  }, [selectedRecipes]);

  // Copy share link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareLink());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Share via email
  const shareViaEmail = async () => {
    if (!email) return;
    
    setIsSharing(true);
    try {
      // In a real app, you would call your backend API to send the email
      console.log('Sharing meal plan with:', email);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShareSuccess(true);
      setEmail('');
      setTimeout(() => {
        setShareSuccess(false);
        setShowShareModal(false);
      }, 2000);
    } catch (error) {
      console.error('Error sharing meal plan:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meal Planning</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Plan your meals for the week and track your nutrition
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 md:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search your meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm"
              title={showCalendar ? 'Switch to list view' : 'Switch to calendar view'}
            >
              {showCalendar ? <FiList className="mr-2" /> : <FiCalendar className="mr-2" />}
              {showCalendar ? 'List View' : 'Calendar View'}
            </button>
            <button
              onClick={() => setShowShoppingList(true)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 whitespace-nowrap"
              disabled={Object.keys(selectedRecipes).length === 0}
              title={Object.keys(selectedRecipes).length === 0 ? 'Add recipes to see shopping list' : 'View shopping list'}
            >
              <FiShoppingCart className="mr-2" /> Shopping List
            </button>
            <button
              onClick={() => setShowGroceryList(true)}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 whitespace-nowrap"
              title="Generate grocery list"
            >
              <FiShoppingBag className="mr-2" /> Grocery List
            </button>
            <button
              onClick={() => setShowTemplates(true)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 whitespace-nowrap"
              title="Load or save meal plan templates"
            >
              <FiFolder className="mr-2" /> Templates
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 whitespace-nowrap"
              disabled={Object.keys(selectedRecipes).length === 0}
              title={Object.keys(selectedRecipes).length === 0 ? 'Add recipes to share your plan' : 'Share meal plan'}
            >
              <FiShare2 className="mr-2" /> Share
            </button>
            <button 
              onClick={() => setShowRecipeSearch(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 whitespace-nowrap"
            >
              <FiPlus className="mr-2" /> Add Recipe
            </button>
            <button
              onClick={() => setActiveTab(activeTab === 'meals' ? 'analytics' : 'meals')}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 whitespace-nowrap"
              title={activeTab === 'meals' ? 'View Analytics' : 'View Meals'}
            >
              {activeTab === 'meals' ? (
                <>
                  <FiTrendingUp className="mr-2" /> Analytics
                </>
              ) : (
                <>
                  <FiList className="mr-2" /> View Meals
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <MealPlanAnalytics 
          selectedRecipes={selectedRecipes} 
          days={days} 
          mealTypes={mealTypes} 
        />
      ) : showCalendar ? (
        <MealPlanCalendar
          selectedRecipes={selectedRecipes}
          selectedDay={new Date()}
          onSelectDay={handleDaySelect}
          onDayChange={handleDaySelect}
          onRecipeRemove={handleRecipeRemove}
          className="mb-6"
        />
      ) : (
        <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {days.map((day) => {
            const dayNutrition = getDayNutrition(day);
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg transition-colors text-left min-w-[120px] ${
                  isSelected
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <div className="font-medium">{day}</div>
                {dayNutrition.calories > 0 && (
                  <div className="text-xs mt-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Cal:</span>
                      <span className="font-medium">{dayNutrition.calories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">P:</span>
                      <span>{dayNutrition.protein}g</span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      )}
      
      {activeTab === 'meals' && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mealTypes.map((mealType) => {
          const mealNutrition = getMealNutrition(selectedDay, mealType);
          return (
            <motion.div
              key={mealType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col h-full"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900 dark:text-white">{mealType}</h3>
                <div className="flex items-center space-x-2">
                  {mealNutrition.calories > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">
                      {mealNutrition.calories} cal
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedMealType(mealType);
                      setShowRecipeSearch(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    title={`Add to ${mealType}`}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 flex-1">
              {selectedRecipes[`${selectedDay}-${mealType}`]?.filter(recipe => 
                recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (recipe.ingredients && recipe.ingredients.some(ing => 
                  ing.toLowerCase().includes(searchQuery.toLowerCase())
                ))
              ).map((recipe) => (
                <motion.div 
                  key={recipe.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="group relative p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="pr-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">{recipe.name}</h4>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-2">
                        {recipe.prepTime && (
                          <span className="flex items-center">
                            <FiClock className="mr-1" />
                            {recipe.prepTime} min
                          </span>
                        )}
                        {recipe.calories && (
                          <span>{recipe.calories} cal</span>
                        )}
                      </div>
                      {recipe.ingredients && recipe.ingredients.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ingredients:</div>
                          <div className="flex flex-wrap gap-1">
                            {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                              <span key={idx} className="inline-block bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs px-2 py-0.5 rounded">
                                {ingredient}
                              </span>
                            ))}
                            {recipe.ingredients.length > 3 && (
                              <span className="text-xs text-gray-400">+{recipe.ingredients.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecipe(selectedDay, mealType, recipe.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 -mt-1 -mr-1"
                      title="Remove recipe"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
              
              {(!selectedRecipes[`${selectedDay}-${mealType}`] || selectedRecipes[`${selectedDay}-${mealType}`].length === 0) && (
                <motion.div 
                  className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleMealTypeClick(mealType)}
                >
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">No meals added</p>
                    <button
                      className="mt-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center justify-center w-full"
                    >
                      <FiPlus className="mr-1" /> Add meal
                    </button>
                  </div>
                </motion.div>
              )}
              </div>
              
              {mealNutrition.calories > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-gray-500 dark:text-gray-400">Calories</div>
                  <div className="text-right font-medium">{mealNutrition.calories} <span className="text-gray-400">cal</span></div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Protein</div>
                  <div className="text-right">{mealNutrition.protein}g</div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Carbs</div>
                  <div className="text-right">{mealNutrition.carbs}g</div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Fat</div>
                  <div className="text-right">{mealNutrition.fat}g</div>
                </div>
              </div>
            )}
          </motion.div>
        )})}
      </div>
      )}

      {/* Recipe Search Modal */}
      <AnimatePresence>
        {showRecipeSearch && (
          <RecipeSearch 
            onSelectRecipe={handleAddRecipe}
            onClose={() => setShowRecipeSearch(false)}
          />
        )}
        {showShoppingList && (
          <ShoppingList 
            recipes={getAllRecipes}
            onClose={() => setShowShoppingList(false)}
          />
        )}
        
        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden"
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Share Meal Plan</h3>
                  <button
                    onClick={() => {
                      setShowShareModal(false);
                      setShareSuccess(false);
                    }}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                
                {shareSuccess ? (
                  <div className="p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                      <FiCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Shared successfully!</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Your meal plan has been {shareMethod === 'email' ? 'shared via email' : 'link copied to clipboard'}.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="p-6">
                      <div className="flex rounded-md shadow-sm mb-6">
                        <button
                          onClick={() => setShareMethod('link')}
                          className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md ${
                            shareMethod === 'link' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <FiLink className="inline mr-2" /> Copy Link
                        </button>
                        <button
                          onClick={() => setShareMethod('email')}
                          className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md ${
                            shareMethod === 'email' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <FiMail className="inline mr-2" /> Email
                        </button>
                      </div>

                      {shareMethod === 'link' ? (
                        <div>
                          <label htmlFor="share-link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Shareable Link
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                ref={shareLinkRef}
                                readOnly
                                value={generateShareLink()}
                                className="block w-full rounded-l-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm py-2 px-3 truncate"
                              />
                            </div>
                            <button
                              onClick={copyToClipboard}
                              className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                            >
                              {isCopied ? (
                                <>
                                  <FiCheck className="h-4 w-4 mr-1.5 text-green-600 dark:text-green-400" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <FiCopy className="h-4 w-4 mr-1.5" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email address
                          </label>
                          <div className="mt-1">
                            <input
                              type="email"
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                              placeholder="name@example.com"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowShareModal(false);
                          setEmail('');
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={shareMethod === 'email' ? shareViaEmail : copyToClipboard}
                        disabled={shareMethod === 'email' && !email}
                        className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          (shareMethod === 'email' && !email) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSharing ? (
                          'Sharing...'
                        ) : shareMethod === 'email' ? (
                          'Send Email'
                        ) : (
                          'Copy Link'
                        )}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Meal Plan Templates Modal */}
        <MealPlanTemplates
          isOpen={showTemplates}
          onClose={() => setShowTemplates(false)}
          onApplyTemplate={applyTemplate}
          selectedRecipes={selectedRecipes}
        />
      </AnimatePresence>
    </div>
  );
};

export default MealPlanning;
