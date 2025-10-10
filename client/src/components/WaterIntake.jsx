import { useState, useEffect } from 'react';
import { FiDroplet } from 'react-icons/fi';
import { motion } from 'framer-motion';

const WaterIntake = () => {
  const [glasses, setGlasses] = useState(0);
  const goal = 8; // 8 glasses per day

  // Load saved water intake from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('waterIntake');
    if (savedData) {
      const { date, count } = JSON.parse(savedData);
      if (date === today) {
        setGlasses(count);
      }
    }
  }, []);

  // Save water intake to localStorage
  useEffect(() => {
    if (glasses > 0) {
      const today = new Date().toDateString();
      localStorage.setItem('waterIntake', JSON.stringify({ date: today, count: glasses }));
    }
  }, [glasses]);

  const addGlass = () => {
    if (glasses < goal) {
      setGlasses(glasses + 1);
    }
  };

  const removeGlass = () => {
    if (glasses > 0) {
      setGlasses(glasses - 1);
    }
  };

  const percentage = Math.min(Math.round((glasses / goal) * 100), 100);

  return (
    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Water Intake</h3>
        <FiDroplet className="w-6 h-6 text-blue-500" />
      </div>
      
      <div className="mt-4">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {glasses}
          <span className="text-sm font-normal text-gray-500"> / {goal} glasses</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 mt-2 bg-gray-200 rounded-full dark:bg-gray-700">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={removeGlass}
            disabled={glasses === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            - Remove Glass
          </button>
          
          <button
            onClick={addGlass}
            disabled={glasses >= goal}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add Glass
          </button>
        </div>
        
        {/* Water visualization */}
        <div className="mt-6">
          <div className="flex items-end justify-center space-x-1 h-32">
            {[...Array(goal)].map((_, index) => {
              const isFilled = index < glasses;
              return (
                <motion.div
                  key={index}
                  className={`w-8 ${isFilled ? 'bg-blue-400' : 'bg-gray-200 dark:bg-gray-700'} rounded-t-sm`}
                  initial={{ height: '0%' }}
                  animate={{ height: isFilled ? '100%' : '20%' }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterIntake;
