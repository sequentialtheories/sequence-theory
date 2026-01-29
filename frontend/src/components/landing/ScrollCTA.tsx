import React, { RefObject } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSingleScrollVisibility } from '@/hooks/useScrollVisibility';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { ANIMATION_CONFIG } from '@/constants/landing';

interface ScrollCTAProps {
  sectionRef: RefObject<HTMLElement>;
  label: string;
  to: string;
  icon: React.ReactNode;
  delay?: number;
}

/**
 * Scroll-triggered CTA component
 * Appears when the associated section enters the viewport
 */
export const ScrollCTA: React.FC<ScrollCTAProps> = ({
  sectionRef,
  label,
  to,
  icon,
  delay = ANIMATION_CONFIG.CTA_APPEAR_DELAY,
}) => {
  const isVisible = useSingleScrollVisibility(sectionRef, {
    threshold: ANIMATION_CONFIG.INTERSECTION_THRESHOLD,
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [showCTA, setShowCTA] = React.useState(false);

  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowCTA(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  const transitionClasses = prefersReducedMotion
    ? ''
    : `transition-all duration-${ANIMATION_CONFIG.TRANSITION_DURATION}`;

  return (
    <div
      className={`${transitionClasses} ${
        showCTA ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      role="navigation"
      aria-label={`Navigate to ${label}`}
    >
      <Link to={to}>
        <Button
          variant="outline"
          className={`rounded-full group hover:bg-primary hover:text-primary-foreground ${prefersReducedMotion ? '' : 'transition-all duration-300'}`}
        >
          <span aria-hidden="true">{icon}</span>
          <span className="ml-2">{label}</span>
          <ArrowRight
            className={`ml-2 h-4 w-4 ${prefersReducedMotion ? '' : 'group-hover:translate-x-1 transition-transform'}`}
            aria-hidden="true"
          />
        </Button>
      </Link>
    </div>
  );
};

export default ScrollCTA;
