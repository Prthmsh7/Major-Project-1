import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiFolderPlus, FiX, FiTrash2, FiCheck } from 'react-icons/fi';

const MealPlanTemplates = ({ 
  isOpen, 
  onClose, 
  onApplyTemplate,
  selectedRecipes 
}) => {
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem('mealPlanTemplates') || '[]');
    setTemplates(savedTemplates);
  }, []);

  const saveAsTemplate = () => {
    if (!templateName.trim()) return;
    
    const newTemplate = {
      id: Date.now(),
      name: templateName.trim(),
      date: new Date().toLocaleDateString(),
      recipes: { ...selectedRecipes }
    };

    const updatedTemplates = [...templates, newTemplate];
    localStorage.setItem('mealPlanTemplates', JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
    setTemplateName('');
    setShowSaveForm(false);
  };

  const deleteTemplate = (id, e) => {
    e.stopPropagation();
    const updatedTemplates = templates.filter(t => t.id !== id);
    localStorage.setItem('mealPlanTemplates', JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
    if (selectedTemplate?.id === id) {
      setSelectedTemplate(null);
    }
  };

  const applyTemplate = () => {
    if (selectedTemplate) {
      onApplyTemplate(selectedTemplate.recipes);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Meal Plan Templates
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSaveForm(true)}
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  title="Save current plan as template"
                >
                  <FiSave className="mr-1.5" /> Save Current
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Save Template Form */}
            {showSaveForm && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    onKeyDown={(e) => e.key === 'Enter' && saveAsTemplate()}
                    autoFocus
                  />
                  <button
                    onClick={saveAsTemplate}
                    disabled={!templateName.trim()}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      templateName.trim() 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                    }`}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Templates List */}
            <div className="flex-1 overflow-y-auto p-4">
              {templates.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FiFolderPlus className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>No templates saved yet.</p>
                  <p className="text-sm mt-1">Save your current meal plan as a template to get started.</p>
                </div>
              ) : (
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {templates.map((template) => (
                    <div 
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate?.id === template.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {template.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Created: {template.date}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {Object.keys(template.recipes).length} meals
                          </p>
                        </div>
                        <button
                          onClick={(e) => deleteTemplate(template.id, e)}
                          className="p-1 text-gray-400 hover:text-red-500"
                          title="Delete template"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={applyTemplate}
                disabled={!selectedTemplate}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm ${
                  selectedTemplate
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-400 cursor-not-allowed'
                }`}
              >
                Apply Template
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MealPlanTemplates;
