'use client';

import { useEffect } from 'react';

// Tawk.to Widget Component with Advanced Referral Tracking
const TawkToWidget = () => {
  useEffect(() => {
    const TAWK_PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
    const TAWK_WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

    // Function to detect referral source
    const detectReferralSource = () => {
      const referrer = document.referrer.toLowerCase();
      const searchParams = new URLSearchParams(window.location.search);

      // Check URL parameters first (for tracking links)
      const utmSource = searchParams.get('utm_source');
      const utmMedium = searchParams.get('utm_medium');
      const fbclid = searchParams.get('fbclid');
      const gclid = searchParams.get('gclid');

      let source = 'Direct/Unknown';
      let details = '';

      // Social Media Detection
      if (referrer.includes('facebook.com') || referrer.includes('fb.com') || fbclid) {
        source = 'Facebook';
        details = fbclid ? `Facebook Ad (fbclid: ${fbclid})` : 'Facebook Organic';
      } else if (referrer.includes('instagram.com')) {
        source = 'Instagram';
      } else if (referrer.includes('twitter.com') || referrer.includes('t.co')) {
        source = 'Twitter/X';
      } else if (referrer.includes('linkedin.com')) {
        source = 'LinkedIn';
      } else if (referrer.includes('tiktok.com')) {
        source = 'TikTok';
      } else if (referrer.includes('pinterest.com')) {
        source = 'Pinterest';
      } else if (referrer.includes('reddit.com')) {
        source = 'Reddit';
      } else if (referrer.includes('youtube.com')) {
        source = 'YouTube';
      } else if (referrer.includes('snapchat.com')) {
        source = 'Snapchat';
      } else if (referrer.includes('whatsapp.com')) {
        source = 'WhatsApp';
      } else if (referrer.includes('telegram.org') || referrer.includes('t.me')) {
        source = 'Telegram';
      }

      // LLM/AI Detection
      else if (
        referrer.includes('chat.openai.com') ||
        referrer.includes('chatgpt.com')
      ) {
        source = 'ChatGPT';
        details = 'OpenAI ChatGPT';
      } else if (referrer.includes('claude.ai')) {
        source = 'Claude AI';
        details = 'Anthropic Claude';
      } else if (referrer.includes('bard.google.com') || referrer.includes('gemini.google.com')) {
        source = 'Google Gemini';
        details = 'Google Gemini (formerly Bard)';
      } else if (referrer.includes('bing.com/chat') || referrer.includes('copilot.microsoft.com')) {
        source = 'Microsoft Copilot';
        details = 'Microsoft Copilot/Bing Chat';
      } else if (referrer.includes('perplexity.ai')) {
        source = 'Perplexity AI';
      } else if (referrer.includes('you.com')) {
        source = 'You.com AI';
      } else if (referrer.includes('poe.com')) {
        source = 'Poe AI';
      } else if (referrer.includes('character.ai')) {
        source = 'Character AI';
      }

      // Search Engines
      else if (referrer.includes('google.com') || gclid) {
        source = 'Google Search';
        details = gclid ? `Google Ad (gclid: ${gclid})` : 'Google Organic';
      } else if (referrer.includes('bing.com')) {
        source = 'Bing Search';
      } else if (referrer.includes('yahoo.com')) {
        source = 'Yahoo Search';
      } else if (referrer.includes('duckduckgo.com')) {
        source = 'DuckDuckGo';
      } else if (referrer.includes('baidu.com')) {
        source = 'Baidu';
      }

      // UTM Parameters
      else if (utmSource) {
        source = `UTM: ${utmSource}`;
        details = utmMedium ? `Medium: ${utmMedium}` : '';
      }

      // Generic referrer
      else if (referrer && referrer !== '') {
        try {
          const refUrl = new URL(referrer);
          source = `Referral: ${refUrl.hostname}`;
          details = refUrl.hostname;
        } catch {
          source = 'External Referral';
        }
      } else {
        source = 'Direct Visit';
        details = 'No referrer detected';
      }

      return { source, details, fullReferrer: referrer };
    };

    // Initialize Tawk.to
    const initTawkTo = () => {
      // Detect referral source
      const referralInfo = detectReferralSource();

      // Store in session for persistence
      if (!sessionStorage.getItem('tawk_referral')) {
        sessionStorage.setItem('tawk_referral', JSON.stringify(referralInfo));
      }

      // Tawk.to script injection
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');

      // Set up Tawk_API before script loads
      (window as any).Tawk_API = (window as any).Tawk_API || {};
      (window as any).Tawk_LoadStart = new Date();

      // GTM: Fire event when chat is started
      (window as any).Tawk_API.onChatStarted = function() {
        if ((window as any).dataLayer) {
          (window as any).dataLayer.push({ event: 'chat_started' });
        }
      };

      // Auto-maximize once per user after 10 seconds
      setTimeout(function() {
        if (!localStorage.getItem('tawk_auto_opened') && (window as any).Tawk_API?.maximize) {
          (window as any).Tawk_API.maximize();
          localStorage.setItem('tawk_auto_opened', 'true');
        }
      }, 10000);

      // When Tawk loads, set custom attributes
      (window as any).Tawk_API.onLoad = function() {
        const storedReferral = JSON.parse(sessionStorage.getItem('tawk_referral') || '{}');

        // Set visitor attributes
        (window as any).Tawk_API.setAttributes({
          'Referral Source': storedReferral.source || 'Unknown',
          'Referral Details': storedReferral.details || 'N/A',
          'Full Referrer URL': storedReferral.fullReferrer || 'None',
          'Landing Page': window.location.href,
          'User Agent': navigator.userAgent,
          'Visit Time': new Date().toLocaleString(),
        }, function(error: any) {
          if (error) {
            console.error('Error setting Tawk attributes:', error);
          }
        });

        // Add tags for easier filtering
        if (storedReferral.source.includes('Facebook')) {
          (window as any).Tawk_API.addTags(['facebook']);
        } else if (storedReferral.source.includes('Instagram')) {
          (window as any).Tawk_API.addTags(['instagram']);
        } else if (storedReferral.source.includes('ChatGPT')) {
          (window as any).Tawk_API.addTags(['chatgpt', 'ai', 'llm']);
        } else if (storedReferral.source.includes('Claude')) {
          (window as any).Tawk_API.addTags(['claude', 'ai', 'llm']);
        } else if (storedReferral.source.includes('Gemini')) {
          (window as any).Tawk_API.addTags(['gemini', 'ai', 'llm']);
        } else if (storedReferral.source.includes('Copilot')) {
          (window as any).Tawk_API.addTags(['copilot', 'ai', 'llm']);
        } else if (storedReferral.source.includes('AI')) {
          (window as any).Tawk_API.addTags(['ai', 'llm']);
        } else if (storedReferral.source.includes('Google')) {
          (window as any).Tawk_API.addTags(['google']);
        }


      };

      // Append script to document
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript?.parentNode?.insertBefore(script, firstScript);
    };

    // Initialize only once
    if (!(window as any).Tawk_API) {
      initTawkTo();
    }

    // Cleanup function
    return () => {
      // Tawk.to persists across page navigations in Next.js, so we don't remove it
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default TawkToWidget;
