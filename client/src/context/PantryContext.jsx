import React, { createContext, useContext, useState, useEffect } from 'react';

const PantryContext = createContext();

export const PantryProvider = ({ children }) => {
  const [pantryItems, setPantryItems] = useState(() => {
    const saved = localStorage.getItem('pantryItems');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever pantryItems changes
  useEffect(() => {
    localStorage.setItem('pantryItems', JSON.stringify(pantryItems));
  }, [pantryItems]);

  const addPantryItem = (item) => {
    setPantryItems(prevItems => {
      // Check if item already exists (case insensitive)
      const existingIndex = prevItems.findIndex(
        i => i.name.toLowerCase() === item.name.toLowerCase()
      );
      
      if (existingIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + (item.quantity || 1)
        };
        return updatedItems;
      }
      
      // Add new item
      return [...prevItems, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const updatePantryItem = (id, updates) => {
    setPantryItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const removePantryItem = (id) => {
    setPantryItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const checkPantryForRecipe = (recipe) => {
    if (!recipe.ingredients) return { hasAll: true, missingItems: [] };
    
    const missingItems = [];
    
    recipe.ingredients.forEach(ingredient => {
      const item = pantryItems.find(
        item => item.name.toLowerCase() === ingredient.name.toLowerCase()
      );
      
      if (!item || item.quantity < (ingredient.quantity || 1)) {
        missingItems.push({
          ...ingredient,
          needed: (ingredient.quantity || 1) - (item?.quantity || 0)
        });
      }
    });
    
    return {
      hasAll: missingItems.length === 0,
      missingItems
    };
  };

  return (
    <PantryContext.Provider
      value={{
        pantryItems,
        addPantryItem,
        updatePantryItem,
        removePantryItem,
        checkPantryForRecipe
      }}
    >
      {children}
    </PantryContext.Provider>
  );
};

export const usePantry = () => {
  const context = useContext(PantryContext);
  if (!context) {
    throw new Error('usePantry must be used within a PantryProvider');
  }
  return context;
};
