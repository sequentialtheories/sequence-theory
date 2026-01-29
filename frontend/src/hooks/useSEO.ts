import { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
}

/**
 * Hook to manage SEO meta tags without creating duplicates
 * Properly cleans up on unmount
 */
export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    // Store previous values for cleanup
    const previousTitle = document.title;
    document.title = config.title;

    // Handle description meta tag
    let metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute('content') || '';
    if (metaDescription) {
      metaDescription.setAttribute('content', config.description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', config.description);
      document.head.appendChild(metaDescription);
    }

    // Handle keywords meta tag
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    const previousKeywords = metaKeywords?.getAttribute('content') || '';
    if (metaKeywords) {
      metaKeywords.setAttribute('content', config.keywords);
    } else {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      metaKeywords.setAttribute('content', config.keywords);
      document.head.appendChild(metaKeywords);
    }

    // Cleanup function
    return () => {
      document.title = previousTitle;
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta && previousDescription) {
        descMeta.setAttribute('content', previousDescription);
      }
      const keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (keywordsMeta && previousKeywords) {
        keywordsMeta.setAttribute('content', previousKeywords);
      } else if (keywordsMeta && !previousKeywords) {
        keywordsMeta.remove();
      }
    };
  }, [config.title, config.description, config.keywords]);
};

export default useSEO;
