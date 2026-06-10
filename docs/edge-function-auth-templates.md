# 4 New Template IDs for the `send-email` Edge Function

These templates power the **customer portal auth emails** on pandapatches.com
(signup confirmation, magic-link sign-in, password reset, email change). They
follow the **same style as the existing `CUSTOMER_WELCOME_INVITE` /
`CUSTOMER_PASSWORD_RESET` / `CUSTOMER_RETURNING_LOGIN` templates** — same
header, same button, same Instagram promo, same sign-off pattern.

The customer portal calls the function with this shape:

```json
{
  "to": "customer@example.com",
  "template_id": "WEBSITE_AUTH_MAGIC_LINK",
  "dynamic_data": {
    "customer_name": "Hassan",
    "portal_action_url": "https://www.pandapatches.com/auth/callback?token=...",
    "expires_in_minutes": 60
  }
}
```

The Edge Function already handles `portal_action_url` correctly for buttons
(line search for `data.portal_action_url` in the existing builder), so the
"Set Your Password →" / "Pay Now →" CTA wiring already works for these 4.

---

## 1. Add these 4 entries to `subjects` (in `getEmailSubject`)

Find the existing block that starts with:

```js
const subjects: Record<string, string> = {
  // Quote templates
  'd-fcd19c2e3d2d42a4b0e1bf3087179c7d': `Your Custom Patch Quote - ${orderNumber}`,
  // ...
```

Add these 4 lines anywhere inside the object (suggest a new section labeled
`// Website auth templates`):

```js
    // Website auth templates (pandapatches.com customer portal)
    'WEBSITE_AUTH_SIGNUP_CONFIRM':  'Confirm your Panda Patches account',
    'WEBSITE_AUTH_MAGIC_LINK':      'Your sign-in link for Panda Patches',
    'WEBSITE_AUTH_PASSWORD_RESET':  'Reset your Panda Patches password',
    'WEBSITE_AUTH_EMAIL_CHANGE':    'Confirm your new Panda Patches email',
```

---

## 2. Add these 4 entries to `messages` (in `getTemplateMessage`)

Find the existing block that starts with:

```js
const messages: Record<string, string> = {
  // Quote templates
  'd-fcd19c2e3d2d42a4b0e1bf3087179c7d': 'Here\'s the quote you requested...',
  // ...
```

Add these 4 lines anywhere inside the object:

```js
    // Website auth templates (pandapatches.com customer portal)
    'WEBSITE_AUTH_SIGNUP_CONFIRM':
      'Thanks for creating a Panda Patches account! To finish setting up your account, please confirm your email address by clicking the button below. Once confirmed you can track every order in real time, view your mockups, and reorder past designs in one click.',

    'WEBSITE_AUTH_MAGIC_LINK':
      'Use the button below to sign in to your Panda Patches account. This link signs you in instantly — no password needed. The link is good for the next 60 minutes and can only be used once.',

    'WEBSITE_AUTH_PASSWORD_RESET':
      'We received a request to reset the password for your Panda Patches account. Click the button below to set a new password. The link is good for the next 60 minutes and can only be used once. If you did not request this, you can ignore this email — your password will stay the same.',

    'WEBSITE_AUTH_EMAIL_CHANGE':
      `We received a request to change the email address on your Panda Patches account to ${data?.new_email || 'a new address'}. Confirm the change by clicking the button below. The change does not take effect until you click the link. If you did not request this, you can ignore this email.`,
```

---

## 3. Add these 4 entries to `shouldShowFullDetails` (in the existing helper)

The auth emails do NOT need the "Order Details" two-column block. Add them
to the existing `minimalDetailsTemplates` array so the function skips that
section. Find this block:

```js
const minimalDetailsTemplates = [
  'CUSTOMER_SHIPPED',
  // ...
  'CUSTOMER_WELCOME_INVITE',
  'CUSTOMER_RETURNING_LOGIN',
  'CUSTOMER_PASSWORD_RESET',
  // ...
];
```

Add these 4 to the array:

```js
  'WEBSITE_AUTH_SIGNUP_CONFIRM',
  'WEBSITE_AUTH_MAGIC_LINK',
  'WEBSITE_AUTH_PASSWORD_RESET',
  'WEBSITE_AUTH_EMAIL_CHANGE',
```

---

## 4. (Optional) Add to button-label switch in the CTA section

In your existing button section (search for `Set Your Password &rarr;`),
the ternary that picks the button label looks like:

```js
${templateId === 'CUSTOMER_WELCOME_INVITE' ? 'Set Your Password &rarr;'
  : templateId === 'CUSTOMER_PASSWORD_RESET' ? 'Reset Password &rarr;'
  : templateId === 'CUSTOMER_PAYMENT_LINK' ? 'Pay Now &rarr;'
  : 'Log In &amp; Track Order &rarr;'}
```

Extend it to cover the new template IDs so each button reads naturally:

```js
${templateId === 'CUSTOMER_WELCOME_INVITE' ? 'Set Your Password &rarr;'
  : templateId === 'CUSTOMER_PASSWORD_RESET' ? 'Reset Password &rarr;'
  : templateId === 'CUSTOMER_PAYMENT_LINK' ? 'Pay Now &rarr;'
  : templateId === 'WEBSITE_AUTH_SIGNUP_CONFIRM' ? 'Confirm My Email &rarr;'
  : templateId === 'WEBSITE_AUTH_MAGIC_LINK' ? 'Sign In To My Account &rarr;'
  : templateId === 'WEBSITE_AUTH_PASSWORD_RESET' ? 'Reset My Password &rarr;'
  : templateId === 'WEBSITE_AUTH_EMAIL_CHANGE' ? 'Confirm Email Change &rarr;'
  : 'Log In &amp; Track Order &rarr;'}
```

Also extend the `(templateId === ... || ...)` guard above the button block
that decides whether the CTA renders. Find:

```js
${(templateId === 'CUSTOMER_WELCOME_INVITE' || templateId === 'CUSTOMER_RETURNING_LOGIN' || templateId === 'CUSTOMER_PASSWORD_RESET' || templateId === 'CUSTOMER_PAYMENT_LINK') && data.portal_action_url ? `
```

Change to:

```js
${(templateId === 'CUSTOMER_WELCOME_INVITE'
  || templateId === 'CUSTOMER_RETURNING_LOGIN'
  || templateId === 'CUSTOMER_PASSWORD_RESET'
  || templateId === 'CUSTOMER_PAYMENT_LINK'
  || templateId === 'WEBSITE_AUTH_SIGNUP_CONFIRM'
  || templateId === 'WEBSITE_AUTH_MAGIC_LINK'
  || templateId === 'WEBSITE_AUTH_PASSWORD_RESET'
  || templateId === 'WEBSITE_AUTH_EMAIL_CHANGE') && data.portal_action_url ? `
```

---

## Dynamic data the Next.js side will send

| template_id | dynamic_data fields |
|---|---|
| `WEBSITE_AUTH_SIGNUP_CONFIRM` | `customer_name`, `portal_action_url` |
| `WEBSITE_AUTH_MAGIC_LINK` | `customer_name`, `portal_action_url` |
| `WEBSITE_AUTH_PASSWORD_RESET` | `customer_name`, `portal_action_url` |
| `WEBSITE_AUTH_EMAIL_CHANGE` | `customer_name`, `portal_action_url`, `new_email` |

`customer_name` falls back to the email prefix if no name is available.

---

## Deploy steps (you, ~3 minutes)

1. Open the `send-email` Edge Function in Supabase Dashboard → Edge Functions
2. Make the 4 additions above (subjects, messages, shouldShowFullDetails, button switch)
3. **Deploy** the function
4. Tell me "deployed" and I'll wire the Next.js side

That's it — same template builder, same brand identity, no duplicate template
maintenance.
