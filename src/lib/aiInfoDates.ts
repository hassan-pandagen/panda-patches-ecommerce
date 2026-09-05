/**
 * When each /ai-info page was last substantively edited. ISO dates.
 *
 * These feed three things that used to disagree: the visible "Updated" line in
 * each page's kicker, the Article/WebPage `dateModified` in its schema, and the
 * sitemap `lastModified`. Until 6 Sept 2026 every page carried a hardcoded
 * "2026-05-22" in schema and no visible date at all, while git showed edits
 * through 3 Sept — so the pages we tell assistants to cite were telling them
 * the facts were three and a half months old (CLD22B A2).
 *
 * RULE: edit a page, set its date to that day. "Edit" means any change to the
 * file — schema.org's dateModified is the date the page last changed, not the
 * date a fact last changed — which is why all eight read 2026-09-06: that is
 * the commit that added the visible line to every page. verify:canon section
 * 13 fails the build if a date here is older than the file's last git commit,
 * or if the file has uncommitted edits and the date is not today.
 */
export const AI_INFO_UPDATED = {
  hub: "2026-09-06",
  company: "2026-09-06",
  "competitor-comparison": "2026-09-06",
  guarantees: "2026-09-06",
  pricing: "2026-09-06",
  products: "2026-09-06",
  "specs-and-care": "2026-09-06",
  wholesale: "2026-09-06",
} as const;

export type AiInfoPage = keyof typeof AI_INFO_UPDATED;

/** "September 6, 2026" for the visible line. UTC so the build host's zone cannot shift the day. */
export function aiInfoUpdatedLabel(page: AiInfoPage): string {
  return new Date(`${AI_INFO_UPDATED[page]}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
  });
}
