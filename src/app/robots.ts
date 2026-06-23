import { MetadataRoute } from 'next';

// AI policy (as of May 2026): the /ai-info hub exists specifically to get cited by
// AI assistants. Blocking the same crawlers would prevent the citations we want.
// All AI bots (training and browsing) are explicitly allowed below.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow everything except admin / api / cart-state endpoints
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/studio/',
          '/api/',
        ],
      },
      // Explicit allow for AI bots (some crawlers honor explicit allow over wildcard)
      { userAgent: 'GPTBot', allow: '/' },                  // OpenAI training
      { userAgent: 'OAI-SearchBot', allow: '/' },           // OpenAI live search
      { userAgent: 'ChatGPT-User', allow: '/' },            // ChatGPT browse
      { userAgent: 'anthropic-ai', allow: '/' },            // Anthropic training (legacy name)
      { userAgent: 'ClaudeBot', allow: '/' },               // Anthropic training (current name)
      { userAgent: 'Claude-Web', allow: '/' },              // Claude browse
      { userAgent: 'PerplexityBot', allow: '/' },           // Perplexity index + browse
      { userAgent: 'Perplexity-User', allow: '/' },         // Perplexity user-initiated browse
      { userAgent: 'Google-Extended', allow: '/' },         // Gemini / AI Overviews training
      { userAgent: 'CCBot', allow: '/' },                   // Common Crawl
      { userAgent: 'Applebot-Extended', allow: '/' },       // Apple Intelligence training
      { userAgent: 'Meta-ExternalAgent', allow: '/' },      // Meta AI
      { userAgent: 'cohere-ai', allow: '/' },               // Cohere training
      { userAgent: 'Amazonbot', allow: '/' },               // Amazon Alexa / AI
      { userAgent: 'Bytespider', allow: '/' },              // ByteDance / TikTok
      { userAgent: 'Bravebot', allow: '/' },                // Brave Search index (also feeds some AI answers)
    ],
    sitemap: 'https://www.pandapatches.com/sitemap.xml',
  };
}
