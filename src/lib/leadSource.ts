/**
 * Lead-source + traffic-channel derivation, shared by the quote form handler
 * (/api/quote) and the tracked email link (TrackedEmailLink). Keeping these in
 * one place means a direct-email quote is labelled exactly like a form quote, so
 * the team reads "Source" and "Traffic" the same way no matter how the lead came
 * in. Pure functions — safe to import on both server and client.
 */

export function deriveLeadSource(
  pageUrl: string | undefined,
  isBulkOrder: boolean | undefined,
  hasBasePrice: boolean,
): string {
  if (isBulkOrder) return 'Bulk Order Form';
  if (!pageUrl) return hasBasePrice ? 'Product Calculator' : 'Website Form';

  let path = '';
  try {
    path = new URL(pageUrl).pathname.toLowerCase();
  } catch {
    path = pageUrl.toLowerCase();
  }

  if (path === '/' || path === '') return 'Homepage Hero Form';
  // Panda AI generator funnel (WEBSIT_4.MD G6). Checked before the generic
  // /custom- prefix so it never falls into "Industry Page".
  if (path.startsWith('/ai-patch-generator')) return 'AI Patch Generator';
  if (path.startsWith('/custom-patches/')) {
    const type = path.replace('/custom-patches/', '').replace(/\/$/, '').split('/')[0];
    if (type) return `${type.charAt(0).toUpperCase() + type.slice(1)} Product Page`;
  }
  if (path.startsWith('/contact')) return 'Contact Page';
  if (path.startsWith('/offers')) return 'Offers Page';
  if (path.startsWith('/bulk')) return 'Bulk Order Form';
  if (path.startsWith('/blog/')) {
    const slug = path.replace('/blog/', '').replace(/\/$/, '');
    return slug ? `Blog: ${slug}` : 'Blog';
  }
  if (path.startsWith('/custom-')) {
    const slug = path.replace(/^\//, '').replace(/\/$/, '');
    return `Industry Page: ${slug}`;
  }

  return `Page: ${path}`;
}

export function deriveTrafficSource(attribution: Record<string, any> | undefined): string {
  if (!attribution) return 'Direct / Unknown';

  const { gclid, fbclid, utm_source, utm_medium, utm_campaign, referrer } = attribution;

  if (gclid) {
    const campaign = utm_campaign ? ` (${utm_campaign})` : '';
    return `Google Ads${campaign}`;
  }
  // fbclid means the click came from a Meta property (Facebook / Instagram /
  // Messenger). Meta stamps it on BOTH organic and paid links, so it alone does
  // NOT prove "ad". The only reliable paid signal is a UTM tag on the ad URL
  // (utm_medium=paid/cpc, or a utm_source like "fb"/"..._ads"). With that we
  // call it Ads; without it we treat it as organic instead of the old vague
  // "Facebook Click". Platform (Facebook vs Instagram) comes from utm_source or
  // the referrer.
  if (fbclid) {
    const src = (utm_source || '').toLowerCase();
    const med = (utm_medium || '').toLowerCase();
    const isPaid =
      med === 'paid' || med.includes('cpc') || med.includes('ppc') || med === 'paid_social' ||
      src.includes('fb') || src.includes('paid');
    let refHost = '';
    try { refHost = new URL(referrer || '').hostname.toLowerCase(); } catch { refHost = (referrer || '').toLowerCase(); }
    const platform = src.includes('insta') || refHost.includes('instagram') ? 'Instagram' : 'Facebook';
    const campaign = utm_campaign ? ` (${utm_campaign})` : '';
    return isPaid ? `${platform} Ads${campaign}` : `${platform} (Organic)`;
  }
  if (utm_source) {
    const src = utm_source.toLowerCase();
    const medium = (utm_medium || '').toLowerCase();
    // Proper display names so "tiktok"/"linkedin" read correctly, and a paid
    // medium (cpc/paid/ppc) yields "<Channel> Ads" for TikTok, LinkedIn,
    // Pinterest, etc. exactly like Facebook/Google.
    const NICE: Record<string, string> = {
      facebook: 'Facebook', fb: 'Facebook', meta: 'Meta', instagram: 'Instagram', ig: 'Instagram',
      google: 'Google', youtube: 'YouTube', tiktok: 'TikTok', linkedin: 'LinkedIn',
      pinterest: 'Pinterest', bing: 'Bing', microsoft: 'Microsoft', reddit: 'Reddit',
      twitter: 'Twitter / X', x: 'Twitter / X', snapchat: 'Snapchat',
    };
    let label = NICE[src] || (utm_source.charAt(0).toUpperCase() + utm_source.slice(1));
    if (medium.includes('cpc') || medium.includes('paid') || medium === 'ppc') label += ' Ads';
    else if (medium === 'email') label += ' Email';
    else if (medium === 'social') label += ' Social';
    if (utm_campaign) label += ` (${utm_campaign})`;
    return label;
  }
  if (referrer) {
    let host = '';
    try {
      host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, '');
    } catch {
      host = referrer.toLowerCase();
    }
    if (host.includes('chatgpt.com') || host.includes('chat.openai.com') || host.includes('openai.com')) return 'ChatGPT';
    if (host.includes('claude.ai') || host.includes('anthropic.')) return 'Claude';
    if (host.includes('perplexity.')) return 'Perplexity';
    if (host.includes('gemini.google.') || host.includes('bard.google.')) return 'Gemini';
    if (host.includes('copilot.microsoft.') || host.includes('bing.com/chat')) return 'Bing Copilot';
    if (host.includes('you.com')) return 'You.com';
    if (host.includes('grok.x.') || host.includes('grok.com')) return 'Grok';
    if (host.includes('meta.ai')) return 'Meta AI';
    if (host.includes('deepseek.')) return 'DeepSeek';
    if (host.includes('google.')) return 'Google (Organic)';
    if (host.includes('bing.')) return 'Bing (Organic)';
    if (host.includes('duckduckgo.')) return 'DuckDuckGo (Organic)';
    if (host.includes('yahoo.')) return 'Yahoo (Organic)';
    if (host.includes('facebook.') || host.includes('fb.com') || host.includes('m.facebook')) return 'Facebook (Organic)';
    if (host.includes('instagram.')) return 'Instagram';
    if (host.includes('messenger.') || host.includes('m.me')) return 'Messenger';
    if (host.includes('t.co') || host.includes('twitter.') || host.includes('x.com')) return 'Twitter / X';
    if (host.includes('linkedin.')) return 'LinkedIn';
    if (host.includes('reddit.')) return 'Reddit';
    if (host.includes('youtube.')) return 'YouTube';
    if (host.includes('pinterest.')) return 'Pinterest';
    if (host.includes('tiktok.')) return 'TikTok';
    if (host && host !== 'pandapatches.com') return `Referral: ${host}`;
  }
  return 'Direct / Unknown';
}
