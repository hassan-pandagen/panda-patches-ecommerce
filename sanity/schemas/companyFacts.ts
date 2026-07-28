/**
 * CompanyFacts — singleton (_id: "companyFacts").
 *
 * Moves the moving numbers OUT of code so they can be updated without a deploy
 * (CRM↔Website handoff, MASTER v3 Item 1 & 3). The CRM writes these via the
 * Sanity API on its monthly/quarterly cadence; the website reads them at build
 * (see src/lib/companyFacts.ts). reviewConstants.ts remains the build-time
 * fallback so a fetch failure never blanks the rating.
 *
 * COMPLIANCE: trustpilotRating / trustpilotReviewCount are Trustpilot's VERIFIED
 * public numbers only — never synthesized from CRM invitation data. They power
 * the visible, dated, linked review line; they do NOT feed an Organization
 * aggregateRating (self-serving under Google's review-snippet guidelines).
 */
export default {
  name: "companyFacts",
  title: "Company Facts (singleton)",
  type: "document",
  fields: [
    {
      name: "trustpilotRating",
      title: "Trustpilot rating",
      type: "string",
      description: 'From Trustpilot ONLY, e.g. "4.7". Do not synthesize from CRM data.',
    },
    {
      name: "trustpilotReviewCount",
      title: "Trustpilot review count",
      type: "number",
      description: 'From Trustpilot ONLY, e.g. 76. Exact count — never a "+" suffix.',
    },
    {
      name: "reviewLastChecked",
      title: "Reviews last checked",
      type: "string",
      description: 'Shown in the dated review line, e.g. "July 2026". Refresh monthly.',
    },
    {
      name: "shippingCountries",
      title: "Shipping destination countries (ISO-3166 alpha-2)",
      type: "array",
      of: [{ type: "string" }],
      description: "Real destinations from CRM shipping history. Feeds Product shipping schema.",
    },
    {
      name: "medianOrderPieces",
      title: "Median order size (pieces)",
      type: "number",
      description: "From the CRM order dataset (dataset-PR stat).",
    },
    {
      name: "orderDatasetCount",
      title: "Order dataset size",
      type: "number",
      description: "Total orders in the dataset behind the median stat.",
    },
  ],
  preview: {
    prepare: () => ({ title: "Company Facts" }),
  },
};
