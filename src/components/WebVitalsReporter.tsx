"use client";

import { useEffect } from "react";
import { reportWebVitals } from "@/lib/webVitalsReport";

export default function WebVitalsReporter() {
  useEffect(() => {
    reportWebVitals();
  }, []);

  return null;
}
