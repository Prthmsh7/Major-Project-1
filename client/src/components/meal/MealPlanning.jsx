import { useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
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
  FiShoppingBag,
  FiZap
} from 'react-icons/fi';
import MealPlanCalendar from './MealPlanCalendar';
import RecipeSearch from './RecipeSearch';
import ShoppingList from './ShoppingList';
import MealPlanTemplates from './MealPlanTemplates';
import MealPlanAnalytics from './MealPlanAnalytics';
import GroceryList from './GroceryList';
import { generateMealPlan } from '../../utils/geminiAPI';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const sampleRecipes = [
  { id: 1, name: 'Oatmeal with Berries', calories: 300, protein: 10, carbs: 50, fat: 8, prepTime: 10 },
  { id: 2, name: 'Grilled Chicken Salad', calories: 450, protein: 35, carbs: 20, fat: 25, prepTime: 20 },
  { id: 3, name: 'Vegetable Stir Fry', calories: 350, protein: 12, carbs: 45, fat: 15, prepTime: 25 },
];

const MealPlanning = () => {
  const [searchQuery, setSearchQuery] = useState('');
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
  const [showAIGenerate, setShowAIGenerate] = useState(false);
  const [aiPreferences, setAiPreferences] = useState({
    preferences: [],
    dietaryRestrictions: [],
    customPrompt: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

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

  // Handle AI-generated meal plan
  const handleAIGenerate = async () => {
    try {
      console.log('Starting AI meal plan generation...');
      const preferences = aiPreferences.preferences.length > 0 ? aiPreferences.preferences : ['healthy', 'balanced'];
      const restrictions = aiPreferences.dietaryRestrictions.length > 0 ? aiPreferences.dietaryRestrictions : [];
      
      console.log('Preferences:', preferences);
      console.log('Restrictions:', restrictions);
      
      setIsGenerating(true);
      
      try {
        console.log('Calling generateMealPlan API...');
        const plan = await generateMealPlan(
          preferences,
          restrictions,
          mealTypes,
          1 // Start with 1 day for testing
        );
        
        console.log('API Response:', plan);

        // Process the generated plan and update the UI
        if (plan && plan.days) {
          console.log('Processing plan with days:', plan.days.length);
          const newSelectedRecipes = { ...selectedRecipes };
          
          plan.days.forEach(day => {
            console.log(`Processing day ${day.day} with ${day.meals?.length || 0} meals`);
            if (day.meals && Array.isArray(day.meals)) {
              day.meals.forEach(meal => {
                if (!meal || !meal.type) return;
                
                const dayName = days[day.day - 1];
                if (!dayName) {
                  console.error(`Invalid day index: ${day.day - 1}`);
                  return;
                }
                
                const key = `${dayName}-${meal.type}`;
                console.log(`Adding meal to ${key}:`, meal.recipe);
                
                if (!newSelectedRecipes[key]) {
                  newSelectedRecipes[key] = [];
                }
                
                newSelectedRecipes[key].push({
                  id: `${meal.recipe ? meal.recipe.replace(/\s+/g, '-').toLowerCase() : 'recipe'}-${Date.now()}`,
                  name: meal.recipe || 'Unnamed Recipe',
                  ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
                  instructions: meal.instructions || 'No instructions provided',
                  calories: meal.calories || 300,
                  protein: meal.protein || 20,
                  carbs: meal.carbs || 40,
                  fat: meal.fat || 10,
                  prepTime: meal.prepTime || 20
                });
              });
            }
          });
          
          console.log('Updating recipes with new plan');
          setSelectedRecipes(newSelectedRecipes);
          setShowAIGenerate(false);
        } else {
          console.error('Invalid plan format received:', plan);
          throw new Error('No valid meal plan was generated. Please try again.');
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        throw apiError; // Re-throw to be caught by the outer catch
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
      alert(`Failed to generate meal plan: ${error.message}`);
    } finally {
      setIsGenerating(false);
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
            {/* <button
              onClick={() => alert('AI feature is not available. Please configure the Gemini API key.')}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 whitespace-nowrap"
              title="AI meal plan generation (requires API key)"
            >
              <FiZap className="mr-2" /> AI Generate
            </button> */}
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
            <div className="flex gap-2">
              <button
                onClick={() => setShowRecipeSearch(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 whitespace-nowrap"
              >
                <FiPlus className="mr-2" /> Add Recipe
              </button>
              <button
                onClick={() => setShowAIGenerate(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 whitespace-nowrap"
              >
                <FiZap className="mr-2" /> Generate with AI
              </button>
            </div>
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

      {/* All Modals */}
      <AnimatePresence>
        {showRecipeSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RecipeSearch
              onSelectRecipe={handleAddRecipe}
              onClose={() => setShowRecipeSearch(false)}
            />
          </motion.div>
        )}
        {showShoppingList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ShoppingList
              recipes={getAllRecipes}
              onClose={() => setShowShoppingList(false)}
            />
          </motion.div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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
          </motion.div>
        )}

        {/* AI Generate Modal */}
        {showAIGenerate && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden"
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Meal Plan Generator</h3>
                <button
                  onClick={() => setShowAIGenerate(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Generate Meal Plan with AI</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Preferences (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={aiPreferences.preferences.join(', ')}
                        onChange={(e) => setAiPreferences({
                          ...aiPreferences,
                          preferences: e.target.value.split(',').map(p => p.trim()).filter(Boolean)
                        })}
                        placeholder="e.g., vegetarian, high-protein, quick"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Dietary Restrictions (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={aiPreferences.dietaryRestrictions.join(', ')}
                        onChange={(e) => setAiPreferences({
                          ...aiPreferences,
                          dietaryRestrictions: e.target.value.split(',').map(r => r.trim()).filter(Boolean)
                        })}
                        placeholder="e.g., gluten-free, dairy-free, nut-free"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Custom Instructions (optional)
                      </label>
                      <textarea
                        value={aiPreferences.customPrompt}
                        onChange={(e) => setAiPreferences({
                          ...aiPreferences,
                          customPrompt: e.target.value
                        })}
                        placeholder="Any specific instructions for the AI..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAIGenerate(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md ${isGenerating ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} flex items-center`}
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FiZap className="mr-2 h-4 w-4" />
                        Generate Plan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Meal Plan Templates Modal */}
        {showTemplates && (
          <MealPlanTemplates
            isOpen={showTemplates}
            onClose={() => setShowTemplates(false)}
            onApplyTemplate={applyTemplate}
            selectedRecipes={selectedRecipes}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MealPlanning;
