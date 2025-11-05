import { useState, useMemo, useEffect } from 'react';
import { 
  FiShoppingCart, 
  FiCheck, 
  FiPrinter, 
  FiX, 
  FiPlus, 
  FiMinus, 
  FiSave, 
  FiFolder, 
  FiTrash2,
  FiPackage,
  FiEdit2,
  FiClock,
  FiCheckCircle,
  FiShoppingBag,
  FiDroplet,
  FiCoffee,
  FiMeh,
  FiPlusCircle,
  FiSquare,
  FiCheckSquare
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantry } from '@/context/PantryContext';

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
  const { pantryItems, addPantryItem } = usePantry();
  const [checkedItems, setCheckedItems] = useState({});
  const [customItems, setCustomItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, unit: 'pcs' });
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [savedLists, setSavedLists] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [listName, setListName] = useState('');
  const [showSavedLists, setShowSavedLists] = useState(false);
  const [showPantryAdd, setShowPantryAdd] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Add item to pantry
  const handleAddToPantry = (ingredient) => {
    addPantryItem({
      id: Date.now().toString(),
      name: ingredient.name,
      quantity: ingredient.quantity || 1,
      unit: ingredient.unit || 'pcs'
    });
    
    // Update checked items to show it's been added
    setCheckedItems(prev => ({
      ...prev,
      [ingredient.id]: true
    }));
  };

  // Process all ingredients from recipes
  const ingredientsByCategory = useMemo(() => {
    const allIngredients = {};
    
    // Process recipe ingredients
    recipes.forEach(recipe => {
      if (!recipe.ingredients) return;
      
      recipe.ingredients.forEach(ingredient => {
        // Handle both string and object ingredients
        const ingredientObj = typeof ingredient === 'string' 
          ? { id: ingredient.trim().toLowerCase().replace(/\s+/g, '-'), name: ingredient.trim() }
          : { 
              id: ingredient.id || (ingredient.name || '').toLowerCase().replace(/\s+/g, '-'),
              name: ingredient.name || '',
              quantity: ingredient.quantity,
              unit: ingredient.unit || 'pcs'
            };
            
        if (!ingredientObj.name) return;
        
        const category = categorizeIngredient(ingredientObj.name);
        if (!allIngredients[category]) {
          allIngredients[category] = [];
        }
        
        // Check if ingredient already exists in this category
        const exists = allIngredients[category].some(item => 
          item.name.toLowerCase() === ingredientObj.name.toLowerCase()
        );
        
        if (!exists) {
          allIngredients[category].push(ingredientObj);
        }
      });
    });
    
    // Process custom items
    customItems.forEach(item => {
      const ingredientObj = {
        id: item.id || item.text.toLowerCase().replace(/\s+/g, '-'),
        name: item.text,
        quantity: item.quantity,
        unit: item.unit || 'pcs'
      };
      
      const category = categorizeIngredient(ingredientObj.name);
      if (!allIngredients[category]) {
        allIngredients[category] = [];
      }
      
      const exists = allIngredients[category].some(i => 
        i.name.toLowerCase() === ingredientObj.name.toLowerCase()
      );
      
      if (!exists) {
        allIngredients[category].push(ingredientObj);
      }
    });
    
    return allIngredients;
  }, [recipes, customItems]);

  const toggleItem = (ingredient) => {
    setCheckedItems(prev => ({
      ...prev,
      [ingredient.id]: !prev[ingredient.id]
    }));
  };

  const handleAddCustomItem = () => {
    if (newItem.name.trim()) {
      setCustomItems([...customItems, { 
        id: Date.now().toString(), 
        name: newItem.name, 
        quantity: newItem.quantity || 1,
        unit: newItem.unit || 'pcs',
        checked: false 
      }]);
      setNewItem({ name: '', quantity: 1, unit: 'pcs' });
      setIsAddingItem(false);
    }
  };

  // Check if an item is in the pantry
  const isInPantry = (ingredient) => {
    if (!ingredient) return false;
    
    // Handle both string and object ingredients
    const ingredientName = typeof ingredient === 'string' 
      ? ingredient.toLowerCase().trim() 
      : (ingredient.name || '').toLowerCase().trim();
      
    return pantryItems.some(item => 
      item.name.toLowerCase() === ingredientName &&
      (ingredient.quantity ? item.quantity >= ingredient.quantity : true)
    );
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
        custom: customItems.filter(item => item.checked).map(item => item.name)
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
        name: text,
        quantity: 1,
        unit: 'pcs',
        checked: false
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
              <div className="flex items-center gap-2">
                <FiPrinter className="h-5 w-5" />
              </div>
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
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Shopping List</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowSavedLists(!showSavedLists)}
                className="p-1 text-blue-500 hover:text-blue-700"
                title="Saved Lists"
              >
                <FiFolder />
              </button>
              <button 
                onClick={() => setShowPantryAdd(!showPantryAdd)}
                className="p-1 text-green-500 hover:text-green-700"
                title="Show/Hide Pantry"
              >
                <FiPackage />
              </button>
            </div>
          </div>
          {showPantryAdd && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium mb-2">Add to Pantry</h3>
              {selectedItem ? (
                <div className="flex items-center gap-2">
                  <span>{selectedItem.name} - {selectedItem.quantity} {selectedItem.unit}</span>
                  <button 
                    onClick={() => {
                      handleAddToPantry(selectedItem);
                      setSelectedItem(null);
                    }}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  >
                    Add to Pantry
                  </button>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select an item below to add it to your pantry
                </p>
              )}
            </div>
          )}
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
                      <div
                        key={`${category}-${idx}`}
                        className={`flex items-center p-2 rounded cursor-pointer ${
                          checkedItems[ingredient.id] 
                            ? 'bg-green-50 dark:bg-green-900/20' 
                            : isInPantry(ingredient) 
                              ? 'bg-blue-50 dark:bg-blue-900/20' 
                              : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => !checkedItems[ingredient.id] && setSelectedItem(ingredient)}
                      >
                        <div className="flex-1 flex items-center justify-between">
                          <div className="flex items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItem(ingredient);
                              }}
                              className="mr-2 text-gray-400 hover:text-blue-500 focus:outline-none"
                              aria-label={checkedItems[ingredient.id] ? 'Uncheck item' : 'Check item'}
                            >
                              {checkedItems[ingredient.id] ? (
                                <FiCheckSquare className="h-5 w-5 text-green-500" />
                              ) : (
                                <FiSquare className="h-5 w-5" />
                              )}
                            </button>
                            <span className={checkedItems[ingredient.id] ? 'line-through text-gray-500' : ''}>
                              {ingredient.name}
                              {ingredient.quantity && ` (${ingredient.quantity} ${ingredient.unit || 'pcs'})`}
                            </span>
                            {isInPantry(ingredient) && !checkedItems[ingredient.id] && (
                              <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                In Pantry
                              </span>
                            )}
                          </div>
                          {!checkedItems[ingredient.id] && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItem(ingredient);
                              }}
                              className="ml-2 p-1 text-gray-400 hover:text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Mark as done"
                            >
                              <FiCheck className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      {customItems.some(item => item.id === ingredient.id) && (
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
