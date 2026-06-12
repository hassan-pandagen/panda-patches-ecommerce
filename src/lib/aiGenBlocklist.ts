import "server-only";

/**
 * WEBSIT_4.MD G2 — Patch-industry content guardrails.
 *
 * Checked server-side BEFORE any generation so we never spend a fal.ai
 * credit on blocked content. Categories match what every reputable custom
 * patch maker refuses to produce:
 *
 *  1. Major sports league / team official logos (NFL, NBA, MLB, NHL, NCAA)
 *  2. Copyrighted entertainment characters (Disney, Marvel, DC, Nintendo…)
 *  3. Hate symbols and extremist insignia
 *  4. Gang and outlaw MC official patches (not all biker patches — just
 *     named clubs with registered trademarks like Hells Angels, Bandidos)
 *  5. Luxury / streetwear brand logos
 *  6. Stolen Valor triggers (reproduction of actual military medals / ranks)
 *
 * Rules intentionally lean toward "describe an original design" messaging
 * so customers with a legit need (e.g. a morale patch inspired by a theme)
 * know exactly how to rephrase.
 *
 * Adding a rule: push a new entry into BLOCKLIST. pattern is tested against
 * the CLEANED prompt (already injection-scrubbed). userMessage is shown
 * in the UI. Keep it constructive, not accusatory.
 */

type Blocked = { blocked: true; userMessage: string };
type Allowed = { blocked: false };

interface BlocklistEntry {
  pattern: RegExp;
  userMessage: string;
}

const BLOCKLIST: BlocklistEntry[] = [
  // ── Hate symbols & extremism ──────────────────────────────────────────────
  {
    pattern:
      /\b(swastika|nazi|ss\s*bolts|white\s*power|white\s*pride|kkk|ku\s*klux|black\s*sun|sonnenrad|14\s*words|aryan\s*nation|iron\s*cross\s*ss|celtic\s*cross\s*hate)\b/i,
    userMessage:
      "This design cannot be generated. Contact our team directly if you have a legitimate request.",
  },

  // ── Gang patches & named outlaw MCs (trademarks + liability) ─────────────
  {
    pattern:
      /\b(ms-?13|crips?\s+logo|bloods?\s+logo|hells?\s+angels\s+(mc\s+)?(logo|patch|crest)|bandidos\s+(mc\s+)?(logo|patch|crest)|outlaws\s+(mc\s+)?(logo|patch|crest)|mongols\s+(mc\s+)?(logo|patch)|pagans\s+mc\s+(logo|patch))\b/i,
    userMessage:
      "We cannot reproduce official motorcycle club or gang insignia. Describe your own original club design instead.",
  },

  // ── NFL / NBA / MLB / NHL / MLS / NCAA official logos ────────────────────
  // Match team names + a trademark signal word. "bears camping patch" is fine;
  // "chicago bears logo patch" is blocked.
  {
    pattern:
      /\b(cowboys|patriots|eagles|steelers|packers|bears|chiefs|dolphins|raiders|seahawks|broncos|rams|49ers|giants|jets|ravens|browns|lions|falcons|saints|panthers|buccaneers|cardinals|vikings|colts|texans|jaguars|titans|chargers|bills|bengals)\s+(logo|official|nfl|badge|crest|emblem)/i,
    userMessage:
      "We cannot reproduce official NFL team logos due to trademark restrictions. Describe your own original team design — custom name, colors, and mascot.",
  },
  {
    pattern:
      /\b(lakers|celtics|bulls|warriors|knicks|nets|heat|bucks|suns|mavericks|clippers|nuggets|76ers|raptors|spurs|thunder|jazz|pelicans|grizzlies|magic|wizards|pistons|pacers|hornets|hawks|cavaliers|rockets|blazers|timberwolves|kings)\s+(logo|official|nba|badge|crest|emblem)/i,
    userMessage:
      "We cannot reproduce official NBA team logos due to trademark restrictions. Describe your own original basketball design.",
  },
  {
    pattern:
      /\b(yankees|red\s*sox|cubs|dodgers|giants|cardinals|astros|braves|mets|phillies|nationals|brewers|padres|diamondbacks|rockies|reds|pirates|tigers|white\s*sox|indians|guardians|twins|royals|athletics|mariners|rangers|angels|orioles|blue\s*jays|rays|marlins)\s+(logo|official|mlb|badge|crest|emblem)/i,
    userMessage:
      "We cannot reproduce official MLB team logos due to trademark restrictions. Describe your own original baseball design.",
  },
  {
    pattern:
      /\b(blackhawks|canadiens|leafs|bruins|rangers|penguins|flyers|red\s*wings|blues|lightning|avalanche|stars|golden\s*knights|jets|senators|flames|oilers|canucks|sharks|ducks|kings|devils|islanders|hurricanes|capitals|panthers|predators|sabres|wild|coyotes)\s+(logo|official|nhl|badge|crest|emblem)/i,
    userMessage:
      "We cannot reproduce official NHL team logos due to trademark restrictions. Describe your own original hockey design.",
  },

  // ── Disney / Pixar / Marvel / DC / Nintendo / other major franchises ──────
  {
    pattern:
      /\b(mickey\s*mouse|minnie\s*mouse|donald\s*duck|goofy|stitch|simba|elsa|anna|moana|rapunzel|cinderella|snow\s*white|belle|ariel|tinker\s*bell|buzz\s*lightyear|woody\s+(cowboy|toy)|nemo|dory|wall.?e|up\s+pixar)\b/i,
    userMessage:
      "We cannot reproduce Disney or Pixar characters due to copyright. Describe an original character inspired by a similar style or theme.",
  },
  {
    pattern:
      /\b(spider.?man|batman|superman|wonder\s*woman|iron\s*man|captain\s*america|thor\s+(marvel|avengers|god)|hulk\s+(marvel|avengers)|black\s*widow|hawkeye|black\s*panther|ant.?man|deadpool|wolverine|x.?men\s+logo|avengers\s+logo|justice\s+league\s+logo|joker\s+(dc|batman))\b/i,
    userMessage:
      "We cannot reproduce Marvel or DC superhero characters due to copyright. Describe an original hero design — your own costume, emblem, and colors.",
  },
  {
    pattern:
      /\b(darth\s*vader|stormtrooper|mandalorian\s+logo|boba\s+fett|yoda|r2.?d2|c.?3po|star\s+wars\s+(logo|badge|patch|crest)|jedi\s+order\s+(logo|crest)|rebel\s+alliance\s+(logo|crest)|galactic\s+empire\s+(logo|crest))\b/i,
    userMessage:
      "We cannot reproduce Star Wars characters or official insignia. Describe your own original sci-fi or space design.",
  },
  {
    pattern:
      /\b(pikachu|charizard|mewtwo|eevee|gengar|pokemon\s+(logo|badge|patch)|pokeball\s+official|team\s+rocket\s+logo|mario\s+(logo|nintendo)|luigi\s+(logo|nintendo)|zelda\s+(logo|triforce\s+official)|link\s+(zelda|nintendo)\s+logo|sonic\s+the\s+hedgehog\s+logo|hello\s+kitty\s+(logo|sanrio))\b/i,
    userMessage:
      "We cannot reproduce copyrighted game or anime characters. Describe an original character with your own design.",
  },

  // ── Luxury & streetwear brand logos ───────────────────────────────────────
  {
    pattern:
      /\b(nike\s+(swoosh|logo|just\s+do\s+it)|adidas\s+(three\s+stripes|logo|trefoil)|supreme\s+(box\s+logo|patch)|louis\s+vuitton\s+(logo|monogram|lv\s+pattern)|gucci\s+(logo|gg\s+pattern|double\s+g)|versace\s+medusa\s+logo|chanel\s+(cc\s+logo|double\s+c)|hermes\s+logo|prada\s+triangle\s+logo|off.?white\s+logo|bape\s+(shark|ape\s+head)\s+logo|stussy\s+logo|palace\s+tri.?ferg)\b/i,
    userMessage:
      "We cannot reproduce brand logos due to trademark restrictions. Describe an original design inspired by the style instead.",
  },

  // ── Military medals / actual rank insignia (Stolen Valor risk) ───────────
  // Morale patches are fine; reproduction of real medals / rank badges is not.
  {
    pattern:
      /\b(medal\s+of\s+honor\s+(exact|official|reproduction|replica)|purple\s+heart\s+(medal\s+)?(exact|official|replica)|silver\s+star\s+medal\s+(exact|official|replica)|bronze\s+star\s+medal\s+(exact|official|replica)|presidential\s+unit\s+citation\s+replica|actual\s+military\s+rank\s+badge|reproduction\s+military\s+medal)\b/i,
    userMessage:
      "We cannot reproduce actual military medals or rank insignia. We can make original morale patches and unit patches — just describe your custom design.",
  },
];

/**
 * Check prompt against the patch-industry blocklist.
 * Call BEFORE spending any generation credits.
 */
export function checkBlocklist(prompt: string): Blocked | Allowed {
  for (const entry of BLOCKLIST) {
    if (entry.pattern.test(prompt)) {
      return { blocked: true, userMessage: entry.userMessage };
    }
  }
  return { blocked: false };
}
