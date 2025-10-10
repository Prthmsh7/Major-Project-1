import { useState, useMemo, useEffect } from 'react';
import { FiShoppingCart, FiCheck, FiPrinter, FiX, FiPlus, FiMinus, FiSave, FiFolder, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Sample ingredient categories for organization
const INGREDIENT_CATEGORIES = {
  produce: 'Produce',
  dairy: 'Dairy',
  meat: 'Meat & Seafood',
  pantry: 'Pantry',
  bakery: 'Bakery',
  frozen: 'Frozen',
  other: 'Other'
};

// Helper function to categorize ingredients
const categorizeIngredient = (ingredient) => {
  const lowerIngredient = ingredient.toLowerCase();
  
  if (/(apple|banana|lettuce|tomato|onion|garlic|carrot|pepper|spinach|kale|broccoli)/.test(lowerIngredient)) {
    return 'produce';
  } else if (/(milk|cheese|yogurt|butter|cream|egg)/.test(lowerIngredient)) {
    return 'dairy';
  } else if (/(chicken|beef|pork|fish|salmon|shrimp|meat|bacon)/.test(lowerIngredient)) {
    return 'meat';
  } else if (/(flour|sugar|rice|pasta|oil|vinegar|spice|herb|nut|seed)/.test(lowerIngredient)) {
    return 'pantry';
  } else if (/(bread|tortilla|bagel|muffin|cracker)/.test(lowerIngredient)) {
    return 'bakery';
  } else if (/(frozen)/.test(lowerIngredient)) {
    return 'frozen';
  }
  return 'other';
};

const ShoppingList = ({ recipes, onClose }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [customItems, setCustomItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [savedLists, setSavedLists] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [listName, setListName] = useState('');
  const [showSavedLists, setShowSavedLists] = useState(false);

  // Process all ingredients from recipes
  const ingredientsByCategory = useMemo(() => {
    const allIngredients = {};
    
    // Process recipe ingredients
    recipes.forEach(recipe => {
      if (!recipe.ingredients) return;
      
      recipe.ingredients.forEach(ingredient => {
        const trimmedIngredient = ingredient.trim();
        if (!trimmedIngredient) return;
        
        const category = categorizeIngredient(trimmedIngredient);
        if (!allIngredients[category]) {
          allIngredients[category] = [];
        }
        
        // Check if ingredient already exists in this category
        if (!allIngredients[category].includes(trimmedIngredient)) {
          allIngredients[category].push(trimmedIngredient);
        }
      });
    });
    
    // Process custom items
    customItems.forEach(item => {
      const category = categorizeIngredient(item.text);
      if (!allIngredients[category]) {
        allIngredients[category] = [];
      }
      if (!allIngredients[category].includes(item.text)) {
        allIngredients[category].push(item.text);
      }
    });
    
    return allIngredients;
  }, [recipes, customItems]);

  const toggleItem = (ingredient) => {
    setCheckedItems(prev => ({
      ...prev,
      [ingredient]: !prev[ingredient]
    }));
  };

  const addCustomItem = () => {
    if (newItem.trim()) {
      setCustomItems(prev => [
        ...prev, 
        { id: Date.now(), text: newItem.trim(), isCustom: true }
      ]);
      setNewItem('');
      setIsAddingItem(false);
    }
  };

  const removeCustomItem = (id) => {
    setCustomItems(prev => prev.filter(item => item.id !== id));
  };

  const printList = () => {
    window.print();
  };

  const clearChecked = () => {
    setCheckedItems({});
  };

  // Load saved lists from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedShoppingLists') || '[]');
    setSavedLists(saved);
  }, []);

  const saveCurrentList = () => {
    if (!listName.trim()) return;
    
    const listToSave = {
      id: Date.now(),
      name: listName.trim(),
      date: new Date().toLocaleDateString(),
      items: {
        ...ingredientsByCategory,
        custom: customItems.filter(item => item.isCustom).map(item => item.text)
      },
      checkedItems: { ...checkedItems }
    };

    const updatedLists = [...savedLists, listToSave];
    localStorage.setItem('savedShoppingLists', JSON.stringify(updatedLists));
    setSavedLists(updatedLists);
    setListName('');
    setShowSaveModal(false);
  };

  const loadSavedList = (list) => {
    // Merge items from the saved list with current items
    const mergedCustomItems = [
      ...customItems,
      ...(list.items.custom || []).map(text => ({
        id: Date.now() + Math.random(),
        text,
        isCustom: true
      }))
    ];
    
    setCustomItems(mergedCustomItems);
    setCheckedItems(list.checkedItems || {});
    setShowSavedLists(false);
  };

  const deleteSavedList = (id, e) => {
    e.stopPropagation();
    const updatedLists = savedLists.filter(list => list.id !== id);
    localStorage.setItem('savedShoppingLists', JSON.stringify(updatedLists));
    setSavedLists(updatedLists);
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <FiShoppingCart className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Shopping List</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={printList}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Print list"
            >
              <FiPrinter className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(INGREDIENT_CATEGORIES).map(([key, category]) => {
            const ingredients = ingredientsByCategory[key] || [];
            if (ingredients.length === 0) return null;
            
            return (
              <div key={key} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {category}
                </h3>
                <ul className="space-y-1">
                  {ingredients.map((ingredient, idx) => (
                    <motion.li 
                      key={`${key}-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center group"
                    >
                      <button
                        onClick={() => toggleItem(ingredient)}
                        className={`flex-1 flex items-center p-2 rounded-lg transition-colors ${
                          checkedItems[ingredient] 
                            ? 'bg-green-50 dark:bg-green-900/20 text-gray-500 line-through' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center mr-3 ${
                          checkedItems[ingredient] 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {checkedItems[ingredient] && <FiCheck className="h-3 w-3" />}
                        </div>
                        <span className="text-left">{ingredient}</span>
                      </button>
                      {customItems.some(item => item.text === ingredient) && (
                        <button
                          onClick={() => removeCustomItem(customItems.find(item => item.text === ingredient)?.id)}
                          className="ml-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove item"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </div>
            );
          })}
          
          {Object.keys(ingredientsByCategory).length === 0 && (
            <div className="text-center py-8">
              <FiShoppingCart className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No items in your shopping list</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Add recipes to your meal plan to see ingredients here
              </p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {isAddingItem ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomItem()}
                placeholder="Add custom item..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                autoFocus
              />
              <button
                onClick={addCustomItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Add
              </button>
              <button
                onClick={() => setIsAddingItem(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <button
                onClick={() => setIsAddingItem(true)}
                className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <FiPlus className="mr-1 h-4 w-4" />
                Add custom item
              </button>
              <button
                onClick={clearChecked}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear checked items
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShoppingList;
