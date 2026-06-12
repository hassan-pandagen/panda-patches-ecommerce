import "server-only";

/**
 * WEBSIT_4.MD G1 — Provider abstraction for the AI patch generator.
 *
 * Two providers exist today:
 *   - "mock": returns a placeholder image, no external call, costs $0.
 *             Default in dev so the entire flow is testable without an
 *             API key. Returns a deterministic asset URL based on the
 *             prompt hash so the UI looks alive.
 *   - "fal":  real fal.ai Flux call (G1 production path). The wrapper
 *             reads FAL_API_KEY at request time and never bundles it.
 *
 * The route handler imports `generateImage()` only — the provider switch
 * happens inside this module via AI_GEN_PROVIDER env. Swapping models or
 * even providers is one env var, not a code change.
 */

import { createHash } from "node:crypto";

export type GenerateInput = {
  builtPrompt: string;
  negativePrompt?: string;
  // Optional override; otherwise the env default model wins.
  modelOverride?: string;
  // 1024x1024 is the only size we ship; declared explicitly so the cost
  // estimator stays honest even if we lower this later.
  width?: number;
  height?: number;
};

export type GenerateSuccess = {
  ok: true;
  // Raw bytes of the generated PNG. We never trust the provider's URL to
  // persist — every byte gets re-uploaded to Supabase Storage inside the
  // route handler. The clean PNG is what the watermark step ingests.
  imageBytes: Uint8Array;
  width: number;
  height: number;
  provider: string;
  model: string;
  costUsd: number;
};

export type GenerateFailure = {
  ok: false;
  provider: string;
  model: string;
  // Cost still recorded on failure when the provider DID bill (e.g. timeout
  // mid-render). For our timeout-before-call path it stays 0.
  costUsd: number;
  errorMessage: string;
};

export type GenerateResult = GenerateSuccess | GenerateFailure;

// Per-model price tags in USD. Kept here so the route handler does not have
// to know the cost table. When fal.ai changes pricing, update this map.
const MODEL_PRICING_USD: Record<string, number> = {
  "mock": 0,
  "fal-ai/flux/schnell": 0.003,
  "fal-ai/flux/dev": 0.025,
  "fal-ai/flux-pro/v1.1": 0.04,
  "fal-ai/flux-pro/kontext": 0.04,
  "fal-ai/ideogram/v3": 0.08,
};

function resolveProvider(): string {
  return (process.env.AI_GEN_PROVIDER || "mock").toLowerCase();
}

function resolveDefaultModel(provider: string): string {
  const fromEnv = process.env.AI_GEN_MODEL;
  if (fromEnv) return fromEnv;
  if (provider === "fal") return "fal-ai/flux/schnell";
  return "mock";
}

export function priceFor(model: string): number {
  return MODEL_PRICING_USD[model] ?? 0;
}

/**
 * Main entry. Routes to the configured provider, returns either a clean PNG
 * byte array (with metadata) or a failure object. Never throws — the route
 * handler should treat thrown exceptions as bugs, not provider errors.
 */
export async function generateImage(input: GenerateInput): Promise<GenerateResult> {
  const provider = resolveProvider();
  const model = input.modelOverride || resolveDefaultModel(provider);

  if (provider === "mock") {
    return generateMock(input, model);
  }
  if (provider === "fal") {
    return generateFal(input, model);
  }

  return {
    ok: false,
    provider,
    model,
    costUsd: 0,
    errorMessage: `Unknown AI_GEN_PROVIDER "${provider}". Expected "mock" or "fal".`,
  };
}

// ---------------------------------------------------------------------------
// Mock provider — returns a deterministic 1024x1024 PNG placeholder per prompt
// ---------------------------------------------------------------------------
// We render a small SVG (a labeled tile with a hash-derived color) into a PNG
// using sharp. This gives the UI something real to display while the brief's
// fal.ai key is being procured. Cost is always 0 USD.

async function generateMock(input: GenerateInput, model: string): Promise<GenerateResult> {
  const width = input.width ?? 1024;
  const height = input.height ?? 1024;

  const hash = createHash("sha256").update(input.builtPrompt).digest("hex");
  const hue = parseInt(hash.slice(0, 4), 16) % 360;
  const promptLabel = (input.builtPrompt.match(/subject:\s*([^,]+)/i)?.[1] || "patch concept").slice(0, 40);

  // Inline SVG. Two layers: solid colored circle (the would-be patch), and
  // a label so the user sees the prompt echoed back. Real generation will
  // replace the entire payload at the fal swap; the rest of the pipeline
  // (Supabase upload, watermark, persistence) does not change.
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="hsl(${hue}, 60%, 92%)" />
          <stop offset="100%" stop-color="hsl(${hue}, 40%, 78%)" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)" />
      <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) * 0.36}"
              fill="hsl(${hue}, 70%, 45%)" stroke="hsl(${hue}, 80%, 25%)" stroke-width="18" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="system-ui, sans-serif" font-size="44" font-weight="800"
            fill="white" stroke="black" stroke-width="1.5" paint-order="stroke">
        ${escapeXml(promptLabel.toUpperCase())}
      </text>
      <text x="50%" y="${height - 60}" dominant-baseline="middle" text-anchor="middle"
            font-family="system-ui, sans-serif" font-size="28" font-weight="600"
            fill="hsl(${hue}, 30%, 20%)">
        MOCK GENERATION
      </text>
    </svg>`;

  try {
    const sharp = (await import("sharp")).default;
    const imageBytes = await sharp(Buffer.from(svg)).png().toBuffer();
    return {
      ok: true,
      imageBytes: new Uint8Array(imageBytes),
      width,
      height,
      provider: "mock",
      model,
      costUsd: 0,
    };
  } catch (err) {
    return {
      ok: false,
      provider: "mock",
      model,
      costUsd: 0,
      errorMessage: err instanceof Error ? err.message : "sharp failed",
    };
  }
}

// ---------------------------------------------------------------------------
// fal.ai provider — real Flux call (skeleton). Swap in by:
//   1. Add FAL_API_KEY to env
//   2. Set AI_GEN_PROVIDER=fal
//   3. Optionally AI_GEN_MODEL=fal-ai/flux/dev (default is schnell)
// ---------------------------------------------------------------------------
// We use fetch + the synchronous queue endpoint so the route handler can
// await a single promise. fal also offers a streaming queue if we later
// want to surface progress. The 60s timeout below mirrors brief G1.

async function generateFal(input: GenerateInput, model: string): Promise<GenerateResult> {
  const apiKey = process.env.FAL_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      provider: "fal",
      model,
      costUsd: 0,
      errorMessage:
        "FAL_API_KEY missing. Either set it in env or switch AI_GEN_PROVIDER back to mock.",
    };
  }

  const width = input.width ?? 1024;
  const height = input.height ?? 1024;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    // fal models accept a normalized shape via the run endpoint:
    //   POST https://fal.run/{model}
    //   body: { prompt, image_size: { width, height }, ... }
    const url = `https://fal.run/${model}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input.builtPrompt,
        negative_prompt: input.negativePrompt,
        image_size: { width, height },
        num_images: 1,
        // Flux schnell uses a fixed 4 steps; dev/pro accept up to 50. We
        // leave it default per-model rather than risking a step value that
        // is invalid for schnell.
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await safeReadText(res);
      return {
        ok: false,
        provider: "fal",
        model,
        costUsd: priceFor(model), // fal charges even on some 5xx; record it
        errorMessage: `fal HTTP ${res.status}: ${text.slice(0, 240)}`,
      };
    }

    const json = (await res.json()) as {
      images?: Array<{ url?: string; content_type?: string }>;
    };
    const imageUrl = json.images?.[0]?.url;
    if (!imageUrl) {
      return {
        ok: false,
        provider: "fal",
        model,
        costUsd: priceFor(model),
        errorMessage: "fal returned no image URL",
      };
    }

    // Pull the bytes immediately so the route can hand them to Supabase
    // Storage. fal URLs expire (CDN) — we never want to rely on them later.
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      return {
        ok: false,
        provider: "fal",
        model,
        costUsd: priceFor(model),
        errorMessage: `fal image download HTTP ${imgRes.status}`,
      };
    }
    const arrayBuffer = await imgRes.arrayBuffer();

    return {
      ok: true,
      imageBytes: new Uint8Array(arrayBuffer),
      width,
      height,
      provider: "fal",
      model,
      costUsd: priceFor(model),
    };
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === "AbortError";
    return {
      ok: false,
      provider: "fal",
      model,
      costUsd: 0,
      errorMessage: aborted
        ? "fal request timed out after 60s"
        : err instanceof Error
          ? err.message
          : "unknown fal error",
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}
