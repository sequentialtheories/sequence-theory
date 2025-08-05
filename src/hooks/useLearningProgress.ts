import { useState, useEffect, useCallback } from 'react';
import { allModules } from '@/data/moduleData';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

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

  // Load progress from database and localStorage on mount and when user changes
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

    loadUserProgress();
  }, [user?.id]);

  // Automatically load user progress from database
  const loadUserProgress = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('get_user_progress');
      
      if (error) {
        console.error('Error loading progress from database:', error);
        // Fallback to localStorage
        loadFromLocalStorage();
        return;
      }

      if (data && data.length > 0) {
        const completedModules = data.map((item: any) => item.module_id);
        const newProgress = {
          completedModules,
          currentCategory: 0,
          currentModule: 0
        };
        setProgress(newProgress);
        
        // Also save to localStorage for offline access
        const storageKey = getStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(newProgress));
      } else {
        // No progress in database, check localStorage
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      loadFromLocalStorage();
    }
  }, [user?.id]);

  // Fallback to localStorage loading
  const loadFromLocalStorage = useCallback(() => {
    const storageKey = getStorageKey();
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsedProgress = JSON.parse(saved);
        setProgress(parsedProgress);
      } catch (error) {
        console.error('Failed to parse learning progress:', error);
        setProgress({
          completedModules: [],
          currentCategory: 0,
          currentModule: 0
        });
      }
    } else {
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

  // Automatically save progress to database and localStorage
  const completeModule = useCallback(async (moduleId: string, categoryIndex: number, moduleIndex: number) => {
    // First update local state for immediate UI feedback
    setProgress(prev => {
      // Avoid duplicate entries
      if (prev.completedModules.includes(moduleId)) {
        return prev;
      }
      
      const completedModules = [...prev.completedModules, moduleId];
      const newProgress = {
        ...prev,
        completedModules,
        currentCategory: categoryIndex,
        currentModule: moduleIndex + 1
      };
      
      return newProgress;
    });

    // Automatically save to database if user is authenticated
    if (user?.id) {
      try {
        const { error } = await supabase.rpc('save_learning_progress', {
          p_module_id: moduleId,
          p_category_index: categoryIndex,
          p_module_index: moduleIndex
        });

        if (error) {
          console.error('Error saving progress to database:', error);
        } else {
          console.log('Progress automatically saved to database:', moduleId);
        }
      } catch (error) {
        console.error('Error calling save_learning_progress:', error);
      }
    }
  }, [user?.id]);

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