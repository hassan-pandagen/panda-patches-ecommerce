# Tawk.to Widget Setup Guide

## Overview
Your website now has a Tawk.to chat widget with advanced referral tracking that automatically detects where your visitors are coming from, including:

- **Social Media**: Facebook, Instagram, Twitter/X, LinkedIn, TikTok, Pinterest, Reddit, YouTube, WhatsApp, Telegram, Snapchat
- **AI/LLM Platforms**: ChatGPT, Claude AI, Google Gemini, Microsoft Copilot, Perplexity AI, You.com, Poe, Character AI
- **Search Engines**: Google, Bing, Yahoo, DuckDuckGo, Baidu
- **Direct Traffic & Other Sources**: Direct visits, referrals, UTM parameters

## Setup Instructions

### 1. Get Your Tawk.to Credentials

1. Go to [Tawk.to](https://www.tawk.to/) and sign up or log in
2. Create a new property or select an existing one
3. Go to **Administration** > **Channels** > **Chat Widget**
4. Find your credentials:
   - **Property ID**: Found in the embed code (looks like `5a7c8d9e123abc456def789`)
   - **Widget ID**: Usually `default` or a custom ID you created

### 2. Configure the Widget

Open the file: `src/components/TawkToWidget.tsx`

Find these lines (around line 9-10):

```typescript
const TAWK_PROPERTY_ID = 'YOUR_TAWK_PROPERTY_ID'; // e.g., '5a7c8d9e123abc456def789'
const TAWK_WIDGET_ID = 'YOUR_TAWK_WIDGET_ID'; // e.g., 'default'
```

Replace with your actual credentials:

```typescript
const TAWK_PROPERTY_ID = '65abc123def456789'; // Your actual Property ID
const TAWK_WIDGET_ID = 'default'; // Your actual Widget ID
```

### 3. Test the Widget

1. Save the file
2. Start your development server: `npm run dev`
3. Visit your website
4. The Tawk.to chat widget should appear in the bottom-right corner
5. Open your browser's console (F12) to see referral tracking logs

## How the Tracking Works

### Visitor Attributes Captured

When a visitor lands on your site, the following information is automatically captured and sent to Tawk.to:

- **Referral Source**: The platform they came from (e.g., "Facebook", "ChatGPT", "Google Search")
- **Referral Details**: Additional context (e.g., "Facebook Ad", "Google Organic")
- **Full Referrer URL**: The complete URL they came from
- **Landing Page**: The first page they visited on your site
- **User Agent**: Browser and device information
- **Visit Time**: When they arrived

### Tags Applied

Visitors are automatically tagged for easy filtering in Tawk.to:

- Social media visitors: `facebook`, `instagram`, etc.
- AI/LLM visitors: `chatgpt`, `claude`, `gemini`, `copilot`, `ai`, `llm`
- Search engine visitors: `google`, etc.

### Viewing Referral Data in Tawk.to

1. Log in to your Tawk.to dashboard
2. Go to **Monitoring** or **Visitors**
3. Click on any visitor to see their attributes
4. You'll see all the tracking data under "Visitor Info" or "Attributes"
5. Use tags to filter visitors (e.g., show only ChatGPT visitors)

## Advanced Customization

### Add More Platforms

To track additional platforms, edit `src/components/TawkToWidget.tsx` and add detection logic:

```typescript
else if (referrer.includes('yourplatform.com')) {
  source = 'Your Platform';
  details = 'Description';
}
```

### Track UTM Parameters

The widget automatically detects UTM parameters from your marketing campaigns:

Example URL: `https://yoursite.com?utm_source=newsletter&utm_medium=email`

This will be tracked as:
- Source: "UTM: newsletter"
- Details: "Medium: email"

### Custom Tags

Add custom tags in the `onLoad` function:

```typescript
(window as any).Tawk_API.addTags(['custom-tag', 'another-tag'], function(error: any) {});
```

## Troubleshooting

### Widget Not Appearing

1. Check that you've entered the correct Property ID and Widget ID
2. Check browser console for errors
3. Ensure your Tawk.to widget is enabled in the dashboard
4. Try clearing browser cache

### Referral Data Not Showing

1. Check that the visitor came from an external site (direct visits won't have referrer)
2. Some browsers block referrer data for privacy
3. Check the browser console for tracking logs
4. Verify in Tawk.to dashboard under visitor attributes

### Testing Referral Sources

To test different referral sources:

1. Use a URL shortener or create test links
2. Add `?utm_source=test` to your URL
3. Use browser extensions to spoof referrer
4. Check sessionStorage in browser dev tools: `sessionStorage.getItem('tawk_referral')`

## Privacy Considerations

- Referral tracking respects browser privacy settings
- No personal information is collected beyond what the visitor chooses to share
- The widget complies with Tawk.to's privacy policy
- Consider adding a privacy notice about chat and tracking to your site

## Support

For Tawk.to specific issues, visit: https://help.tawk.to/
For widget customization help, refer to: https://developer.tawk.to/

## Notes

- The widget persists across page navigations in Next.js
- Referral data is stored in sessionStorage and sent only once per session
- The component is client-side only (`'use client'` directive)
- No visual component is rendered (returns `null`)
