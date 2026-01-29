import React from 'react';
import { THEME_VARIANTS, ThemeVariant } from '@/constants/landing';

interface SectionBadgeProps {
  icon: React.ReactNode;
  label: string;
  variant?: ThemeVariant;
  className?: string;
}

/**
 * Reusable section badge component
 * Used at the top of section headers to indicate section type
 */
export const SectionBadge: React.FC<SectionBadgeProps> = ({
  icon,
  label,
  variant = 'primary',
  className = '',
}) => {
  const theme = THEME_VARIANTS[variant];

  return (
    <div
      className={`inline-flex items-center gap-2 ${theme.bg} rounded-full px-4 py-2 ${className}`}
      role="presentation"
    >
      <span className={theme.text} aria-hidden="true">
        {icon}
      </span>
      <span className={`text-sm font-medium ${theme.text}`}>{label}</span>
    </div>
  );
};

export default SectionBadge;
