import { useState, useEffect } from 'react';
import { allModules } from '@/data/moduleData';

interface LearningProgress {
  completedModules: string[];
  currentCategory: number;
  currentModule: number;
}

const STORAGE_KEY = 'sequenceTheory_learningProgress';

export function useLearningProgress() {
  const [progress, setProgress] = useState<LearningProgress>({
    completedModules: [],
    currentCategory: 0,
    currentModule: 0
  });

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedProgress = JSON.parse(saved);
        setProgress(parsedProgress);
      } catch (error) {
        console.error('Failed to parse learning progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeModule = (moduleId: string, categoryIndex: number, moduleIndex: number) => {
    setProgress(prev => {
      // Avoid duplicate entries
      const completedModules = prev.completedModules.includes(moduleId) 
        ? prev.completedModules 
        : [...prev.completedModules, moduleId];
      
      const newProgress = {
        ...prev,
        completedModules,
        currentCategory: categoryIndex,
        currentModule: moduleIndex + 1
      };
      
      // Immediately save to localStorage for instant persistence
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      console.log('Progress saved:', newProgress);
      
      return newProgress;
    });
  };

  const isModuleUnlocked = (categoryIndex: number, moduleIndex: number): boolean => {
    // First module of each category is always unlocked for better UX
    if (moduleIndex === 0) {
      return true;
    }

    // For subsequent modules within the same category
    if (moduleIndex > 0) {
      // Find the previous module in the same category
      const previousModule = allModules.find(
        module => module.categoryIndex === categoryIndex && module.moduleIndex === moduleIndex - 1
      );
      
      if (previousModule) {
        return progress.completedModules.includes(previousModule.id);
      }
      return false;
    }

    return false;
  };

  const isModuleCompleted = (moduleId: string): boolean => {
    return progress.completedModules.includes(moduleId);
  };

  const isCategoryCompleted = (categoryIndex: number): boolean => {
    // Check if all 6 modules in a category are completed
    const categoryModules = allModules.filter(module => module.categoryIndex === categoryIndex);
    return categoryModules.every(module => progress.completedModules.includes(module.id));
  };

  const areAllCategoriesCompleted = (): boolean => {
    // Check if all 3 categories (0, 1, 2) are completed
    return [0, 1, 2].every(categoryIndex => isCategoryCompleted(categoryIndex));
  };

  const getCompletionStats = () => {
    const totalModules = allModules.length;
    const completedModules = progress.completedModules.length;
    const completionPercentage = Math.round((completedModules / totalModules) * 100);
    
    return {
      totalModules,
      completedModules,
      completionPercentage,
      categories: [0, 1, 2].map(categoryIndex => ({
        categoryIndex,
        completed: isCategoryCompleted(categoryIndex),
        moduleCount: allModules.filter(m => m.categoryIndex === categoryIndex).length,
        completedCount: allModules.filter(m => m.categoryIndex === categoryIndex && progress.completedModules.includes(m.id)).length
      }))
    };
  };

  const resetProgress = () => {
    setProgress({
      completedModules: [],
      currentCategory: 0,
      currentModule: 0
    });
  };

  return {
    progress,
    completeModule,
    isModuleUnlocked,
    isModuleCompleted,
    isCategoryCompleted,
    areAllCategoriesCompleted,
    getCompletionStats,
    resetProgress
  };
}