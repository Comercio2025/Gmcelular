import { useEffect } from 'react';
import { useData } from '../contexts/DataContext';

// Extend window interface for tracking
declare global {
  interface Window {
    fbq: any;
    gtag: any;
    dataLayer: any;
  }
}

export const PixelTracker = () => {
  const { config } = useData();

  useEffect(() => {
    // Facebook Pixel
    if (config.facebookPixelId && !document.getElementById('fb-pixel-script')) {
      const script = document.createElement('script');
      script.id = 'fb-pixel-script';
      script.innerHTML = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${config.facebookPixelId}');
            fbq('track', 'PageView');
          `;
      document.head.appendChild(script);

      const noscript = document.createElement('noscript');
      noscript.innerHTML = `<img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=${config.facebookPixelId}&ev=PageView&noscript=1"
          />`;
      document.head.appendChild(noscript);
    }

    // Google Ads / Analytics
    if (config.googleAdsId && !document.getElementById('google-ads-script')) {
      const script = document.createElement('script');
      script.id = 'google-ads-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.googleAdsId}`;
      document.head.appendChild(script);

      const script2 = document.createElement('script');
      script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${config.googleAdsId}');
          `;
      document.head.appendChild(script2);
    }

  }, [config.facebookPixelId, config.googleAdsId]);

  // Track WhatsApp Clicks
  useEffect(() => {
    const handleWhatsAppClick = (e: MouseEvent) => {
      // Check if clicked element or parent is a WhatsApp link
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && (link.href.includes('wa.me') || link.href.includes('whatsapp.com')) || (link?.href && config.whatsappNumber && link.href.includes(String(config.whatsappNumber)))) {
        // Facebook Track
        if (window.fbq) {
          window.fbq('track', 'Contact');
          window.fbq('trackCustom', 'WhatsAppClick');
        }

        // Google Track
        if (window.gtag && config.googleAdsId) {
          window.gtag('event', 'conversion', {
            'send_to': `${config.googleAdsId}/whatsapp_click`
          });
          window.gtag('event', 'whatsapp_click');
        }
      }
    };

    document.addEventListener('click', handleWhatsAppClick);
    return () => document.removeEventListener('click', handleWhatsAppClick);
  }, [config.whatsappNumber, config.googleAdsId]);

  return null;
};
