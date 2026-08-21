import type { CLSMetricWithAttribution, Metric } from "web-vitals/attribution";

const RELAY_URL = "/api/web-vitals";

function getConnectionType(): string | undefined {
  const nav = navigator as Navigator & { connection?: { effectiveType?: string } };
  return nav.connection?.effectiveType;
}

function send(metric: Metric, attribution?: string, loadState?: string) {
  try {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      attribution: attribution || null,
      loadState: loadState || null,
      path: window.location.pathname,
      viewportWidth: window.innerWidth,
      connectionType: getConnectionType() || null,
    });

    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon(RELAY_URL, new Blob([body], { type: "application/json" }));
      if (ok) return;
    }
    fetch(RELAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never let telemetry throw into the UI */
  }
}

/**
 * Reports real-user Core Web Vitals with the attribution build's culprit-element
 * data (CLS's `largestShiftTarget` + `loadState` in particular) — see the route
 * comment at /api/web-vitals for why. Call once per page load, client-side only.
 */
export async function reportWebVitals() {
  if (typeof window === "undefined") return;
  const { onCLS, onLCP, onINP, onFCP, onTTFB } = await import("web-vitals/attribution");

  onCLS((metric: CLSMetricWithAttribution) =>
    send(metric, metric.attribution?.largestShiftTarget, metric.attribution?.loadState)
  );
  onLCP((metric) => send(metric, metric.attribution?.target));
  onINP((metric) => send(metric, metric.attribution?.interactionTarget));
  onFCP((metric) => send(metric));
  onTTFB((metric) => send(metric));
}
