/**
 * WEBSIT_4.MD G3 — Patch-style prompt builder.
 *
 * Wraps the customer's plain-English prompt in a template that pushes
 * the model toward a patch aesthetic (flat shapes, limited palette,
 * isolated background, no photorealism). The base template is the
 * starting point — expect to iterate after [HUMAN] reviews the first
 * 20 test generations.
 *
 * Style variants change the texture/material language:
 *  - embroidered: satin stitch + twill texture (default)
 *  - chenille:    fuzzy loop pile texture
 *  - pvc:         glossy 3D rubber
 *  - woven:       fine flat detail
 *
 * Presets supplied by the user (shape, border, colors) become explicit
 * directives in the prompt so the same user prompt across different
 * preset combinations yields visibly distinct results.
 *
 * Also exposes a single negative prompt that strips the failure modes
 * a Flux base model loves to drift toward (photorealism, watermark
 * artifacts, hands, gradients beyond thread).
 *
 * Also exposes a tiny prompt-injection scrubber. Anything that looks
 * like "ignore previous instructions" or "system:" gets neutralized
 * BEFORE it hits the template string.
 */

export type PatchStyle = "embroidered" | "chenille" | "pvc" | "woven";

export type PatchShape =
  | "square"
  | "circle"
  | "shield"
  | "oval"
  | "rectangle"
  | "die-cut";

export type PatchBorder = "merrowed" | "satin" | "none" | "raised";

// Color budget hints. The model treats these as a soft cap; we also include
// the "limited palette" phrase to discourage gradient slop.
export type PatchColorBudget = "<=4" | "<=7" | "unlimited";

export interface PatchPresets {
  shape?: PatchShape;
  border?: PatchBorder;
  style?: PatchStyle;
  colors?: PatchColorBudget;
}

export interface BuildPromptInput {
  userPrompt: string;
  presets?: PatchPresets;
}

export interface BuildPromptResult {
  builtPrompt: string;
  negativePrompt: string;
  // Echoed back so the route handler can log the resolved values without
  // re-deriving them. Saved on the generations row as `presets` JSONB.
  resolvedPresets: Required<PatchPresets>;
}

// Defaults applied when the user/UI omits a preset. Embroidered is the
// dominant Panda product, so it sits at the top of the funnel.
const DEFAULT_PRESETS: Required<PatchPresets> = {
  shape: "circle",
  border: "merrowed",
  style: "embroidered",
  colors: "<=7",
};

// Explicit shape directives. Put FIRST in the prompt so Flux weights them
// heavily — a weak trailing "circle shape" gets ignored on complex subjects.
const SHAPE_LANGUAGE: Record<PatchShape, string> = {
  circle:
    "perfectly circular patch, round outer boundary, all design elements contained within a circle",
  square:
    "perfect square patch, four equal straight sides, right-angle corners, square outer boundary",
  shield:
    "shield-shaped patch, arched top and pointed bottom, heraldic shield outline",
  oval:
    "oval ellipse patch, smooth curved edges, taller than wide",
  rectangle:
    "rectangular patch, landscape orientation, straight parallel edges",
  "die-cut":
    "die-cut patch, custom outline following the subject's silhouette, no background fill outside the shape",
};

// Per-style language. Lives in one place so the [HUMAN] reviewer can tune
// without grep'ing across the whole codebase.
const STYLE_LANGUAGE: Record<PatchStyle, string> = {
  embroidered:
    "embroidered patch design, satin stitch and twill texture, raised thread look, bold simplified shapes",
  chenille:
    "chenille patch design, fuzzy looped yarn pile texture, varsity-style raised letters and shapes, felt backing",
  pvc:
    "PVC rubber patch design, glossy 3D molded look, soft tactile rubber surface, sharp clean edges",
  woven:
    "woven patch design, ultra-fine flat detail, tight thread weave, photo-clean small text capable",
};

const COLOR_LANGUAGE: Record<PatchColorBudget, string> = {
  "<=4": "limited palette of 4 or fewer thread colors",
  "<=7": "limited palette of 7 or fewer thread colors",
  unlimited: "full color palette",
};

const BORDER_LANGUAGE: Record<PatchBorder, string> = {
  merrowed: "thick raised merrowed thread border running along the outer edge",
  satin: "smooth satin-stitch thread border outlining the design",
  raised: "raised rubber border edge, clean molded rim around the design",
  none: "no border, clean edge with no outline",
};

// Things Flux base loves to do that ruin patch realism. Negative prompts are
// model-side hints; not all providers respect them equally.
const BASE_NEGATIVE_PROMPT = [
  "photorealism",
  "photograph",
  "3d render of a person",
  "hands",
  "fingers",
  "face close up",
  "watermark text",
  "logo overlay",
  "signature",
  "extra text",
  "blurry",
  "noise",
  "low contrast gradient sky",
  "soft gradient background",
  "shadow on background",
  "mockup",
  "garment background",
].join(", ");

/**
 * Neutralize obvious prompt-injection attempts before template interpolation.
 *
 * Strips a small set of common attack phrases and any leading directive
 * starting with "system:" / "assistant:" so the user prompt can never alter
 * the template's intent. This is NOT a moderation layer (that's G2) — it's a
 * structural guard on the prompt string itself. NSFW / trademark checks
 * still run in G2 against the cleaned text.
 */
export function scrubPromptInjection(raw: string): string {
  if (!raw) return "";
  let s = raw.trim();

  // Strip role-style leaders entirely.
  s = s.replace(/^\s*(system|assistant|user)\s*:\s*/i, "");

  // Neutralize common bypass phrases. Keep the visible characters but break
  // their semantics so the model sees nonsense instead of an instruction.
  const patterns = [
    /ignore (all |any |the )?(previous |prior |above )?(instructions|prompt|rules)/gi,
    /disregard (all |any |the )?(previous |prior |above )?(instructions|prompt|rules)/gi,
    /forget (everything|all|prior|above)/gi,
    /you are (now|actually) (a |an )?[\w\s]+/gi,
    /act as (a |an )?[\w\s]+/gi,
    /pretend (to be|you are) [\w\s]+/gi,
  ];
  for (const re of patterns) s = s.replace(re, "[blocked]");

  // Clip to a sane length so the template stays the dominant signal. 600
  // chars is plenty for a patch description; longer prompts almost always
  // contain noise or attacks.
  return s.slice(0, 600);
}

export function buildPatchPrompt(input: BuildPromptInput): BuildPromptResult {
  const userPromptClean = scrubPromptInjection(input.userPrompt);

  const presets: Required<PatchPresets> = {
    ...DEFAULT_PRESETS,
    ...(input.presets ?? {}),
  };

  const stylePhrase = STYLE_LANGUAGE[presets.style];
  const colorPhrase = COLOR_LANGUAGE[presets.colors];
  const shapePhrase = SHAPE_LANGUAGE[presets.shape];

  // For PVC, auto-resolve border: merrowed/satin don't exist on PVC rubber.
  // If user somehow arrives with a thread border on a PVC style, fall back to raised.
  const resolvedBorder: PatchBorder =
    presets.style === "pvc" && (presets.border === "merrowed" || presets.border === "satin")
      ? "raised"
      : presets.border;
  presets.border = resolvedBorder;

  const borderPhrase = BORDER_LANGUAGE[resolvedBorder];

  // Shape goes FIRST so Flux weights it heavily — trailing shape tokens get
  // ignored when the subject is complex. Style is second anchor.
  const builtPrompt = [
    shapePhrase,
    stylePhrase,
    `subject: ${userPromptClean || "abstract emblem"}`,
    borderPhrase,
    colorPhrase,
    "flat front-facing view",
    "centered composition",
    "isolated on plain neutral background",
    "studio lighting",
    "high contrast",
    "no text unless described in subject",
  ].join(", ");

  return {
    builtPrompt,
    negativePrompt: BASE_NEGATIVE_PROMPT,
    resolvedPresets: presets,
  };
}
