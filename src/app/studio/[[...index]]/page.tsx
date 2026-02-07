"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config"; // This path must point to your root sanity.config.ts

export default function StudioPage() {
  return <NextStudio config={config} />;
}
