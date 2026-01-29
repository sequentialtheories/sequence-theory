import React from 'react';

interface SkipLinkProps {
  targetId?: string;
  label?: string;
}

/**
 * Accessibility skip link for keyboard navigation
 * Allows users to skip to main content
 */
export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  label = 'Skip to main content',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {label}
    </a>
  );
};

export default SkipLink;
