import React from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { FiPieChart, FiClock, FiDollarSign, FiShoppingBag, FiTrendingUp } from 'react-icons/fi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const MealPlanAnalytics = ({ selectedRecipes, days, mealTypes }) => {
  // Calculate nutritional totals for the week
  const calculateNutritionTotals = () => {
    return days.reduce((acc, day) => {
      const dayNutrition = mealTypes.reduce((dayAcc, mealType) => {
        const key = `${day}-${mealType}`;
        const meals = selectedRecipes[key] || [];
        
        const mealNutrition = meals.reduce((mealAcc, meal) => ({
          calories: mealAcc.calories + (meal.calories || 0),
          protein: mealAcc.protein + (meal.protein || 0),
          carbs: mealAcc.carbs + (meal.carbs || 0),
          fat: mealAcc.fat + (meal.fat || 0),
          prepTime: mealAcc.prepTime + (meal.prepTime || 0),
          cost: mealAcc.cost + (meal.cost || 0)
        }), { calories: 0, protein: 0, carbs: 0, fat: 0, prepTime: 0, cost: 0 });

        return {
          calories: dayAcc.calories + mealNutrition.calories,
          protein: dayAcc.protein + mealNutrition.protein,
          carbs: dayAcc.carbs + mealNutrition.carbs,
          fat: dayAcc.fat + mealNutrition.fat,
          prepTime: dayAcc.prepTime + mealNutrition.prepTime,
          cost: dayAcc.cost + mealNutrition.cost
        };
      }, { calories: 0, protein: 0, carbs: 0, fat: 0, prepTime: 0, cost: 0 });

      return {
        calories: acc.calories + dayNutrition.calories,
        protein: acc.protein + dayNutrition.protein,
        carbs: acc.carbs + dayNutrition.carbs,
        fat: acc.fat + dayNutrition.fat,
        prepTime: acc.prepTime + dayNutrition.prepTime,
        cost: acc.cost + dayNutrition.cost
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, prepTime: 0, cost: 0 });
  };

  // Calculate meal type distribution
  const getMealTypeDistribution = () => {
    const distribution = mealTypes.map(mealType => {
      const mealCount = days.reduce((count, day) => {
        const key = `${day}-${mealType}`;
        return count + ((selectedRecipes[key] || []).length);
      }, 0);
      return { name: mealType, value: mealCount };
    });
    return distribution.filter(item => item.value > 0);
  };

  // Calculate nutrition distribution
  const getNutritionDistribution = () => {
    const { protein, carbs, fat } = calculateNutritionTotals();
    const total = protein + carbs + fat;
    
    return [
      { name: 'Protein', value: (protein / total) * 100, grams: protein },
      { name: 'Carbs', value: (carbs / total) * 100, grams: carbs },
      { name: 'Fat', value: (fat / total) * 100, grams: fat }
    ].filter(item => item.grams > 0);
  };

  // Calculate daily nutrition
  const getDailyNutrition = () => {
    return days.map(day => {
      const dayNutrition = mealTypes.reduce((acc, mealType) => {
        const key = `${day}-${mealType}`;
        const meals = selectedRecipes[key] || [];
        
        const mealNutrition = meals.reduce((mealAcc, meal) => ({
          calories: mealAcc.calories + (meal.calories || 0),
          protein: mealAcc.protein + (meal.protein || 0),
          carbs: mealAcc.carbs + (meal.carbs || 0),
          fat: mealAcc.fat + (meal.fat || 0)
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        return {
          calories: acc.calories + mealNutrition.calories,
          protein: acc.protein + mealNutrition.protein,
          carbs: acc.carbs + mealNutrition.carbs,
          fat: acc.fat + mealNutrition.fat
        };
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

      return {
        name: day.substring(0, 3),
        ...dayNutrition
      };
    });
  };

  const totals = calculateNutritionTotals();
  const mealTypeDistribution = getMealTypeDistribution();
  const nutritionDistribution = getNutritionDistribution();
  const dailyNutrition = getDailyNutrition();
  const avgPrepTime = (totals.prepTime / 7).toFixed(0);
  const weeklyCost = (totals.cost || 0).toFixed(2);

  const StatCard = ({ icon, title, value, unit }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex items-center">
        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {value} <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
        <FiTrendingUp className="mr-2" /> Meal Plan Analytics
      </h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          icon={<FiPieChart className="h-5 w-5" />} 
          title="Weekly Calories" 
          value={totals.calories.toFixed(0)} 
          unit="kcal" 
        />
        <StatCard 
          icon={<FiPieChart className="h-5 w-5" />} 
          title="Daily Protein" 
          value={(totals.protein / 7).toFixed(0)} 
          unit="g/day" 
        />
        <StatCard 
          icon={<FiClock className="h-5 w-5" />} 
          title="Avg. Prep Time" 
          value={avgPrepTime} 
          unit="min/meal" 
        />
        <StatCard 
          icon={<FiDollarSign className="h-5 w-5" />} 
          title="Weekly Cost" 
          value={weeklyCost} 
          unit="$" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nutrition Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Macronutrient Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={nutritionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {nutritionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [
                    `${value.toFixed(1)}%`, 
                    `${name} (${nutritionDistribution.find(n => n.name === name)?.grams.toFixed(0)}g)`
                  ]} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Meal Type Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Meal Type Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mealTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mealTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} meals`]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Daily Nutrition */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Daily Nutrition</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyNutrition}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'calories' ? `${value} kcal` : `${value}g`,
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]} 
              />
              <Legend />
              <Bar dataKey="protein" name="Protein" fill="#0088FE" />
              <Bar dataKey="carbs" name="Carbs" fill="#00C49F" />
              <Bar dataKey="fat" name="Fat" fill="#FFBB28" />
              <Bar dataKey="calories" name="Calories" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MealPlanAnalytics;
