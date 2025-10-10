import { useState, useEffect } from 'react';
import { FiActivity, FiTrendingUp, FiCalendar, FiPieChart } from 'react-icons/fi';

const NutritionPage = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with actual API calls
  const nutritionData = {
    overview: {
      calories: {
        current: 1850,
        goal: 2200,
        trend: 5.2,
      },
      macros: {
        protein: { current: 145, goal: 180, trend: 3.1 },
        carbs: { current: 210, goal: 250, trend: -2.3 },
        fat: { current: 65, goal: 80, trend: 1.2 },
      },
      water: {
        current: 6,
        goal: 8,
      },
    },
    weeklyData: [
      { day: 'Mon', calories: 1950, protein: 150, carbs: 220, fat: 70 },
      { day: 'Tue', calories: 2100, protein: 165, carbs: 240, fat: 75 },
      { day: 'Wed', calories: 1800, protein: 140, carbs: 200, fat: 65 },
      { day: 'Thu', calories: 2200, protein: 170, carbs: 250, fat: 80 },
      { day: 'Fri', calories: 1750, protein: 135, carbs: 190, fat: 60 },
      { day: 'Sat', calories: 2400, protein: 155, carbs: 280, fat: 90 },
      { day: 'Sun', calories: 2000, protein: 160, carbs: 230, fat: 75 },
    ],
    topFoods: [
      { name: 'Chicken Breast', calories: 650, protein: 120, timesConsumed: 4 },
      { name: 'White Rice', calories: 520, protein: 15, timesConsumed: 3 },
      { name: 'Salmon', calories: 480, protein: 45, timesConsumed: 2 },
      { name: 'Broccoli', calories: 150, protein: 12, timesConsumed: 5 },
    ],
  };

  const calculatePercentage = (current, goal) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  const getTrendColor = (value) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const renderTrendIcon = (value) => {
    if (value > 0) return <FiTrendingUp className="w-4 h-4" />;
    if (value < 0) return <FiTrendingUp className="w-4 h-4 transform rotate-180" />;
    return <span className="w-4 h-4">-</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nutrition Overview</h1>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setTimeRange('day')}
            className={`px-3 py-1 text-sm rounded-lg ${timeRange === 'day' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
          >
            Day
          </button>
          <button 
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 text-sm rounded-lg ${timeRange === 'week' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
          >
            Week
          </button>
          <button 
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 text-sm rounded-lg ${timeRange === 'month' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FiActivity className="w-5 h-5 mr-2" />
              Overview
            </div>
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'trends'
                ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FiTrendingUp className="w-5 h-5 mr-2" />
              Trends
            </div>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FiCalendar className="w-5 h-5 mr-2" />
              History
            </div>
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analysis'
                ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FiPieChart className="w-5 h-5 mr-2" />
              Analysis
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Calories */}
              <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Calories</h3>
                  <div className="flex items-center">
                    <span className={`text-sm ${getTrendColor(nutritionData.overview.calories.trend)}`}>
                      {Math.abs(nutritionData.overview.calories.trend)}%
                    </span>
                    {renderTrendIcon(nutritionData.overview.calories.trend)}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {nutritionData.overview.calories.current}
                    <span className="text-sm font-normal text-gray-500"> / {nutritionData.overview.calories.goal} kcal</span>
                  </div>
                  <div className="w-full h-2 mt-2 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${calculatePercentage(nutritionData.overview.calories.current, nutritionData.overview.calories.goal)}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {nutritionData.overview.calories.goal - nutritionData.overview.calories.current} kcal remaining
                  </div>
                </div>
              </div>

              {/* Macros */}
              {Object.entries(nutritionData.overview.macros).map(([key, { current, goal, trend }]) => (
                <div key={key} className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">{key}</h3>
                    <div className="flex items-center">
                      <span className={`text-sm ${getTrendColor(trend)}`}>
                        {Math.abs(trend)}%
                      </span>
                      {renderTrendIcon(trend)}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {current}
                      <span className="text-sm font-normal text-gray-500"> / {goal}g</span>
                    </div>
                    <div className="w-full h-2 mt-2 bg-gray-200 rounded-full dark:bg-gray-700">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${calculatePercentage(current, goal)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Summary */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="p-6 bg-white rounded-lg shadow lg:col-span-2 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Weekly Nutrition</h3>
                <div className="h-64">
                  {/* Placeholder for chart */}
                  <div className="flex items-center justify-center h-full text-gray-500 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-400">
                    Weekly nutrition chart will be displayed here
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Top Foods</h3>
                <div className="space-y-4">
                  {nutritionData.topFoods.map((food, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{food.name}</h4>
                        <p className="text-sm text-gray-500">{food.timesConsumed} times this week</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">{food.calories} kcal</div>
                        <div className="text-sm text-gray-500">{food.protein}g protein</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Nutrition Trends</h3>
            <div className="h-96">
              {/* Placeholder for trends chart */}
              <div className="flex items-center justify-center h-full text-gray-500 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-400">
                Nutrition trends chart will be displayed here
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Meal History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                      Date
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                      Meal
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                      Food
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-300">
                      Calories
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-300">
                      Protein
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-300">
                      Carbs
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-300">
                      Fat
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                        {new Date().toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {['Breakfast', 'Lunch', 'Dinner', 'Snack'][Math.floor(Math.random() * 4)]}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                        {['Chicken Breast', 'Salmon', 'Eggs', 'Oatmeal'][Math.floor(Math.random() * 4)]}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                        {Math.floor(Math.random() * 500) + 100} kcal
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                        {Math.floor(Math.random() * 30) + 5}g
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                        {Math.floor(Math.random() * 40) + 10}g
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                        {Math.floor(Math.random() * 20) + 5}g
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-4">
              <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Load More
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Macronutrient Distribution</h3>
              <div className="h-64">
                {/* Placeholder for pie chart */}
                <div className="flex items-center justify-center h-full text-gray-500 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-400">
                  Macronutrient pie chart will be displayed here
                </div>
              </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Nutrition Balance</h3>
              <div className="h-64">
                {/* Placeholder for balance chart */}
                <div className="flex items-center justify-center h-full text-gray-500 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-400">
                  Nutrition balance chart will be displayed here
                </div>
              </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow md:col-span-2 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Weekly Summary</h3>
              <div className="h-64">
                {/* Placeholder for weekly summary */}
                <div className="flex items-center justify-center h-full text-gray-500 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-400">
                  Weekly summary statistics will be displayed here
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionPage;
