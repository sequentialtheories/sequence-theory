import { useState, useEffect } from 'react';
import { allModules } from '@/data/moduleData';
import { useAuth } from '@/components/AuthProvider';

interface LearningProgress {
  completedModules: string[];
  currentCategory: number;
  currentModule: number;
}

const STORAGE_KEY_PREFIX = 'sequenceTheory_learningProgress';

export function useLearningProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<LearningProgress>({
    completedModules: [],
    currentCategory: 0,
    currentModule: 0
  });

  // Get user-specific storage key
  const getStorageKey = () => {
    return user?.id ? `${STORAGE_KEY_PREFIX}_${user.id}` : STORAGE_KEY_PREFIX;
  };

  // Load progress from localStorage on mount and when user changes
  useEffect(() => {
    if (!user) {
      // Reset to empty progress if no user is logged in
      setProgress({
        completedModules: [],
        currentCategory: 0,
        currentModule: 0
      });
      return;
    }

    const storageKey = getStorageKey();
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsedProgress = JSON.parse(saved);
        setProgress(parsedProgress);
      } catch (error) {
        console.error('Failed to parse learning progress:', error);
        // Reset to empty progress on error
        setProgress({
          completedModules: [],
          currentCategory: 0,
          currentModule: 0
        });
      }
    } else {
      // Reset to empty progress if no saved data for this user
      setProgress({
        completedModules: [],
        currentCategory: 0,
        currentModule: 0
      });
    }
  }, [user?.id]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (user?.id) {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(progress));
    }
  }, [progress, user?.id]);

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
      if (user?.id) {
        const storageKey = user.id ? `${STORAGE_KEY_PREFIX}_${user.id}` : STORAGE_KEY_PREFIX;
        localStorage.setItem(storageKey, JSON.stringify(newProgress));
      }
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