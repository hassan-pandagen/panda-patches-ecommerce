-- ============================================================================
-- AI Patch Generator — schema migration (WEBSIT_4.MD G0)
--
-- One table tracks every generation attempt + a Supabase Storage bucket holds
-- both the clean and watermarked PNGs. Run this once in the Supabase SQL
-- editor before deploying the /ai-patch-generator feature. Idempotent.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. ai_generations table
-- ---------------------------------------------------------------------------
-- Every fal.ai (or whichever provider) call appends one row, regardless of
-- success or failure. cost_usd is recorded even on retries so the daily
-- budget kill-switch in G5 can sum it accurately.
--
-- session_id is a signed cookie value on the browser (G5). Anonymous users
-- have a session_id and no user_id. Once captured, email lives on every
-- row in that session. On login the matching user_id is filled in via the
-- account-merge step (G8).
--
-- parent_generation_id links a Refine attempt to its original so the chat
-- thread can render the lineage and so we can measure regenerate-without-quote
-- rates per prompt (G9).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,

  -- The request
  prompt TEXT NOT NULL,
  built_prompt TEXT NOT NULL,
  presets JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- e.g. { "shape": "circle", "border": "merrowed", "style": "embroidered", "colors": "<=7" }

  -- Provider + model that actually ran (env-swappable per generation)
  provider TEXT NOT NULL,
  -- "mock" | "fal" | "replicate" | etc
  model TEXT NOT NULL,
  -- "fal-ai/flux/schnell" | "fal-ai/flux/dev" | "fal-ai/flux-pro/kontext" | "mock"

  -- Result (null when status != 'succeeded')
  -- Storage paths inside the ai-generations bucket. We resolve to a public
  -- URL at render time so we can rotate the bucket without rewriting rows.
  storage_path_clean TEXT,
  storage_path_watermarked TEXT,
  width INTEGER,
  height INTEGER,

  -- Refine lineage (G4)
  parent_generation_id UUID REFERENCES ai_generations(id) ON DELETE SET NULL,

  -- Cost (USD). Always recorded even on failure so the daily budget cap is
  -- honest. For "mock" provider this stays at 0.
  cost_usd NUMERIC(10, 4) NOT NULL DEFAULT 0,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'succeeded', 'failed', 'blocked')),
  -- blocked = moderation rejected, failed = provider error
  error_message TEXT,

  -- Conversion linking (G6). When the customer hits "Get Free Quote" we
  -- stamp the quote.id here so we can measure end-to-end conversion and so
  -- the 30-day TTL cleanup knows to KEEP this row + asset forever.
  quote_id BIGINT REFERENCES quotes(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_generations_session_id
  ON ai_generations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id
  ON ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_email_lower
  ON ai_generations(lower(email));
CREATE INDEX IF NOT EXISTS idx_ai_generations_created_at
  ON ai_generations(created_at);
-- Composite for the daily-cap check in G5: how many gens has this email
-- done in the last 24 hours.
CREATE INDEX IF NOT EXISTS idx_ai_generations_email_created
  ON ai_generations(lower(email), created_at)
  WHERE email IS NOT NULL;
-- For the TTL cleanup cron: find unattached rows older than 30 days.
CREATE INDEX IF NOT EXISTS idx_ai_generations_orphan_cleanup
  ON ai_generations(created_at)
  WHERE quote_id IS NULL;

COMMENT ON TABLE ai_generations IS
  'AI Patch Generator (WEBSIT_4.MD): every model call, plus moderation rejects. '
  'Rows with quote_id stamped survive cleanup; orphans expire after 30 days.';

-- ---------------------------------------------------------------------------
-- 2. ai_generation_blocklist
-- ---------------------------------------------------------------------------
-- Trademark / NSFW seed list (G2). Edited later from the CRM (or via SQL)
-- without redeploy. Lowercased for case-insensitive match. The "kind" column
-- lets us show different copy depending on the reason a prompt was blocked.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_generation_blocklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL CHECK (kind IN ('trademark', 'nsfw', 'hate', 'other')),
  notes TEXT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_generation_blocklist_term_lower
  ON ai_generation_blocklist(lower(term));

-- ---------------------------------------------------------------------------
-- 3. Storage bucket
-- ---------------------------------------------------------------------------
-- Public bucket so the chat UI can render images via plain <img> tag without
-- signing each URL. The watermark on the preview is what protects the asset
-- from being lifted as a final product. Clean (un-watermarked) versions live
-- in the same bucket under a different path prefix; access to those paths is
-- only ever surfaced server-side when a quote is attached (G6).
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ai-generations',
  'ai-generations',
  TRUE,
  10485760, -- 10 MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 4. RLS
-- ---------------------------------------------------------------------------
-- ai_generations is written ONLY by the website's /api/ai-patch/generate
-- route, which uses the service role key (bypasses RLS). Same for the
-- moderation route and the cleanup cron. We still enable RLS so that any
-- accidental anon read returns nothing.
-- ---------------------------------------------------------------------------
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_blocklist ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own generations (G8: "My designs").
DROP POLICY IF EXISTS ai_generations_select_own ON ai_generations;
CREATE POLICY ai_generations_select_own
  ON ai_generations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- No INSERT / UPDATE / DELETE policies for authenticated. Writes happen via
-- service role only. The same pattern as orders.

-- Blocklist is service-role only. CRM agents who need to edit it run a
-- privileged action through their backend. No direct customer access.

-- ---------------------------------------------------------------------------
-- 5. Trigger: bump updated-at semantics not needed (this table is append-mostly).
-- ---------------------------------------------------------------------------
-- No updated_at column on purpose. We rarely mutate rows after creation
-- (only quote_id gets stamped on conversion, and that timestamp lives on
-- quotes.created_at). Keeping the schema lean reduces the moving parts.
