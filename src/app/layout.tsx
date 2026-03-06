import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./critical.css";
import Script from "next/script";
import dynamic from "next/dynamic";
import { generateOrganizationSchema, generateWebSiteSchema, generateSchemaScript } from "@/lib/schemas";

// Lazy load non-critical components
const TawkToWidget = dynamic(() => import("@/components/TawkToWidget"), { ssr: false });
const CallNowPopup = dynamic(() => import("@/components/CallNowPopup"), { ssr: false });

// Configure Outfit Font
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://pandapatches.com'),
  title: "Panda Patches | Custom Iron On Patches",
  description: "Order custom embroidered patches, iron-on patches, PVC patches with low minimums. Free design services, 7-14 day delivery. 4.8★ rated on Trustpilot. No setup fees!",
  twitter: {
    card: "summary_large_image",
    title: "Panda Patches | Custom Iron On Patches",
    description: "Order custom embroidered patches, iron-on patches, PVC patches with low minimums. Free design services, 7-14 day delivery. 4.8★ rated on Trustpilot.",
    images: ["https://pandapatches.com/assets/og-image.png"],
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
         {/* Preconnect to image CDN — critical for LCP hero image */}
         <link rel="preconnect" href="https://cdn.sanity.io" />
         
         {/* Defer non-critical CSS (Tailwind utilities, animations, etc.) */}
         <link
           rel="stylesheet"
           href="./globals.css"
           media="print"
           onLoad={(e) => {
             const target = e.target as HTMLLinkElement;
             target.media = 'all';
           }}
         />
         {/* Fallback for no-JS */}
         <noscript>
           <link rel="stylesheet" href="./globals.css" />
         </noscript>
       </head>
      <body className={`${outfit.variable} font-sans antialiased`}>

        {/* GTM Noscript Fallback (must be first in body) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KQQQ674D"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {/* Global Organization Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateSchemaScript(generateOrganizationSchema())}
        />
        {/* WebSite Schema for Sitelinks + Search Box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateSchemaScript(generateWebSiteSchema())}
        />

        {children}

        {/* Google Tag Manager — deferred to lazyOnload (loads after everything else) */}
        <Script id="gtm" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KQQQ674D');`}
        </Script>

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1515101469424765');
fbq('track', 'PageView');`}
        </Script>

        {/* Bing UET */}
        <Script id="bing-uet" strategy="lazyOnload">
          {`(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"97147013"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");`}
        </Script>

        {/* Google Ads Tag — deferred to lazyOnload (not critical for LCP) */}
        <Script
          id="google-ads-tag"
          src="https://www.googletagmanager.com/gtag/js?id=AW-11221237770"
          strategy="lazyOnload"
        />
        <Script id="google-ads-init" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-11221237770');`}
        </Script>

        {/* Trustpilot Widget Script */}
        <Script
          id="trustpilot"
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          strategy="lazyOnload"
        />

        {/* Tawk.to Live Chat with Advanced Tracking */}
        <TawkToWidget />

        {/* Call Now Popup — appears after 60s of browsing */}
        <CallNowPopup />

      </body>
    </html>
  );
}
