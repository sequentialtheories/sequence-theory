import { NavigateFunction } from 'react-router-dom';

export const navigateToSignup = (
  currentPath: string,
  navigate: NavigateFunction
) => {
  // If already on home page, just scroll
  if (currentPath === '/') {
    setTimeout(() => {
      document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  } else {
    // Navigate to home, then scroll after navigation completes
    navigate('/', { state: { scrollToSignup: true } });
  }
};
