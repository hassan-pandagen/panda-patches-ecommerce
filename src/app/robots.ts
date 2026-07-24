import { MetadataRoute } from 'next';

// ── ALLOW-LIST STRATEGY (July 2026) ─────────────────────────────────────────
// Previous approach: allow everything by default, block a growing list of
// known-bad scrapers one at a time (AhrefsBot, SemrushBot, MJ12bot, DotBot,
// PetalBot, Bytespider, ...) — a never-ending game of whack-a-mole.
//
// New approach: default DENY. Only the crawlers that actually matter (real
// search engines, real AI assistants, and social link-preview bots) are
// explicitly allowed; everything else gets nothing.
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
        disallow: [
          '/studio/',
          '/api/',
          // Image-optimizer endpoint URLs were getting indexed as separate "pages"
          // (~30 showing up in GSC with impressions/positions) — crawl waste, not
          // real content (audit P2-3). Image/Shopping-specific bots that actually
          // need to see the rendered photos get their own rule below instead of
          // being blanket-blocked here.
          '/_next/image',
        ],
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
      // Everyone else — unknown crawlers, SEO scrapers (DotBot, MJ12bot,
      // DataForSeoBot), Bytespider, PetalBot, etc. — denied.
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
    sitemap: 'https://www.pandapatches.com/sitemap.xml',
  };
}
