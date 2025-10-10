import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheck, 
  FiPlus, 
  FiTrash2, 
  FiShoppingBag, 
  FiPrinter, 
  FiSave, 
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiPackage
} from 'react-icons/fi';

// Sample ingredient categories
const CATEGORIES = [
  'Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Bakery',
  'Pantry', 'Frozen', 'Beverages', 'Household', 'Other'
];

// Sample ingredient database (in a real app, this would be more comprehensive)
const INGREDIENT_DB = {
  // Produce
  'apple': { category: 'Produce', unit: 'pcs' },
  'banana': { category: 'Produce', unit: 'pcs' },
  'carrot': { category: 'Produce', unit: 'pcs' },
  'lettuce': { category: 'Produce', unit: 'head' },
  'tomato': { category: 'Produce', unit: 'pcs' },
  'onion': { category: 'Produce', unit: 'pcs' },
  'garlic': { category: 'Produce', unit: 'clove' },
  'potato': { category: 'Produce', unit: 'pcs' },
  'broccoli': { category: 'Produce', unit: 'head' },
  'spinach': { category: 'Produce', unit: 'bunch' },
  
  // Dairy & Eggs
  'milk': { category: 'Dairy & Eggs', unit: 'ml' },
  'cheese': { category: 'Dairy & Eggs', unit: 'g' },
  'yogurt': { category: 'Dairy & Eggs', unit: 'g' },
  'egg': { category: 'Dairy & Eggs', unit: 'pcs' },
  'butter': { category: 'Dairy & Eggs', unit: 'g' },
  
  // Meat & Seafood
  'chicken': { category: 'Meat & Seafood', unit: 'g' },
  'beef': { category: 'Meat & Seafood', unit: 'g' },
  'fish': { category: 'Meat & Seafood', unit: 'g' },
  'shrimp': { category: 'Meat & Seafood', unit: 'g' },
  'bacon': { category: 'Meat & Seafood', unit: 'slices' },
  
  // Pantry
  'rice': { category: 'Pantry', unit: 'g' },
  'pasta': { category: 'Pantry', unit: 'g' },
  'flour': { category: 'Pantry', unit: 'g' },
  'sugar': { category: 'Pantry', unit: 'g' },
  'oil': { category: 'Pantry', unit: 'ml' },
  'salt': { category: 'Pantry', unit: 'g' },
  'pepper': { category: 'Pantry', unit: 'g' },
  
  // Add more ingredients as needed
};

const GroceryList = ({ recipes = [], onClose }) => {
  const [items, setItems] = useState([]);
  const [customItem, setCustomItem] = useState('');
  const [customCategory, setCustomCategory] = useState('Other');
  const [customQuantity, setCustomQuantity] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [savedLists, setSavedLists] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [listName, setListName] = useState('My Shopping List');
  const [isSaving, setIsSaving] = useState(false);

  // Generate grocery list from recipes
  useEffect(() => {
    if (recipes.length > 0) {
      const recipeIngredients = recipes.flatMap(recipe => 
        (recipe.ingredients || []).map(ingredient => {
          const name = ingredient.name.toLowerCase();
          const info = INGREDIENT_DB[name] || { category: 'Other', unit: 'pcs' };
          return {
            id: `${recipe.id}-${ingredient.name}-${Date.now()}`,
            name: ingredient.name,
            quantity: ingredient.quantity || 1,
            unit: ingredient.unit || info.unit,
            category: info.category,
            checked: false,
            fromRecipe: recipe.name
          };
        })
      );
      
      // Group and combine ingredients
      const combinedItems = [];
      const itemMap = new Map();
      
      recipeIngredients.forEach(item => {
        const key = `${item.name}-${item.unit}-${item.category}`.toLowerCase();
        if (itemMap.has(key)) {
          const existing = itemMap.get(key);
          existing.quantity += item.quantity;
          if (item.fromRecipe && !existing.fromRecipes.includes(item.fromRecipe)) {
            existing.fromRecipes.push(item.fromRecipe);
          }
        } else {
          itemMap.set(key, {
            ...item,
            fromRecipes: item.fromRecipe ? [item.fromRecipe] : []
          });
        }
      });
      
      setItems(Array.from(itemMap.values()));
    }
  }, [recipes]);

  // Toggle item checked state
  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  // Add custom item to the list
  const addCustomItem = () => {
    if (!customItem.trim()) return;
    
    const newItem = {
      id: `custom-${Date.now()}`,
      name: customItem.trim(),
      quantity: parseFloat(customQuantity) || 1,
      unit: INGREDIENT_DB[customItem.toLowerCase()]?.unit || 'pcs',
      category: customCategory,
      checked: false,
      isCustom: true
    };
    
    setItems([...items, newItem]);
    setCustomItem('');
    setCustomQuantity('');
    setCustomCategory('Other');
    setIsAddingItem(false);
  };

  // Remove item from the list
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Save the current list
  const saveList = () => {
    if (!listName.trim()) return;
    
    const newList = {
      id: Date.now().toString(),
      name: listName.trim(),
      date: new Date().toISOString(),
      items: items.map(({ id, name, quantity, unit, category }) => ({
        name, quantity, unit, category
      }))
    };
    
    setSavedLists([...savedLists, newList]);
    setIsSaving(false);
  };

  // Load a saved list
  const loadList = (list) => {
    setItems(list.items.map(item => ({
      ...item,
      id: `loaded-${Date.now()}-${item.name}`,
      checked: false
    })));
    setListName(list.name);
  };

  // Delete a saved list
  const deleteList = (id, e) => {
    e.stopPropagation();
    setSavedLists(savedLists.filter(list => list.id !== id));
  };

  // Toggle category expansion
  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Calculate completion percentage
  const completionPercentage = items.length > 0 
    ? Math.round((items.filter(item => item.checked).length / items.length) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {listName}
            </h2>
            <button 
              onClick={() => setIsSaving(!isSaving)}
              className="ml-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {isSaving ? 'Cancel' : 'Save List'}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Print list"
            >
              <FiPrinter className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Close"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 pt-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
            {items.filter(item => item.checked).length} of {items.length} items ({completionPercentage}%)
          </div>
        </div>

        {/* Save list form */}
        {isSaving && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Enter list name"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={saveList}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FiSave className="h-5 w-5" />
              </button>
            </div>
            
            {savedLists.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Saved Lists</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {savedLists.map(list => (
                    <div 
                      key={list.id} 
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={() => loadList(list)}
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{list.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(list.date).toLocaleDateString()} • {list.items.length} items
                        </div>
                      </div>
                      <button 
                        onClick={(e) => deleteList(list.id, e)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                        title="Delete list"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add item form */}
        {isAddingItem ? (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input
                type="text"
                value={customItem}
                onChange={(e) => setCustomItem(e.target.value)}
                placeholder="Item name"
                className="md:col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                autoFocus
              />
              <input
                type="number"
                value={customQuantity}
                onChange={(e) => setCustomQuantity(e.target.value)}
                placeholder="Qty"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end mt-2 space-x-2">
              <button
                onClick={() => setIsAddingItem(false)}
                className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={addCustomItem}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={!customItem.trim()}
              >
                Add Item
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingItem(true)}
            className="flex items-center justify-center w-full p-3 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
          >
            <FiPlus className="h-5 w-5 mr-2" />
            Add Item
          </button>
        )}

        {/* Grocery list */}
        <div className="flex-1 overflow-y-auto p-4">
          {Object.keys(itemsByCategory).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
                <div key={category} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-3 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600/50"
                  >
                    <div className="flex items-center">
                      <span className="capitalize">{category}</span>
                      <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                        {categoryItems.length}
                      </span>
                    </div>
                    {activeCategory === category ? (
                      <FiChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <FiChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {(activeCategory === null || activeCategory === category) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                          {categoryItems.map((item) => (
                            <li key={item.id} className="group">
                              <div className="flex items-center p-3 hover:bg-white dark:hover:bg-gray-600/30">
                                <button
                                  onClick={() => toggleItem(item.id)}
                                  className={`flex-shrink-0 h-5 w-5 rounded border ${item.checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-500'} flex items-center justify-center mr-3`}
                                  aria-label={item.checked ? 'Mark as not purchased' : 'Mark as purchased'}
                                >
                                  {item.checked && <FiCheck className="h-4 w-4 text-white" />}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium ${item.checked ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                    {item.name}
                                  </p>
                                  {item.fromRecipes && item.fromRecipes.length > 0 && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                      For: {item.fromRecipes.join(', ')}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center ml-2">
                                  <span className={`text-sm ${item.checked ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {item.quantity} {item.unit}
                                  </span>
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="ml-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove item"
                                  >
                                    <FiX className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <FiPackage className="h-12 w-12 mb-2 opacity-30" />
              <p>Your shopping list is empty</p>
              <p className="text-sm">Add items manually or plan some meals first</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default GroceryList;
