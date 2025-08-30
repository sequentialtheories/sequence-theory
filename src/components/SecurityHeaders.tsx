import { useEffect } from 'react';

export const SecurityHeaders = () => {
  useEffect(() => {
    // Add security headers via meta tags for CSP
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://esm.sh;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https:;
      connect-src 'self' https://qldjhlnsphlixmzzrdwi.supabase.co wss://qldjhlnsphlixmzzrdwi.supabase.co https://waas.sequence.app https://api.sequence.app;
      frame-ancestors 'none';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      upgrade-insecure-requests;
    `.replace(/\s+/g, ' ').trim();
    
    document.head.appendChild(cspMeta);
    
    // Add X-Frame-Options
    const frameMeta = document.createElement('meta');
    frameMeta.httpEquiv = 'X-Frame-Options';
    frameMeta.content = 'DENY';
    document.head.appendChild(frameMeta);
    
    // Add X-Content-Type-Options
    const contentTypeMeta = document.createElement('meta');
    contentTypeMeta.httpEquiv = 'X-Content-Type-Options';
    contentTypeMeta.content = 'nosniff';
    document.head.appendChild(contentTypeMeta);
    
    return () => {
      // Cleanup on unmount
      if (cspMeta.parentNode) cspMeta.parentNode.removeChild(cspMeta);
      if (frameMeta.parentNode) frameMeta.parentNode.removeChild(frameMeta);
      if (contentTypeMeta.parentNode) contentTypeMeta.parentNode.removeChild(contentTypeMeta);
    };
  }, []);
  
  return null;
};