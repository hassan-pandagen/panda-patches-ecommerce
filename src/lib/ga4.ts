/**
 * GA4 conversion tracking via the Measurement Protocol (server-side relay).
 *
 * Why server-side: GA4 on this site runs through GTM (GTM-KQQQ674D) and there is no
 * GTM tag listening for our custom events, so client-side dataLayer pushes never
 * reached GA4 — GA4 showed ~0 key events and $0 revenue (PA9943_1.MD). Meta CAPI was
 * fine; only GA4 was blind.
 *
 * Flow: trackLead/trackPurchase (browser) read the GA4 `_ga` / `_ga_*` cookies for the
 * client_id + session_id, then POST to our own /api/ga4-mp route, which forwards the
 * event to GA4's Measurement Protocol using the server-only GA4_MP_API_SECRET. Sending
 * the real client_id + session_id ties the conversion to the visitor's existing session,
 * so it attributes to the right channel (e.g. Paid Social / Meta).
 *
 * sendBeacon is used so the call survives an immediate navigation (e.g. the sample box
 * redirect to Square checkout).
 *
 * Setup: env GA4_MP_API_SECRET (GA4 Admin → Data Streams → Measurement Protocol API
 * secrets), and mark `generate_lead` + `purchase` as Key Events in GA4 to count them.
 */

const RELAY_URL = "/api/ga4-mp";

/** Pull the GA4 client_id (`_ga`) and session_id (`_ga_<stream>`) from cookies. */
function getGa4Ids(): { client_id?: string; session_id?: string } {
  if (typeof document === "undefined") return {};
  const c = document.cookie || "";
  // _ga=GA1.1.<client_id_part1>.<client_id_part2>
  const ga = c.match(/(?:^|;\s*)_ga=GA\d\.\d\.([\d.]+)/);
  // _ga_<container>=GS1.1.<session_id>.<...>
  const ses = c.match(/(?:^|;\s*)_ga_[A-Za-z0-9]+=GS\d\.\d\.(\d+)/);
  return { client_id: ga?.[1], session_id: ses?.[1] };
}

function relay(name: string, params: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    const { client_id, session_id } = getGa4Ids();
    // No GA4 cookie yet → we can't attribute this to a session, so skip rather than
    // create a phantom user that would muddy channel reporting.
    if (!client_id) return;
    const body = JSON.stringify({
      name,
      client_id,
      params: { ...params, ...(session_id ? { session_id } : {}) },
    });
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon(
        RELAY_URL,
        new Blob([body], { type: "application/json" })
      );
      if (ok) return;
    }
    fetch(RELAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never let tracking throw into the UI */
  }
}

type LeadParams = {
  /** quote | bulk_quote | design_service | ai_generator | partner | contact | sample_box */
  form_name: string;
  lead_source?: string;
  patch_type?: string;
  partner_type?: string;
  /** optional lead value so GA4 can show lead value by channel */
  value?: number;
  currency?: string;
};

export function trackLead(params: LeadParams): void {
  relay("generate_lead", { currency: "USD", ...params });
}

export type PurchaseItem = {
  item_name?: string;
  item_variant?: string;
  quantity?: number;
  price?: number;
};

type PurchaseParams = {
  transaction_id?: string;
  value: number;
  currency?: string;
  items?: PurchaseItem[];
};

export function trackPurchase(params: PurchaseParams): void {
  relay("purchase", { currency: "USD", ...params });
}
