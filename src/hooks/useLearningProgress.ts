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
    setProgress(prev => ({
      ...prev,
      completedModules: [...prev.completedModules, moduleId],
      currentCategory: categoryIndex,
      currentModule: moduleIndex + 1
    }));
  };

  const isModuleUnlocked = (categoryIndex: number, moduleIndex: number): boolean => {
    // First module of first category is always unlocked
    if (categoryIndex === 0 && moduleIndex === 0) {
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

    // For first module in any category beyond the first category
    // Check if the last module of the previous category is completed
    if (categoryIndex > 0 && moduleIndex === 0) {
      // Find the last module of the previous category
      const previousCategoryModules = allModules.filter(
        module => module.categoryIndex === categoryIndex - 1
      );
      
      if (previousCategoryModules.length > 0) {
        const lastModuleOfPreviousCategory = previousCategoryModules.reduce((latest, current) => 
          current.moduleIndex > latest.moduleIndex ? current : latest
        );
        return progress.completedModules.includes(lastModuleOfPreviousCategory.id);
      }
      
      // If no previous category modules found, unlock it
      return true;
    }

    return false;
  };

  const isModuleCompleted = (moduleId: string): boolean => {
    return progress.completedModules.includes(moduleId);
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
    resetProgress
  };
}