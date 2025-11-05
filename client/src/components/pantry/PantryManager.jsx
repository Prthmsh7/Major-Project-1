import React, { useState } from 'react';
import { FiPlus, FiMinus, FiTrash2, FiCheck } from 'react-icons/fi';
import { usePantry } from '../../context/PantryContext';
import ImageAnalysis from './ImageAnalysis';

const PantryManager = () => {
  const { pantryItems, addPantryItem, updatePantryItem, removePantryItem } = usePantry();
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, unit: 'pcs' });
  const [editingId, setEditingId] = useState(null);
  const [editItem, setEditItem] = useState({ name: '', quantity: 1, unit: 'pcs' });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = (item) => {
    const errors = {};
    if (!item.name.trim()) {
      errors.name = 'Item name is required';
    }
    if (item.quantity !== '' && (isNaN(item.quantity) || item.quantity <= 0)) {
      errors.quantity = 'Please enter a valid quantity';
    }
    return errors;
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const errors = validateForm(newItem);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    
    addPantryItem({
      id: Date.now().toString(),
      name: newItem.name.trim(),
      quantity: newItem.quantity === '' ? '' : Number(newItem.quantity),
      unit: newItem.unit || 'pcs'
    });
    
    setNewItem({ name: '', quantity: 1, unit: 'pcs' });
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditItem(item);
  };

  const saveEdit = (id) => {
    updatePantryItem(id, editItem);
    setEditingId(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My Pantry</h2>
      </div>
      
      <form onSubmit={handleAddItem} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2 mb-1">
          <div className="flex-1">
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => {
                setNewItem({...newItem, name: e.target.value});
                if (formErrors.name) setFormErrors({...formErrors, name: ''});
              }}
              placeholder="Ingredient name"
              className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${formErrors.name ? 'border-red-500' : ''}`}
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>
          
          <div className="relative">
            <input
              type="number"
              min="0.1"
              step={newItem.unit === 'pcs' ? '1' : '0.1'}
              value={newItem.quantity}
              onChange={(e) => {
                setNewItem({...newItem, quantity: e.target.value});
                if (formErrors.quantity) setFormErrors({...formErrors, quantity: ''});
              }}
              className={`w-24 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${formErrors.quantity ? 'border-red-500' : ''}`}
              placeholder={newItem.unit === 'pcs' ? '1' : '0.00'}
            />
            {formErrors.quantity && (
              <p className="absolute mt-1 text-sm text-red-500 whitespace-nowrap">{formErrors.quantity}</p>
            )}
          </div>
          
          <select
            value={newItem.unit}
            onChange={(e) => setNewItem({
              ...newItem, 
              unit: e.target.value,
              // Reset quantity when changing unit types
              quantity: e.target.value === 'pcs' ? '1' : ''
            })}
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="pcs">pcs</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="L">L</option>
            <option value="tsp">tsp</option>
            <option value="tbsp">tbsp</option>
            <option value="cup">cup</option>
          </select>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
            aria-label="Add item"
          >
            <FiPlus className="mr-1" /> Add
          </button>
        </div>
      </form>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {pantryItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Your pantry is empty. Add some ingredients!</p>
        ) : (
          pantryItems.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              {editingId === item.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editItem.name}
                    onChange={(e) => setEditItem({...editItem, name: e.target.value})}
                    className="flex-1 w-64 p-1 border rounded dark:bg-gray-600"
                  />
                  <input
                    type={editItem.unit === 'pcs' ? 'number' : 'text'}
                    min={editItem.unit === 'pcs' ? '1' : '0.1'}
                    step={editItem.unit === 'pcs' ? '1' : '0.1'}
                    value={editItem.quantity}
                    onChange={(e) => setEditItem({...editItem, quantity: e.target.value})}
                    className="w-16 p-1 border rounded dark:bg-gray-600"
                    placeholder={editItem.unit === 'pcs' ? '1' : '0.00'}
                  />
                  <select
                    value={editItem.unit}
                    onChange={(e) => setEditItem({...editItem, unit: e.target.value})}
                    className="p-1 w-24 border rounded dark:bg-gray-600"
                  >
                    <option value="pcs">pcs</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="L">L</option>
                    <option value="tsp">tsp</option>
                    <option value="tbsp">tbsp</option>
                    <option value="cup">cup</option>
                  </select>
                  <button 
                    onClick={() => saveEdit(item.id)}
                    className="p-1 text-green-500 hover:text-green-700"
                    title="Save"
                  >
                    <FiCheck />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(item)}
                      className="p-1 text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => removePantryItem(item.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Remove"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Image Analysis Section */}
      <ImageAnalysis onAnalysisComplete={(items) => {
        items.forEach(item => {
          addPantryItem({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: item.name,
            quantity: '', // Empty quantity for user to fill in
            unit: item.unit || 'pcs'
          });
        });
      }} />
    </div>
  );
};

export default PantryManager;
