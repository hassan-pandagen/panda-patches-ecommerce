/**
 * The factory tour video (CEO, 2026-09-06). One source for every surface.
 *
 * EVERY FIGURE HERE WAS READ FROM YOUTUBE, NOT ASSUMED. Duration, upload date
 * and thumbnail were pulled from the video's own player metadata on 2026-09-06:
 * 88 seconds, published 2026-09-05, streams up to 2160x3840. The existing
 * `generateVideoObjectSchema` helper defaults a missing date to 2025-01-01 and a
 * missing duration to PT0M30S, which is how a made-up date ends up in structured
 * data; this file has no defaults, because a video whose real metadata we cannot
 * read is a video we should not be describing to Google.
 *
 * THE THUMBNAIL IS 16:9 AND THE VIDEO IS 9:16. YouTube renders a vertical frame
 * into a landscape thumbnail by centring it over a darkened, zoomed copy of
 * itself. Cropping to the centre recovers the real frame exactly, which is what
 * `object-cover` on a portrait container does — no cropped asset to maintain.
 */

export const FACTORY_VIDEO = {
  id: "iNgcyC6gYPY",
  /** Canonical watch URL. It is a Short, and the Shorts URL is what the CEO published. */
  contentUrl: "https://youtube.com/shorts/iNgcyC6gYPY",
  embedUrl: "https://www.youtube.com/embed/iNgcyC6gYPY",

  /**
   * The name the CEO specified for structured data.
   *
   * ⚠ IT DIFFERS FROM THE YOUTUBE TITLE, which is "How Custom Patches Are Made
   * — Full Factory Tour | Panda Patches". Google asks that `name` be the title
   * of the video, so these should be reconciled: either rename the video on
   * YouTube, or change this. Flagged 2026-09-06; using the specified name until
   * the CEO picks one.
   */
  name: "Inside Our Patch Factory: Embroidery, Chenille, PVC & Laser Leather",
  youtubeTitle: "How Custom Patches Are Made — Full Factory Tour | Panda Patches",

  description:
    "A walk through the Panda Patches production floor: our own facility in Pakistan, " +
    "operated by Panda Apparel & Technology. Computerized embroidery machines, digitally " +
    "controlled chenille, PVC moulding, and laser-engraved leather, ending in the stock " +
    "room where finished orders wait to ship. Production starts once you approve your mockup.",

  /** Read from the player metadata, 2026-09-06. 88 seconds. */
  duration: "PT1M28S",
  durationSeconds: 88,
  /** Player metadata publishDate, 2026-09-05T15:35:36-07:00. */
  uploadDate: "2026-09-05T15:35:36-07:00",

  /**
   * SCHEMA thumbnails: YouTube's own, 1280x720 and 480x360. These stay remote
   * because they are the video's canonical thumbnails and Google can fetch them.
   */
  thumbnailUrl: "https://i.ytimg.com/vi/iNgcyC6gYPY/maxresdefault.jpg",
  thumbnailFallback: "https://i.ytimg.com/vi/iNgcyC6gYPY/hqdefault.jpg",

  /**
   * RENDERED poster: the same frame, cropped to the vertical 405x720 and served
   * from our own origin. Three reasons it is not the remote thumbnail:
   *   - 68 KB instead of 157 KB, because 68% of that file was pillarbox we threw
   *     away, and next/image can serve it as WebP at the size actually needed;
   *   - no third-party request at all before the visitor clicks, so the facade
   *     is genuinely first-party rather than merely deferring YouTube's player;
   *   - a local file can go through the image optimizer, which a remote host
   *     cannot without being added to remotePatterns.
   * Cut from maxresdefault on 2026-09-06. If the video's thumbnail changes on
   * YouTube, re-cut this — it will not update itself.
   */
  poster: "/assets/factory-video-poster.jpg",
  posterWidth: 405,
  posterHeight: 720,

  /** Native stream aspect: 1080x1920. */
  aspect: "9 / 16",
} as const;

/**
 * VideoObject for the page that presents the video as its subject.
 *
 * ONLY EMIT THIS WHERE THE VIDEO IS THE MAIN CONTENT. In August 2026, emitting
 * VideoObject for decorative loops across 17 commercial pages produced 30
 * "Video isn't on a watch page" warnings in Search Console, and the fix was to
 * stop emitting it on pages where the video was incidental (see the note in
 * `Craftsmanship.tsx`). /about carries a dedicated section, a large player and
 * a written summary of what the video shows, so it clears that bar. The other
 * three placements are references beside other arguments and deliberately do
 * not emit it — flip `emitVideoSchema` per page if the CEO wants them to.
 */
export function factoryVideoSchema(orgId: string) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: FACTORY_VIDEO.name,
    description: FACTORY_VIDEO.description,
    thumbnailUrl: [FACTORY_VIDEO.thumbnailUrl, FACTORY_VIDEO.thumbnailFallback],
    uploadDate: FACTORY_VIDEO.uploadDate,
    duration: FACTORY_VIDEO.duration,
    contentUrl: FACTORY_VIDEO.contentUrl,
    embedUrl: FACTORY_VIDEO.embedUrl,
    publisher: { "@id": orgId },
  };
}
