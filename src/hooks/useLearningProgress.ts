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