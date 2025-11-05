import { motion } from 'framer-motion';
import { useState } from 'react';
import PantryManager from '@/components/pantry/PantryManager';
import { usePantry } from '@/context/PantryContext';

const PantryPage = () => {
  const { pantryItems } = usePantry();
  const [activeTab, setActiveTab] = useState('pantry');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4 max-w-6xl"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Pantry Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your pantry items and track your ingredients
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <PantryManager />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Pantry Summary</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  You have <span className="font-bold">{pantryItems.length}</span> items in your pantry
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  {pantryItems.filter(item => item.quantity < 2).length} items running low
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {pantryItems.filter(item => item.quantity > 5).length} items well-stocked
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Quick Tips</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Keep your pantry updated for accurate meal planning</li>
                <li>• Mark items as you add them to your shopping list</li>
                <li>• Set quantity thresholds for low-stock alerts</li>
                <li>• Categorize items for better organization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PantryPage;
