import { useState, useEffect } from 'react';

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

    // For subsequent modules in the same category
    if (moduleIndex > 0) {
      // Need previous module in same category to be completed
      const prevModuleCompleted = progress.completedModules.some(id => 
        id.includes(`category-${categoryIndex}-module-${moduleIndex - 1}`) ||
        (categoryIndex === 0 && moduleIndex === 1 && progress.completedModules.includes('what-is-money-really'))
      );
      return prevModuleCompleted;
    }

    // For first module in any category beyond the first category
    // All first modules should be unlocked initially to allow flexible learning
    if (moduleIndex === 0) {
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