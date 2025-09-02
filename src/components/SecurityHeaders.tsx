import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const SecurityHeaders = () => {
  useEffect(() => {
    // Fetch security headers from edge function for proper implementation
    const applySecurityHeaders = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('security-headers');
        
        if (error) {
          console.warn('Failed to fetch security headers:', error);
          return;
        }

        // Apply viewport meta tag for mobile security
        const viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        viewportMeta.content = 'width=device-width, initial-scale=1.0, user-scalable=no';
        document.head.appendChild(viewportMeta);

        // Add referrer policy meta tag
        const referrerMeta = document.createElement('meta');
        referrerMeta.name = 'referrer';
        referrerMeta.content = 'strict-origin-when-cross-origin';
        document.head.appendChild(referrerMeta);

        // Add robots meta for security
        const robotsMeta = document.createElement('meta');
        robotsMeta.name = 'robots';
        robotsMeta.content = 'noindex, nofollow';
        document.head.appendChild(robotsMeta);

      } catch (err) {
        console.warn('Security headers initialization failed:', err);
      }
    };

    applySecurityHeaders();
  }, []);
  
  return null;
};