import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import dynamic from "next/dynamic";
import { generateEntityGraph, generateSchemaScript } from "@/lib/schemas";
import AttributionCapture from "@/components/AttributionCapture";

// Lazy load non-critical components
const TawkToWidget = dynamic(() => import("@/components/TawkToWidget"), { ssr: true });
const CallNowPopup = dynamic(() => import("@/components/CallNowPopup"), { ssr: true });

// Configure Outfit Font — display:"optional" prevents font-swap CLS across the
// whole site. Browser waits ~100ms for Outfit; if it arrives, use it, otherwise
// keep the size-adjusted Arial fallback permanently for that pageview. Eliminates
// all font-swap layout shifts (the main cause of our 0.35+ mobile CLS).
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "optional",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.pandapatches.com'),
  title: "Panda Patches | Custom Iron On Patches",
  description: "Order custom embroidered patches, iron-on patches, PVC patches with low minimums. Free design services, 7-14 day delivery. 1,000,000+ patches delivered. No setup fees!",
  alternates: {
    canonical: 'https://www.pandapatches.com',
    languages: {
      'en': 'https://www.pandapatches.com',
      'x-default': 'https://www.pandapatches.com',
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Panda Patches | Custom Iron On Patches",
    description: "Order custom embroidered patches, iron-on patches, PVC patches with low minimums. Free design services, 7-14 day delivery. 1,000,000+ patches delivered.",
    images: ["https://www.pandapatches.com/assets/og-image.png"],
  },
  icons: {
    icon: [
      { url: '/assets/favicon.ico' },
      { url: '/assets/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'p:domain_verify': 'a1f1a74375f469fe6f624c0d05124c48',
    'fb:app_id': '974142685417232',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline critical CSS — eliminates one render-blocking network request */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root{--foreground-rgb:0,0,0;--background-start-rgb:249,250,245;--background-end-rgb:255,255,255}
          *{margin:0;padding:0;box-sizing:border-box}
          html{font-family:var(--font-outfit),system-ui,sans-serif;color:rgb(var(--foreground-rgb));background:linear-gradient(to bottom,transparent,rgb(var(--background-end-rgb))) rgb(var(--background-start-rgb))}
          img{display:block;max-width:100%;height:auto}
          a{text-decoration:none;color:inherit}
          button{cursor:pointer;border:none;font-family:inherit}
          .container{width:100%;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem}
          @media(min-width:768px){.container{padding-left:1.5rem;padding-right:1.5rem}}
          @media(min-width:1024px){.container{padding-left:3rem;padding-right:3rem}}
          header{position:sticky;top:0;z-index:50;width:100%;background:#fff;border-bottom:1px solid #e5e7eb}
          html.ann-dismissed #announcement-bar{display:none}
          .hero-section{position:relative;width:100%;min-height:100vh;background:#fff;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-start}
          @media(min-width:768px){.hero-section{min-height:850px;justify-content:center}}
        ` }} />
         {/* No-flash: hide the announcement bar PRE-PAINT for users who already
             dismissed it, so the SSR'd bar never has to be removed client-side
             (which would shift the page). New users keep it from first paint.
             Mirrors the next-themes no-flash pattern; runs synchronously in head. */}
         <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('announcement_dismissed_v4'))document.documentElement.classList.add('ann-dismissed')}catch(e){}` }} />
         {/* DNS prefetch to Sanity image CDN (preconnect dropped, unused on home) */}
         <link rel="dns-prefetch" href="https://cdn.sanity.io" />
         {/* Preconnect to Tawk.to embed (va.tawk.to preconnect dropped, unused on home) */}
         <link rel="preconnect" href="https://embed.tawk.to" crossOrigin="" />
         <link rel="dns-prefetch" href="https://embed.tawk.to" />
         <link rel="dns-prefetch" href="https://va.tawk.to" />
         {/* The homepage hero/LCP image is a Sanity-sourced Next/Image with priority,
             which emits its own preload — no manual hero preload needed here. */}
       </head>
      <body className={`${outfit.variable} font-sans antialiased`} suppressHydrationWarning>

        {/* GTM Noscript Fallback (must be first in body) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KQQQ674D"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {/* Global entity graph — Organization + Brand + WebSite + Person (founder)
            linked by @id so engines/LLMs resolve one entity, not four islands.
            knowsAbout + makesOffer encode the brand's core semantic triples. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateSchemaScript(generateEntityGraph())}
        />

        {children}

        {/* Non-critical CSS — injected via JS after render to avoid render-blocking <link>.
            Covers: FAQ accordion, custom scrollbar, Tawk bubble styles, fade-in animation.
            These styles are all below-fold or for third-party widgets. */}
        <Script id="non-critical-css" strategy="afterInteractive">
          {`(function(){var s=document.createElement('style');s.textContent='.faq-wrapper{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s ease,opacity .3s ease;opacity:0}.faq-wrapper.open{grid-template-rows:1fr;opacity:1}.faq-inner{overflow:hidden;min-height:0}::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:#051C05}::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#DFFF00,#3B7E00);border-radius:10px}::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,#e8ff33,#4a9e00)}@keyframes fade-in{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}.animate-fade-in{animation:fade-in .3s ease-out}';document.head.appendChild(s)})();`}
        </Script>

        {/* gtag + dataLayer stub defined immediately (afterInteractive) so every
            conversion/event call (PurchaseConversion, Tawk chat, form Leads) has a
            target and queues into dataLayer safely. This is near-zero work; the heavy
            gtm.js load itself is deferred below. */}
        <Script id="gtm-stub" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}`}
        </Script>
        {/* Deferred marketing/analytics tags — interaction-gated to protect the critical
            LCP/INP window without losing tracking on fast bounces:
              • GTM (GA4 + Google Ads):                first interaction OR 2s
              • Meta Pixel: first interaction OR 3s
            A single interaction handler (scroll/click/touchstart/mousemove/keydown) fires
            BOTH groups immediately, so any active user beats both timers. With no
            interaction, GTM lands at 2s (fast bounces still count in GA4) and the heavier
            retargeting pixels hold until 3s. Each group has its own once-guard so the timer
            and interaction paths never double-load, and the heavy script injection runs
            inside requestIdleCallback. Conversion EVENTS (Lead, InitiateCheckout, Purchase)
            still fire on user actions and are mirrored server-side via Meta CAPI. Tawk.to is
            intentionally excluded (loads on its own, unchanged). No CSP change (same domains). */}
        <Script id="deferred-tags" strategy="afterInteractive">
          {`(function(){var w=window,d=document;var ric=w.requestIdleCallback||function(cb){return setTimeout(cb,1)};var gtmDone=false,pxDone=false;
function loadGtm(){if(gtmDone)return;gtmDone=true;ric(function(){try{(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;if(f&&f.parentNode){f.parentNode.insertBefore(j,f);}else{d.head.appendChild(j);}})(w,d,'script','dataLayer','GTM-KQQQ674D');}catch(e){}});}
function loadPixels(){if(pxDone)return;pxDone=true;ric(function(){try{!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];if(s&&s.parentNode){s.parentNode.insertBefore(t,s);}else{b.head.appendChild(t);}}(w,d,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1515101469424765');fbq('track','PageView');}catch(e){}});}
function fireAll(){loadGtm();loadPixels();}
var evts=['scroll','click','touchstart','mousemove','keydown'];
function onInteract(){evts.forEach(function(e){d.removeEventListener(e,onInteract,{capture:true});});fireAll();}
evts.forEach(function(e){d.addEventListener(e,onInteract,{capture:true,once:true,passive:true});});
setTimeout(loadGtm,2000);setTimeout(loadPixels,3000);})();`}
        </Script>

        {/* Captures Meta/Google attribution (fbp, fbc, gclid, utm_*) on every page load */}
        <AttributionCapture />

        {/* Tawk.to Live Chat with Advanced Tracking */}
        <TawkToWidget />

        {/* Call Now Popup — appears after 60s of browsing */}
        <CallNowPopup />

      </body>
    </html>
  );
}
