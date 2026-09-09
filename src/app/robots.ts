import { MetadataRoute } from 'next';

// ── OPEN TO ALL (CEO decision, 9 Sept 2026) ─────────────────────────────────
// Everything is crawlable except /studio/ (the CMS) and /api/. Nothing else is
// blocked, for any agent.
//
// This REVERSES the July 2026 allow-list, which defaulted to deny and named the
// crawlers that mattered. That approach did keep out SEO scrapers, Bytespider,
// PetalBot and the rest — and it also meant every crawler nobody had thought to
// list got nothing, including new AI assistants as they appear. The CEO's call
// is that discovery is worth more than the crawl budget the scrapers cost.
//
// The named group below now grants nothing the default does not. It stays as
// documentation of which crawlers we actively want, and as the place a
// per-agent rule would go if one is ever needed again.
//
// IMPORTANT: robots.txt is a REQUEST, honored only by well-behaved bots. The
// crawlers below (Google, OpenAI, Anthropic, etc.) respect it. Data-center
// scrapers spoofing a "google.com" referrer do NOT read this file at all —
// stopping those requires the Vercel Firewall / WAF layer, not robots.txt.
//
// The /ai-info hub exists specifically to get cited by AI assistants, so every
// AI crawler below is allowed, not just search engines.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Real search engines — drive organic traffic.
        userAgent: [
          'Googlebot', 'bingbot', 'Applebot', 'DuckDuckBot',
          // Google's other verticals (video/news) plus the GSC/rich-results
          // testing tool and the catch-all "GoogleOther" used by various
          // Google product teams (audit CLAUDE_4.MD).
          'Googlebot-Video', 'Googlebot-News', 'GoogleOther',
          // Bing's non-primary crawlers — link-preview and ads-preview.
          'BingPreview', 'adidxbot',
          // OpenAI / ChatGPT
          'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
          // Anthropic / Claude
          'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
          // Perplexity
          'PerplexityBot', 'Perplexity-User',
          // xAI / Grok — real customers are arriving from Grok, so unblock its
          // crawlers (July 2026).
          'GrokBot', 'xAI-Crawler',
          // Other major AI assistants
          'Google-Extended', 'Applebot-Extended', 'Meta-ExternalAgent', 'Meta-ExternalFetcher',
          'Amazonbot', 'MistralAI-User', 'DuckAssistBot', 'cohere-ai', 'CCBot',
          // Independent search indexes — several ground AI assistants that
          // don't crawl on their own (audit CLAUDE_4.MD).
          'MojeekBot', 'YouBot', 'Kagibot', 'Diffbot', 'Bravebot',
          // Internet Archive / Wayback Machine — allowed so the site keeps a
          // public archival history (July 2026; also clears the PageSpeed
          // "blocked bot user agents" warning).
          'archive.org_bot', 'ia_archiver',
          // Third-party SEO tools — why third-party rank trackers under-report
          // the site if blocked (audit CLAUDE_4.MD).
          'AhrefsBot', 'SemrushBot',
          // Social / messaging link-preview bots (so shared links get a rich card)
          'facebookexternalhit', 'Twitterbot', 'LinkedInBot', 'Slackbot', 'Slackbot-LinkExpanding',
          'WhatsApp', 'Discordbot', 'TelegramBot', 'Pinterestbot', 'redditbot',
        ],
        allow: '/',
        // /_next/image was here until 9 Sept 2026 and should not have been.
        //
        // The reasoning was that ~30 optimizer URLs were showing in GSC with
        // impressions, so they looked like crawl waste. Two things were wrong
        // with that. Those impressions are image-search results, which for a
        // business selling a visual product is traffic, not waste. And blocking
        // the endpoint does not just hide those URLs — every <img> on the site
        // is served through it, so Googlebot was rendering every page with no
        // images at all, bingbot got none, and every AI crawler in this same
        // group saw a site of pure text. The separate image-bot rule below did
        // not save it: Googlebot-Image indexes images, it does not render pages.
        //
        // The general lesson: robots.txt controls CRAWLING, and noindex controls
        // INDEXING. Reaching for the first to achieve the second costs rendering.
        disallow: ['/studio/', '/api/'],
      },
      // Image & Shopping crawlers — every on-page <img> is served through
      // /_next/image, so blocking it here (like the general rule above) would
      // forfeit Google Images and free Google Shopping listings entirely for a
      // visual-product business. Google-InspectionTool needs it too so GSC's
      // URL Inspection / Rich Results Test previews render images instead of
      // showing them broken (audit CLAUDE_4.MD).
      {
        userAgent: ['Googlebot-Image', 'GoogleOther-Image', 'Storebot-Google', 'Google-InspectionTool'],
        allow: '/',
        disallow: ['/studio/', '/api/'],
      },
      // Everyone else — allowed, same as the named agents above.
      //
      // This was `disallow: '/'` until 9 Sept 2026, which denied every crawler
      // not explicitly listed. Opened on CEO instruction.
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/'],
      },
    ],
    sitemap: 'https://www.pandapatches.com/sitemap.xml',
  };
}
