import { motion } from 'framer-motion';
import MealPlanning from '@/components/meal/MealPlanning';

const MealPlanningPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full"
    >
      <MealPlanning />
    </motion.div>
  );
};

export default MealPlanningPage;
