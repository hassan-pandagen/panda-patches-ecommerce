/**
 * Canonical normalizers for the product fields the CRM expects as discrete,
 * canonical values — NOT free-form, not "Custom X Patches", not buried in the
 * instructions text. Pure functions, safe on server and client.
 *
 * Canonical vocabulary (CRM handoff, June 2026):
 *   patchType : Embroidered | PVC | Woven | Chenille | Leather | Printed |
 *               Sequin | Silicone | 3D Embroidery Puff
 *   backing   : Iron on | Sew on | Sticker | Velcro
 *   border    : Merrow Border | Embroidery Border | Laser Cut | No Border
 */

export function canonicalPatchType(input: string | undefined | null): string | null {
  if (!input) return null;
  const s = input.toLowerCase();
  if (/\b3d\b|puff/.test(s)) return '3D Embroidery Puff';
  if (s.includes('embroider')) return 'Embroidered';
  if (s.includes('pvc') || s.includes('rubber')) return 'PVC';
  if (s.includes('woven')) return 'Woven';
  if (s.includes('chenille')) return 'Chenille';
  if (s.includes('leather')) return 'Leather';
  if (s.includes('sequin')) return 'Sequin';
  if (s.includes('silicone')) return 'Silicone';
  if (s.includes('print') || s.includes('sublimat') || s.includes('dye')) return 'Printed';
  // Unknown type — strip the noise words and title-case, so the CRM still gets a
  // clean value instead of "Custom X Patches".
  const cleaned = input.replace(/custom/ig, '').replace(/patches?/ig, '').trim();
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : null;
}

export function canonicalBacking(input: string | undefined | null): string | null {
  if (!input) return null;
  const s = input.toLowerCase();
  if (s.includes('velcro') || s.includes('hook') || s.includes('loop')) return 'Velcro';
  if (s.includes('iron')) return 'Iron on';
  if (s.includes('sew')) return 'Sew on';
  if (s.includes('stick') || s.includes('adhesive') || s.includes('peel')) return 'Sticker';
  const cleaned = input.trim();
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : null;
}

export function canonicalBorder(input: string | undefined | null): string | null {
  if (!input) return null;
  const s = input.toLowerCase();
  if (s.includes('merrow')) return 'Merrow Border';
  if (s.includes('laser') || s.includes('hot cut') || s.includes('hot-cut') || s.includes('die cut') || s.includes('die-cut')) return 'Laser Cut';
  if (s.includes('no border') || s.includes('no-border') || s.includes('borderless')) return 'No Border';
  if (s.includes('satin') || s.includes('embroider')) return 'Embroidery Border';
  return null;
}

/**
 * Pull a canonical border type out of free-form instructions (forms currently
 * embed it there instead of sending a discrete field). Matches an explicit
 * "Border: X" first, then specific border phrases — deliberately NOT a bare
 * "embroider" match, which would false-positive on any mention of embroidery.
 */
export function extractBorderFromText(text: string | undefined | null): string | null {
  if (!text) return null;
  const labelled = text.match(/border\s*[:\-]\s*([^\n|]+)/i);
  if (labelled) {
    const c = canonicalBorder(labelled[1]);
    if (c) return c;
  }
  const s = text.toLowerCase();
  if (s.includes('merrow')) return 'Merrow Border';
  if (s.includes('laser cut') || s.includes('laser-cut') || s.includes('hot cut') || s.includes('hot-cut') || s.includes('die cut') || s.includes('die-cut')) return 'Laser Cut';
  if (s.includes('no border') || s.includes('no-border') || s.includes('borderless')) return 'No Border';
  if (s.includes('satin border') || s.includes('embroidery border') || s.includes('embroidered border')) return 'Embroidery Border';
  return null;
}
