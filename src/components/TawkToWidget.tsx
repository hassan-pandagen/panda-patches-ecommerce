"use client";

import { useEffect } from 'react';

function getTrafficSource() {
  const params = new URLSearchParams(window.location.search);
  const ref = document.referrer;

  if (params.get('utm_source')) {
    return {
      source:   params.get('utm_source')   || 'unknown',
      medium:   params.get('utm_medium')   || 'unknown',
      campaign: params.get('utm_campaign') || 'none',
    };
  }

  if (ref) {
    const map: Record<string, { source: string; medium: string }> = {
      'google.com':    { source: 'Google',     medium: 'organic' },
      'bing.com':      { source: 'Bing',       medium: 'organic' },
      'yahoo.com':     { source: 'Yahoo',      medium: 'organic' },
      'duckduckgo.com':{ source: 'DuckDuckGo', medium: 'organic' },
      'facebook.com':  { source: 'Facebook',   medium: 'social' },
      'instagram.com': { source: 'Instagram',  medium: 'social' },
      'linkedin.com':  { source: 'LinkedIn',   medium: 'social' },
      'twitter.com':   { source: 'Twitter/X',  medium: 'social' },
      'x.com':         { source: 'Twitter/X',  medium: 'social' },
      'reddit.com':    { source: 'Reddit',     medium: 'social' },
      'youtube.com':   { source: 'YouTube',    medium: 'video' },
      'tiktok.com':    { source: 'TikTok',     medium: 'social' },
      'pinterest.com': { source: 'Pinterest',  medium: 'social' },
    };
    for (const [domain, info] of Object.entries(map)) {
      if (ref.includes(domain)) return { ...info, campaign: 'none' };
    }
    try {
      const host = new URL(ref).hostname;
      return { source: host, medium: 'referral', campaign: 'none' };
    } catch {
      return { source: 'unknown-referrer', medium: 'referral', campaign: 'none' };
    }
  }

  return { source: 'Direct', medium: 'none', campaign: 'none' };
}

function getDeviceInfo() {
  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android|iPhone/i.test(ua);
  const isTablet = /iPad|Tablet/i.test(ua) || (isMobile && window.innerWidth >= 768);

  let browser = 'Other';
  if (/Edg\//i.test(ua))          browser = 'Edge';
  else if (/OPR|Opera/i.test(ua)) browser = 'Opera';
  else if (/Chrome/i.test(ua))    browser = 'Chrome';
  else if (/Firefox/i.test(ua))   browser = 'Firefox';
  else if (/Safari/i.test(ua))    browser = 'Safari';

  let os = 'Other';
  if (/Windows/i.test(ua))          os = 'Windows';
  else if (/Mac OS X/i.test(ua))    os = 'macOS';
  else if (/Android/i.test(ua))     os = 'Android';
  else if (/iPhone|iPad/i.test(ua)) os = 'iOS';
  else if (/Linux/i.test(ua))       os = 'Linux';

  return {
    device:  isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop',
    browser,
    os,
    screen: `${window.screen.width}x${window.screen.height}`,
  };
}

export default function TawkToWidget() {
  useEffect(() => {
    // Store traffic source on first visit only
    if (!localStorage.getItem('trafficSource')) {
      localStorage.setItem('trafficSource', JSON.stringify({
        ...getTrafficSource(),
        landingPage: window.location.pathname,
        timestamp:   new Date().toISOString(),
        fullUrl:     window.location.href,
      }));
    }

    const injectTawkTo = () => {
      // Set up Tawk_API BEFORE injecting the script
      const tawkApi = (window as any).Tawk_API || {};
      (window as any).Tawk_API  = tawkApi;
      (window as any).Tawk_LoadTime = new Date();

      tawkApi.onLoad = function () {
        const sourceData = JSON.parse(localStorage.getItem('trafficSource') || '{}');
        const deviceInfo = getDeviceInfo();

        tawkApi.setAttributes(
          {
            'Source':       sourceData.source      || 'Direct',
            'Medium':       sourceData.medium      || 'none',
            'Campaign':     sourceData.campaign    || 'none',
            'Landing Page': sourceData.landingPage || '/',
            'First Visit':  sourceData.timestamp   || 'Unknown',
            'Device':       deviceInfo.device,
            'Browser':      deviceInfo.browser,
            'OS':           deviceInfo.os,
            'Screen':       deviceInfo.screen,
            'Current Page': window.location.pathname,
            'Full URL':     window.location.href,
          },
          (error: any) => { if (error) console.log('Tawk.to attr error:', error); }
        );
      };

      // Inject script the same way Tawk.to officially recommends
      const s1 = document.createElement('script');
      const s0 = document.getElementsByTagName('script')[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/64b56d7d94cf5d49dc6422c0/1h5ib7cm1';
      s1.charset = 'UTF-8';
      s0.parentNode?.insertBefore(s1, s0);
    };

    // Lazy load: first scroll OR 5s — whichever comes first
    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      injectTawkTo();
    };

    window.addEventListener('scroll', load, { passive: true, once: true });
    const timer = setTimeout(load, 5000);

    const updatePage = () => {
      const api = (window as any).Tawk_API;
      if (api?.setAttributes) {
        api.setAttributes({ 'Current Page': window.location.pathname }, () => {});
      }
    };
    window.addEventListener('popstate', updatePage);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', load);
      window.removeEventListener('popstate', updatePage);
    };
  }, []);

  return null;
}
