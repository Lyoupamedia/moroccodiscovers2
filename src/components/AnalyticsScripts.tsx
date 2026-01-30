import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Settings {
  google_analytics_id: string;
  google_tag_manager_id: string;
  google_adsense_code: string;
  google_search_console: string;
  facebook_pixel_id: string;
  ads_enabled: string;
}

export const AnalyticsScripts = () => {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value');

      if (error) {
        console.error('Error fetching site settings:', error);
        return;
      }

      const settingsMap: Record<string, string> = {};
      data?.forEach((setting) => {
        settingsMap[setting.setting_key] = setting.setting_value || '';
      });

      setSettings(settingsMap as unknown as Settings);
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (!settings) return;

    // Google Analytics
    if (settings.google_analytics_id) {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`;
      gaScript.id = 'ga-script';
      
      if (!document.getElementById('ga-script')) {
        document.head.appendChild(gaScript);
        
        const gaConfig = document.createElement('script');
        gaConfig.id = 'ga-config';
        gaConfig.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${settings.google_analytics_id}');
        `;
        document.head.appendChild(gaConfig);
      }
    }

    // Google Tag Manager
    if (settings.google_tag_manager_id) {
      if (!document.getElementById('gtm-script')) {
        const gtmScript = document.createElement('script');
        gtmScript.id = 'gtm-script';
        gtmScript.innerHTML = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${settings.google_tag_manager_id}');
        `;
        document.head.appendChild(gtmScript);
      }
    }

    // Google AdSense
    if (settings.ads_enabled === 'true' && settings.google_adsense_code) {
      if (!document.getElementById('adsense-script')) {
        const adsenseContainer = document.createElement('div');
        adsenseContainer.id = 'adsense-script';
        adsenseContainer.innerHTML = settings.google_adsense_code;
        
        // Extract and execute any scripts
        const scripts = adsenseContainer.querySelectorAll('script');
        scripts.forEach((script) => {
          const newScript = document.createElement('script');
          if (script.src) {
            newScript.src = script.src;
            newScript.async = true;
          } else {
            newScript.innerHTML = script.innerHTML;
          }
          document.head.appendChild(newScript);
        });
      }
    }

    // Google Search Console verification
    if (settings.google_search_console) {
      if (!document.getElementById('gsc-meta')) {
        const content = settings.google_search_console;
        // Check if it's a full meta tag or just the content value
        const match = content.match(/content=["']([^"']+)["']/);
        const verificationContent = match ? match[1] : content;
        
        const meta = document.createElement('meta');
        meta.id = 'gsc-meta';
        meta.name = 'google-site-verification';
        meta.content = verificationContent;
        document.head.appendChild(meta);
      }
    }

    // Facebook Pixel
    if (settings.facebook_pixel_id) {
      if (!document.getElementById('fb-pixel')) {
        const fbScript = document.createElement('script');
        fbScript.id = 'fb-pixel';
        fbScript.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${settings.facebook_pixel_id}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(fbScript);
      }
    }
  }, [settings]);

  return null;
};
