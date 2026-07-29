import Link from "next/link";
import { getLoyaltyStatus } from "@/lib/loyalty";

/**
 * Account tier badge (loyalty Task 3). Server component: reads loyalty-status for
 * the signed-in user's own email server-to-server (no email param exposed to the
 * client, no secret in the bundle). Renders NOTHING for tier "none", when status
 * is unavailable, or before the owner sets LOYALTY_VALIDATE_SECRET — so it degrades
 * silently instead of erroring.
 */
const TIER_META: Record<
  string,
  { label: string; nextThreshold: number | null; nextLabel: string | null; ring: string; bg: string; text: string }
> = {
  bronze: { label: "Bronze", nextThreshold: 5000, nextLabel: "Silver", ring: "border-[#CD7F32]", bg: "bg-[#CD7F32]/10", text: "text-[#8a5a24]" },
  silver: { label: "Silver", nextThreshold: 10000, nextLabel: "Gold", ring: "border-gray-400", bg: "bg-gray-100", text: "text-gray-700" },
  gold: { label: "Gold", nextThreshold: null, nextLabel: null, ring: "border-panda-yellow", bg: "bg-panda-yellow/15", text: "text-[#8a6d00]" },
};

const CURRENT_THRESHOLD: Record<string, number> = { bronze: 1000, silver: 5000, gold: 10000 };

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

const DEAD_STATUSES = new Set(["redeemed", "used", "expired", "revoked", "cancelled"]);

export default async function LoyaltyBadge({ email }: { email?: string | null }) {
  if (!email) return null;

  const status = await getLoyaltyStatus(email);
  if (!status || status.tier === "none") return null;

  const meta = TIER_META[status.tier];
  if (!meta) return null;

  const spent = status.lifetime_paid_value || 0;
  const current = CURRENT_THRESHOLD[status.tier] || 0;
  const activeCode = status.codes.find((c) => !DEAD_STATUSES.has((c.status || "").toLowerCase()));

  let progressPct = 100;
  let toNext = 0;
  if (meta.nextThreshold) {
    toNext = Math.max(0, meta.nextThreshold - spent);
    const span = meta.nextThreshold - current;
    progressPct = span > 0 ? Math.min(100, Math.max(0, ((spent - current) / span) * 100)) : 100;
  }

  return (
    <div className={`rounded-[20px] border-2 ${meta.ring} ${meta.bg} p-6 mb-10`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-[0.75rem] font-black uppercase tracking-[2px] text-panda-green mb-1">Panda Patches Rewards</p>
          <p className={`text-[1.5rem] font-black ${meta.text}`}>{meta.label} member</p>
          <p className="text-[0.8125rem] text-gray-600 mt-1">{money(spent)} lifetime spend</p>
        </div>
        {activeCode && (
          <div className="text-right">
            <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 mb-1">Your code</p>
            <p className="font-mono text-[1rem] font-black text-panda-dark bg-white border border-gray-200 rounded-lg px-3 py-1.5 inline-block">
              {activeCode.code}
            </p>
            <p className="text-[0.6875rem] text-gray-500 mt-1">{activeCode.percent}% off standard pricing</p>
          </div>
        )}
      </div>

      {meta.nextThreshold ? (
        <div>
          <div className="flex justify-between text-[0.75rem] font-semibold text-gray-600 mb-1.5">
            <span>Progress to {meta.nextLabel}</span>
            <span>{money(toNext)} to go</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/70 overflow-hidden">
            <div className="h-full bg-panda-green rounded-full" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      ) : (
        <p className="text-[0.8125rem] font-semibold text-gray-600">You&rsquo;ve reached the top tier &mdash; thank you.</p>
      )}

      <Link href="/rewards" prefetch={false} className="inline-block text-[0.8125rem] font-bold text-panda-green underline mt-4">
        How rewards work
      </Link>
    </div>
  );
}
