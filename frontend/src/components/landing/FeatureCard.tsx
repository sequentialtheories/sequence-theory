import React from 'react';
import { LucideIcon } from 'lucide-react';
import { THEME_VARIANTS, ThemeVariant } from '@/constants/landing';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: ThemeVariant;
  className?: string;
}

/**
 * Reusable feature card component with hover effects
 * Used in problem section and other feature showcases
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  variant = 'primary',
  className = '',
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const theme = THEME_VARIANTS[variant];

  return (
    <div
      className={`group bg-card/60 backdrop-blur-sm rounded-2xl p-8 hover:shadow-lg transition-all ${prefersReducedMotion ? '' : 'duration-300 hover:-translate-y-1'} ${className}`}
    >
      <div
        className={`w-14 h-14 ${theme.bg} rounded-xl flex items-center justify-center mb-6 ${theme.hoverBg} transition-colors`}
        aria-hidden="true"
      >
        <Icon className={`h-7 w-7 ${theme.text}`} />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
