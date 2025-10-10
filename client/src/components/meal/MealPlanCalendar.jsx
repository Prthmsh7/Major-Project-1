import { useState, useCallback } from 'react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiGrid, FiList } from 'react-icons/fi';

const MealPlanCalendar = ({ 
  selectedRecipes, 
  onSelectDay, 
  onRecipeSelect,
  onRecipeRemove,
  selectedDay: externalSelectedDay,
  onDayChange
}) => {
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(externalSelectedDay || new Date());

  // Generate days for the current view
  const getDaysInView = useCallback(() => {
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    } else {
      // For month view, we'll show the current month
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      return eachDayOfInterval({ start: firstDay, end: lastDay });
    }
  }, [currentDate, viewMode]);

  const days = getDaysInView();

  const navigate = (direction) => {
    setCurrentDate(prevDate => {
      if (viewMode === 'week') {
        return addDays(prevDate, direction * 7);
      } else {
        const newDate = new Date(prevDate);
        newDate.setMonth(newDate.getMonth() + direction);
        return newDate;
      }
    });
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    if (onSelectDay) onSelectDay(day);
    if (onDayChange) onDayChange(day);
  };

  const hasMeals = (day) => {
    return Object.entries(selectedRecipes).some(([key]) => {
      const [dateStr] = key.split('-');
      const recipeDate = new Date(dateStr);
      return isSameDay(recipeDate, day);
    });
  };

  const getMealsForDay = (day) => {
    return Object.entries(selectedRecipes).reduce((acc, [key, recipes]) => {
      const [dateStr, mealType] = key.split('-');
      const recipeDate = new Date(dateStr);
      
      if (isSameDay(recipeDate, day)) {
        acc[mealType] = recipes;
      }
      
      return acc;
    }, {});
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Previous"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          
          <h3 className="text-lg font-medium">
            {viewMode === 'week' 
              ? `${format(days[0], 'MMM d')} - ${format(days[6], 'MMM d, yyyy')}`
              : format(currentDate, 'MMMM yyyy')}
          </h3>
          
          <button
            onClick={() => navigate(1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Next"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setCurrentDate(new Date())}
            className="ml-2 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md"
          >
            Today
          </button>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 text-sm rounded-md ${viewMode === 'week' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
          >
            <FiCalendar className="inline-block mr-1" /> Week
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 text-sm rounded-md ${viewMode === 'month' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
          >
            <FiGrid className="inline-block mr-1" /> Month
          </button>
        </div>
      </div>
      
      {viewMode === 'week' ? (
        <div className="grid grid-cols-7 gap-2 mb-2">
          {days.map((day, i) => {
            const isSelected = selectedDay && isSameDay(day, selectedDay);
            const hasMeal = hasMeals(day);
            
            return (
              <button
                key={i}
                onClick={() => handleDayClick(day)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isSelected 
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {format(day, 'EEE')}
                </div>
                <div className={`text-lg font-medium ${isSelected ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                  {format(day, 'd')}
                </div>
                {hasMeal && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1"></div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-xs text-center font-medium text-gray-500 dark:text-gray-400 p-2">
              {day}
            </div>
          ))}
          
          {days.map((day, i) => {
            const isSelected = selectedDay && isSameDay(day, selectedDay);
            const hasMeal = hasMeals(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            
            return (
              <button
                key={i}
                onClick={() => handleDayClick(day)}
                className={`p-2 text-center rounded-lg transition-colors ${
                  isSelected 
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                    : isCurrentMonth 
                      ? 'hover:bg-gray-100 dark:hover:bg-gray-700' 
                      : 'text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className={`${isSelected ? 'font-semibold' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {hasMeal && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
      
      {/* Day's Meals */}
      {selectedDay && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            {format(selectedDay, 'EEEE, MMMM d')}
          </h4>
          
          <div className="space-y-3">
            {['breakfast', 'lunch', 'dinner'].map(mealType => {
              const meals = getMealsForDay(selectedDay)[mealType] || [];
              
              return (
                <div key={mealType} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {mealType}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {meals.length} {meals.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  
                  {meals.length > 0 ? (
                    <div className="space-y-2">
                      {meals.map(recipe => (
                        <div 
                          key={recipe.id} 
                          className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-md shadow-xs"
                        >
                          <span className="text-sm">{recipe.name}</span>
                          <button
                            onClick={() => onRecipeRemove && onRecipeRemove(selectedDay, mealType, recipe.id)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                            aria-label="Remove recipe"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No {mealType} planned
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanCalendar;
