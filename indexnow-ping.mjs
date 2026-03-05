// IndexNow ping — run with: node indexnow-ping.mjs
// WARNING: Only ping NEW or UPDATED URLs. Do NOT run the full list repeatedly.
// Pinging the same URLs daily risks Bing blacklisting the domain.
// Rule: add new URLs here, ping once after deployment, done.

const KEY  = "691f8f86a172454aa3696b3d2407ff46";
const HOST = "pandapatches.com";
const BASE = `https://${HOST}`;

const urls = [
  // Core pages
  `${BASE}/`,
  `${BASE}/custom-patches`,
  `${BASE}/bulk-custom-patches`,
  `${BASE}/custom-products`,
  `${BASE}/blogs`,
  `${BASE}/about`,
  `${BASE}/contact`,
  `${BASE}/sample-box`,

  // Specialty patch pages
  `${BASE}/custom-police-patches`,
  `${BASE}/custom-sports-patches`,
  `${BASE}/custom-corporate-patches`,
  `${BASE}/custom-fire-department-patches`,
  `${BASE}/custom-chenille-glitter-patches`,
  `${BASE}/custom-chenille-tpu-patches`,

  // Product pages (patch types)
  `${BASE}/custom-patches/embroidered`,
  `${BASE}/custom-patches/woven`,
  `${BASE}/custom-patches/pvc`,
  `${BASE}/custom-patches/chenille`,
  `${BASE}/custom-patches/leather`,
  `${BASE}/custom-patches/printed`,
  `${BASE}/custom-patches/sequin`,
  `${BASE}/custom-patches/custom-silicone-labels`,
  `${BASE}/custom-patches/custom-3d-embroidered-transfers`,
  `${BASE}/custom-patches/custom-chenille-tpu-patches`,
  `${BASE}/custom-patches/custom-chenille-glitter-patches`,
  `${BASE}/custom-patches/custom-patches`,

  // Blog posts
  `${BASE}/how-to-attach-scout-patches-without-sewing`,
  `${BASE}/different-types-of-hats-for-your-patches-a-detailed-guide`,
  `${BASE}/custom-sublimation-patch-with-embroidery-why-choose-that`,
  `${BASE}/express-your-astros-pride-premium-houston-astros-patches-for-true-fans`,
  `${BASE}/embroidery-vs-woven-patches-what-to-choose`,
  `${BASE}/travel-with-stylish-enamel-pins`,
  `${BASE}/pvc-patches-how-it-s-made-and-what-to-consider-when-ordering`,
  `${BASE}/tactical-and-military-ocp-patch-placement-options`,
  `${BASE}/a-deep-dive-into-every-type-of-patch-including-explaining-all-of-its-options`,
  `${BASE}/how-to-iron-on-patches`,
  `${BASE}/needlepoint-vs-embroidery-exploring-the-art-of-stitching`,
  `${BASE}/how-to-remove-sewn-on-patches`,
  `${BASE}/best-fonts-colors-and-borders-for-custom-patches`,
  `${BASE}/diy-how-to-remove-iron-on-patches`,
  `${BASE}/top-types-of-hats-and-how-to-wear-them`,
  `${BASE}/the-role-of-patches-in-military-and-law-enforcement`,
  `${BASE}/custom-sublimated-patches-cost-effective-and-amazing-looking`,
  `${BASE}/what-are-challenge-coins-what-does-it-mean-to-receive-one`,
  `${BASE}/how-to-choose-the-perfect-patch-for-your-brand`,
  `${BASE}/boy-scout-patch-placements-a-complete-guide`,
  `${BASE}/the-evolution-of-custom-patches-from-military-to-mainstream-fashion`,
  `${BASE}/comparing-patch-backings-which-one-is-right-for-you`,
  `${BASE}/15-great-quotes-about-sewing-quilting-and-crafts`,
  `${BASE}/can-civilians-own-challenge-coins`,
  `${BASE}/the-complete-guide-to-iron-on-patches-care-application-and-longevity`,
  `${BASE}/the-role-of-custom-patches-in-a-winter-clothing-brand`,
  `${BASE}/show-your-team-spirit-embrace-the-legacy-of-the-san-francisco-49ers`,
  `${BASE}/get-your-clothing-line-started-with-custom-patches`,
  `${BASE}/how-to-make-your-own-iron-on-patches`,
  `${BASE}/top-5-design-tips-for-creating-eye-catching-patches`,
  `${BASE}/varsity-jacket-patches-winter-trend-2024`,
  `${BASE}/the-growing-popularity-of-patches-in-corporate-branding`,
  `${BASE}/hard-vs-soft-enamel-pins-the-real-differences`,
  `${BASE}/how-to-iron-a-patch-on-a-shirt`,
  `${BASE}/know-your-patch-types-which-is-best-for-you`,
  `${BASE}/how-to-get-patch-glue-off-clothes`,
  `${BASE}/varsity-jacket-patches-or-what-can-be-done`,
  `${BASE}/how-much-do-custom-patches-cost-full-pricing-breakdown`,

  // Location pages
  `${BASE}/custom-patches-dallas`,
  `${BASE}/alabama-patches`,
  `${BASE}/custom-patches-colorado`,
  `${BASE}/custom-utah-patches`,
  `${BASE}/custom-patches-in-boston`,
  `${BASE}/custom-patches-houston`,
  `${BASE}/custom-patches-los-angeles`,
  `${BASE}/custom-california-patches`,
  `${BASE}/custom-austin-patches`,
  `${BASE}/custom-patches-in-florida`,
  `${BASE}/custom-patches-in-san-francisco`,
  `${BASE}/custom-patches-in-washington`,
  `${BASE}/custom-ohio-state-patches`,
  `${BASE}/custom-patches-portland`,
  `${BASE}/kentucky-patches`,
  `${BASE}/custom-patches-in-new-york`,
  `${BASE}/custom-denver-patches`,
  `${BASE}/custom-patches-in-chicago`,
  `${BASE}/custom-patches-in-texas`,
  `${BASE}/custom-miami-patches`,

  // Patch style pages
  `${BASE}/christmas-patches`,
  `${BASE}/custom-morale-patches`,
  `${BASE}/custom-velcro-patches`,
  `${BASE}/custom-law-enforcement-patches`,
  `${BASE}/custom-soccer-patches`,
  `${BASE}/custom-logo-patches`,
  `${BASE}/custom-super-bowl-patch`,
  `${BASE}/custom-anime-patches`,
  `${BASE}/motorcycle-patches`,
  `${BASE}/custom-baseball-patches`,
  `${BASE}/custom-rock-band-patches`,
  `${BASE}/custom-hockey-patches`,
  `${BASE}/custom-jacket-patches`,
  `${BASE}/custom-tactical-patches`,
  `${BASE}/custom-name-patches`,
  `${BASE}/patches-for-hats`,
  `${BASE}/valentines-day-patches`,

  // Asset pages
  `${BASE}/assets/thread-color-chart`,
  `${BASE}/assets/iron-on-instructions`,
];

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: `${BASE}/${KEY}.txt`,
  urlList: urls,
};

console.log(`Pinging IndexNow with ${urls.length} URLs...`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

console.log(`Status: ${res.status} ${res.statusText}`);

if (res.status === 200) {
  console.log("Success — Bing + Yandex will crawl these within 24-48h");
} else if (res.status === 202) {
  console.log("Accepted — URLs queued for crawling");
} else if (res.status === 400) {
  console.log("Bad request — check URL format");
} else if (res.status === 403) {
  console.log("Key mismatch — verify key file is accessible at keyLocation");
} else if (res.status === 422) {
  console.log("URLs don't match the host — check for typos");
} else if (res.status === 429) {
  console.log("Too many requests — wait 1 hour and retry");
} else {
  const body = await res.text();
  console.log("Response body:", body);
}
