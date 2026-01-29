import React from 'react';
import { CheckCircle } from 'lucide-react';
import { THEME_VARIANTS, ThemeVariant } from '@/constants/landing';

interface CheckListItemProps {
  text: string;
  variant?: ThemeVariant;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Reusable checklist item component
 * Used for feature lists and solution points
 */
export const CheckListItem: React.FC<CheckListItemProps> = ({
  text,
  variant = 'primary',
  icon,
  className = '',
}) => {
  const theme = THEME_VARIANTS[variant];

  return (
    <div className={`flex items-start gap-4 group ${className}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 ${theme.bg} rounded-full flex items-center justify-center ${theme.hoverBg} transition-colors`}
        aria-hidden="true"
      >
        {icon || <CheckCircle className={`h-4 w-4 ${theme.text}`} />}
      </div>
      <span className="text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
        {text}
      </span>
    </div>
  );
};

/**
 * Bullet point variant for simpler lists
 */
export const BulletListItem: React.FC<{
  text: string;
  variant?: ThemeVariant;
  className?: string;
}> = ({ text, variant = 'primary', className = '' }) => {
  const theme = THEME_VARIANTS[variant];

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div
        className={`w-1.5 h-1.5 ${theme.bg.replace('/10', '')} rounded-full mt-2.5 flex-shrink-0`}
        aria-hidden="true"
      />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
};

export default CheckListItem;
