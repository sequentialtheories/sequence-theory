import React from 'react';
import { SectionBadge } from './SectionBadge';
import { ThemeVariant } from '@/constants/landing';

interface SectionHeaderProps {
  badge: {
    icon: React.ReactNode;
    label: string;
    variant?: ThemeVariant;
  };
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  id?: string;
}

/**
 * Reusable section header component
 * Provides consistent styling for section titles across the landing page
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  description,
  className = '',
  titleClassName = '',
  id,
}) => {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <div className="mb-6">
        <SectionBadge
          icon={badge.icon}
          label={badge.label}
          variant={badge.variant}
        />
      </div>
      <h2
        id={id}
        className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground ${titleClassName}`}
      >
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
