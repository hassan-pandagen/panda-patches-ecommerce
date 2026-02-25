'use client';

import { useEffect } from 'react';

const TawkToWidget = () => {
  useEffect(() => {
    // Tawk.to configuration
    const propertyId = '64b56d7d94cf5d49dc6422c0';
    const widgetId = '1h5ib7cm1';

    // Prevent double initialization — check if script is already in the DOM
    if (document.getElementById('tawk-script')) {
      return;
    }

    // Initialize Tawk_API
    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    // Advanced tracking setup
    (window as any).Tawk_API.onLoad = function () {
      const Tawk_API = (window as any).Tawk_API;

      // Detect referral source
      const referrer = document.referrer.toLowerCase();
      const searchParams = new URLSearchParams(window.location.search);
      const utmSource = searchParams.get('utm_source');
      const utmMedium = searchParams.get('utm_medium');
      const utmCampaign = searchParams.get('utm_campaign');
      const fbclid = searchParams.get('fbclid');
      const gclid = searchParams.get('gclid');

      let source = 'Direct Visit';
      let category = 'Direct';
      let details = '';

      if (referrer.includes('facebook.com') || referrer.includes('fb.com') || fbclid) {
        source = 'Facebook';
        category = 'Social Media';
        details = fbclid ? 'Facebook Ad (Paid)' : 'Facebook Organic';
      } else if (referrer.includes('instagram.com')) {
        source = 'Instagram';
        category = 'Social Media';
      } else if (referrer.includes('google.com') || gclid) {
        source = 'Google';
        category = 'Search Engine';
        details = gclid ? 'Google Ads (Paid)' : 'Google Organic';
      } else if (referrer.includes('chat.openai.com') || referrer.includes('chatgpt.com')) {
        source = 'ChatGPT';
        category = 'AI Chatbot';
      } else if (utmSource) {
        source = utmSource;
        category = 'UTM Campaign';
        details = `Medium: ${utmMedium || 'N/A'} | Campaign: ${utmCampaign || 'N/A'}`;
      }

      // Set visitor attributes
      Tawk_API.setAttributes(
        {
          'Traffic Source': source,
          'Traffic Category': category,
          'Source Details': details || 'N/A',
          'Landing Page': window.location.href,
          'UTM Source': utmSource || 'None',
          'UTM Medium': utmMedium || 'None',
          'UTM Campaign': utmCampaign || 'None',
        },
        function (error: any) {
          if (error) console.error('Tawk.to attribute error:', error);
        }
      );

      // Add tags
      const tags: string[] = [];
      if (category === 'AI Chatbot') tags.push('ai-chatbot');
      if (category === 'Social Media') tags.push('social-media');
      if (category === 'Search Engine') tags.push('search-engine');
      if (tags.length > 0) Tawk_API.addTags(tags);
    };

    // GTM tracking
    (window as any).Tawk_API.onChatStarted = function () {
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({ event: 'chat_started' });
      }
    };

    // Inject Tawk.to script
    const script = document.createElement('script');
    script.id = 'tawk-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.setAttribute('crossorigin', '*');

    // Error handling
    script.onerror = () => {
      console.error('Failed to load Tawk.to widget. Check domain whitelist in Tawk.to dashboard.');
    };

    // Append to document
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }

    // Cleanup
    return () => {
      // Note: Tawk.to doesn't support easy cleanup, so we just leave it
    };
  }, []);

  return null;
};

export default TawkToWidget;
