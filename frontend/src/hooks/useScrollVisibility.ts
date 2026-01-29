import { useState, useEffect, RefObject, useCallback } from 'react';

interface UseScrollVisibilityOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean; // If true, stays visible after first intersection
}

/**
 * Consolidated scroll visibility hook using a single IntersectionObserver
 * More efficient than creating separate observers for each element
 */
export const useScrollVisibility = (
  refs: RefObject<HTMLElement>[],
  options: UseScrollVisibilityOptions = {}
): boolean[] => {
  const { threshold = 0.3, rootMargin = '0px', once = true } = options;
  const [visibilityStates, setVisibilityStates] = useState<boolean[]>(
    () => refs.map(() => false)
  );

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      setVisibilityStates((prev) => {
        const newStates = [...prev];
        entries.forEach((entry) => {
          const index = refs.findIndex((ref) => ref.current === entry.target);
          if (index !== -1) {
            if (entry.isIntersecting) {
              newStates[index] = true;
            } else if (!once) {
              newStates[index] = false;
            }
          }
        });
        return newStates;
      });
    },
    [refs, once]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, [refs, handleIntersection, threshold, rootMargin]);

  return visibilityStates;
};

/**
 * Single element visibility hook for simpler use cases
 */
export const useSingleScrollVisibility = (
  ref: RefObject<HTMLElement>,
  options: UseScrollVisibilityOptions = {}
): boolean => {
  const [isVisible, setIsVisible] = useState(false);
  const { threshold = 0.3, rootMargin = '0px', once = true } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, threshold, rootMargin, once]);

  return isVisible;
};

export default useScrollVisibility;
