"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/clientAttribution";

/**
 * Invisible mount-only component that captures Meta/Google attribution
 * cookies and URL params into sessionStorage on every page load.
 * Runs once per mount, zero UI, zero impact on LCP.
 */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
