/**
 * Landing Page Constants
 * Centralized configuration for animations, themes, and SEO
 */

export const ANIMATION_CONFIG = {
  SCROLL_DELAY: 300,
  CTA_APPEAR_DELAY: 500,
  INTERSECTION_THRESHOLD: 0.3,
  TRANSITION_DURATION: 700,
  HERO_FADE_DURATION: 1000,
} as const;

export const THEME_VARIANTS = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', hoverBg: 'group-hover:bg-primary/20' },
  destructive: { bg: 'bg-destructive/10', text: 'text-destructive', hoverBg: 'group-hover:bg-destructive/20' },
  accent: { bg: 'bg-accent/10', text: 'text-accent', hoverBg: 'group-hover:bg-accent/20' },
  warning: { bg: 'bg-amber-500/10', text: 'text-amber-500', hoverBg: 'group-hover:bg-amber-500/20' },
  info: { bg: 'bg-blue-500/10', text: 'text-blue-500', hoverBg: 'group-hover:bg-blue-500/20' },
} as const;

export type ThemeVariant = keyof typeof THEME_VARIANTS;

export const SEO_CONFIG = {
  title: 'Sequence Theory - Your Money, Your Power. Through The Vault Club',
  description: 'Your Money, Your Power. Join The Vault Club by Sequence Theory for accessible financial education and communal cryptocurrency investments.',
  keywords: 'Your Money Your Power, Sequence Theory, Vault Club, cryptocurrency investing, financial empowerment, wealth building',
} as const;
