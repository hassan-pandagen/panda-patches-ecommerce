/**
 * Every column an API route writes must exist on the table it writes to.
 *
 * On 7 September 2026 a single line — `rush_date: rushDateIso` on the `quotes`
 * insert — silently destroyed every full quote submission for thirty hours.
 * `rush_date` is a real column, populated by web checkout, on ORDERS. Nobody
 * checked whether `quotes` had it. It does not, and PostgREST rejects an insert
 * naming an unknown column outright:
 *
 *     PGRST204 — Could not find the 'rush_date' column of 'quotes'
 *                in the schema cache
 *
 * The whole row fails, not just the offending field. Roughly 80 quotes never
 * reached the CRM, most of them paid social traffic.
 *
 * Three things made it invisible, and all three were reasonable on their own:
 *   - the insert is non-blocking by design, so a database failure never costs a
 *     lead and the customer still sees success;
 *   - the endpoint kept returning 200;
 *   - the partial-capture path does not send that field, so leads kept arriving
 *     and the dashboards showed traffic.
 *
 * TypeScript could not catch it either: the Supabase client is untyped here, so
 * the insert object is a plain literal and any key type-checks.
 *
 * So this compares what the code writes against what the database actually has,
 * which is the only check that would have caught it. Reads the live schema from
 * PostgREST's OpenAPI document, so it needs no generated types to drift out of
 * date and no migration file to be kept in sync.
 *
 *   npm run audit:db
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and a service key in .env.local. Without
 * them it SKIPS rather than fails, so a contributor with no credentials is not
 * blocked — but CI with credentials will fail the build.
 */
import fs from "node:fs";
import path from "node:path";

// ── credentials ────────────────────────────────────────────────────────────
function readEnv(): { url: string; key: string } | null {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return null;
  const env = fs.readFileSync(file, "utf8");
  const pick = (re: RegExp) => env.match(re)?.[1]?.trim().replace(/^["']|["']$/g, "");
  const url = pick(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.+)/);
  const key =
    pick(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.+)/) ??
    pick(/SUPABASE_SERVICE_KEY\s*=\s*(.+)/) ??
    pick(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.+)/);
  return url && key ? { url, key } : null;
}

// ── what the code writes ───────────────────────────────────────────────────
interface Write {
  file: string;
  line: number;
  table: string;
  op: "insert" | "update" | "upsert";
  columns: string[];
  /** A spread means the literal keys are only part of the payload. */
  hasSpread: boolean;
}

/** Top-level keys of the object literal starting at `open` (index of its "{"). */
function objectKeys(src: string, open: number): { keys: string[]; spread: boolean; end: number } {
  const keys: string[] = [];
  let spread = false;
  let depth = 0;
  let i = open;
  let atTopLevel = false;
  /** Last non-whitespace character seen at this depth. A key may only follow "{" or ",". */
  let lastSignificant = "";

  for (; i < src.length; i++) {
    const ch = src[i];

    // Skip strings and template literals wholesale.
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      i++;
      while (i < src.length && src[i] !== quote) {
        if (src[i] === "\\") i++;
        else if (quote === "`" && src[i] === "$" && src[i + 1] === "{") {
          let d = 1;
          i += 2;
          while (i < src.length && d > 0) {
            if (src[i] === "{") d++;
            else if (src[i] === "}") d--;
            i++;
          }
          i--;
        }
        i++;
      }
      lastSignificant = "v";
      continue;
    }
    // Skip comments — a commented-out column is not a column being written.
    if (ch === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && src[i + 1] === "*") {
      i = src.indexOf("*/", i);
      if (i === -1) break;
      i++;
      continue;
    }

    if (ch === "{" || ch === "[" || ch === "(") {
      depth++;
      atTopLevel = depth === 1;
      lastSignificant = depth === 1 ? "{" : lastSignificant;
      continue;
    }
    if (ch === "}" || ch === "]" || ch === ")") {
      depth--;
      if (depth === 0) break;
      atTopLevel = depth === 1;
      // A nested value just closed, so the next key must still wait for a comma.
      if (depth === 1) lastSignificant = ")";
      continue;
    }

    if (!atTopLevel || depth !== 1) continue;

    if (ch === "." && src.slice(i, i + 3) === "...") {
      spread = true;
      continue;
    }

    // A top-level `key:` or `"key":`, but ONLY where a key can legally start —
    // immediately after the opening brace or a comma.
    //
    // Without that condition a ternary is indistinguishable from a key:
    // `return_url: pageUrl.startsWith(base) ? pageUrl : fallback` yields a
    // phantom `pageUrl` column, which is the second thing this guard got wrong
    // before anyone had trusted it once.
    if (lastSignificant === "{" || lastSignificant === ",") {
      const m = /^\s*(?:(["'])([A-Za-z_][\w]*)\1|([A-Za-z_][\w]*))\s*:/.exec(src.slice(i - 1));
      if (m) {
        keys.push(m[2] ?? m[3]);
        i += m[0].length - 2;
        continue;
      }
    }
    if (!/\s/.test(ch)) lastSignificant = ch;
  }
  return { keys, spread, end: i };
}

function scanFile(file: string): Write[] {
  const src = fs.readFileSync(file, "utf8");
  const out: Write[] = [];
  // .from('table') ... .insert({ / .update({ / .upsert({
  // The gap may not cross a `;` or a second `.from(`. Without that, a SELECT
  // like `.from('orders').select(...).limit(1);` runs past its own semicolon
  // and pairs with the NEXT statement's `.update({ … })`, blaming the wrong
  // table — which is exactly what this guard did on its first run.
  const re =
    /\.from\(\s*['"`]([A-Za-z_][\w]*)['"`]\s*\)((?:(?!\.from\(|;)[\s\S]){0,400}?)\.(insert|update|upsert)\(\s*(\{)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const open = m.index + m[0].length - 1;
    const { keys, spread } = objectKeys(src, open);
    if (!keys.length && !spread) continue;
    out.push({
      file,
      line: src.slice(0, m.index).split("\n").length,
      table: m[1],
      op: m[3] as Write["op"],
      columns: keys,
      hasSpread: spread,
    });
  }
  return out;
}

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

// ── what the database has ──────────────────────────────────────────────────
async function liveColumns(url: string, key: string): Promise<Map<string, Set<string>>> {
  const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`PostgREST schema fetch failed: HTTP ${res.status}`);
  const doc: any = await res.json();
  const map = new Map<string, Set<string>>();
  for (const [table, def] of Object.entries<any>(doc.definitions ?? {})) {
    map.set(table, new Set(Object.keys(def?.properties ?? {})));
  }
  return map;
}

// ── run ────────────────────────────────────────────────────────────────────
async function main() {
  const creds = readEnv();
  if (!creds) {
    console.log("audit:db — no Supabase credentials in .env.local, skipping.");
    process.exit(0);
  }

  const files = [
    ...walk(path.join(process.cwd(), "src", "app", "api")),
    ...walk(path.join(process.cwd(), "src", "lib")),
  ];
  const writes = files.flatMap(scanFile);

  let schema: Map<string, Set<string>>;
  try {
    schema = await liveColumns(creds.url, creds.key);
  } catch (err) {
    // A CMS/API outage must not fail a build. The point is to catch a bad column,
    // not to require the database to be reachable at all times.
    console.log(`audit:db — could not read the live schema (${(err as Error).message}). Skipping.`);
    process.exit(0);
  }

  const failures: string[] = [];
  let checkedTables = 0;
  let checkedColumns = 0;

  for (const w of writes) {
    const cols = schema.get(w.table);
    if (!cols) continue; // not a PostgREST-exposed table (a view, an RPC, a typo we cannot judge)
    checkedTables++;
    for (const c of w.columns) {
      checkedColumns++;
      if (!cols.has(c)) {
        failures.push(
          `${w.file}:${w.line} — .from('${w.table}').${w.op}({ ${c}: … })\n` +
            `      '${c}' is not a column on '${w.table}'. PostgREST rejects the ENTIRE row (PGRST204),\n` +
            `      so every write through this path fails, not just this field.`,
        );
      }
    }
  }

  console.log(
    `Checked ${checkedColumns} column(s) across ${checkedTables} write site(s) against the live schema.`,
  );

  if (failures.length) {
    console.error(`\nSUPABASE COLUMN CHECK FAILED — ${failures.length} column(s) that do not exist\n`);
    failures.forEach((f) => console.error("  x " + f));
    console.error(
      "\nEither add the column to the table, or stop writing it. Do not assume a column\n" +
        "exists on one table because it exists on another — that is exactly how the\n" +
        "7 Sept 2026 quote outage happened (`rush_date` is on orders, not quotes).\n",
    );
    process.exit(1);
  }

  console.log("Every column written by an API route exists on its table.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
