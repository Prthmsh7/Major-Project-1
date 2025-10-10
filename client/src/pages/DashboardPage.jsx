import { FiActivity, FiDroplet } from 'react-icons/fi';
import WaterIntake from '@/components/WaterIntake';
import { motion } from 'framer-motion';

// Animation variants for the dashboard cards
const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

const DashboardPage = () => {
  // Mock data - replace with actual data from your API
  const nutritionData = {
    calories: {
      consumed: 1200,
      goal: 2000,
      unit: 'kcal'
    },
    water: {
      consumed: 4,
      goal: 8,
      unit: 'glasses'
    },
    macros: {
      protein: { value: 95, goal: 150, unit: 'g' },
      carbs: { value: 150, goal: 250, unit: 'g' },
      fat: { value: 40, goal: 70, unit: 'g' },
    }
  };

  const calculatePercentage = (consumed, goal) => {
    return Math.min(Math.round((consumed / goal) * 100), 100);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6 p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-2"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getGreeting()}, User!</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* Water Intake */}
        <motion.div variants={cardVariants} className="col-span-1">
          <WaterIntake />
        </motion.div>

        {/* Macros */}
        {Object.entries(nutritionData.macros).map(([key, { value, goal, unit }], index) => (
          <motion.div 
            key={key} 
            variants={cardVariants}
            className="p-6 bg-white rounded-lg shadow dark:bg-gray-800"
            custom={index}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">{key}</h3>
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <FiActivity className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {value}
                <span className="text-sm font-normal text-gray-500"> / {goal} {unit}</span>
              </div>
              <div className="w-full h-2 mt-2 bg-gray-200 rounded-full dark:bg-gray-700">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${calculatePercentage(value, goal)}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Meals */}
      <motion.div 
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
        className="p-6 bg-white rounded-lg shadow dark:bg-gray-800"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Today's Meals</h2>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            + Add Meal
          </button>
        </div>
        
        <div className="mt-4 space-y-4">
          {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
            <motion.div 
              key={meal}
              variants={cardVariants}
              className="p-4 border border-gray-200 rounded-lg dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white">{meal}</h3>
                <span className="text-sm text-gray-500">0 items • 0 kcal</span>
              </div>
              <button className="w-full mt-2 py-2 text-sm text-center text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
                + Add {meal}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
