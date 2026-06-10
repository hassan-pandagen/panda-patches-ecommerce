"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserPlus, LogOut, Package, UserCircle, ChevronDown } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface MiniUser {
  email: string | null;
  full_name: string | null;
}

export default function NavbarAuth() {
  const [user, setUser] = useState<MiniUser | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let mounted = true;

    const loadUser = async () => {
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!u) {
        setUser(null);
        setLoaded(true);
        return;
      }
      const meta = (u.user_metadata as any) || {};
      setUser({
        email: u.email || null,
        full_name: meta.full_name || null,
      });
      setLoaded(true);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (!session?.user) {
        setUser(null);
        return;
      }
      const meta = (session.user.user_metadata as any) || {};
      setUser({
        email: session.user.email || null,
        full_name: meta.full_name || null,
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Reserve the exact pill footprint so the layout does not flicker before
  // we know whether the user is signed in. Matches the pill width range.
  if (!loaded) {
    return <div className="w-[170px] h-[46px]" aria-hidden="true" />;
  }

  // Signed-out: render the same dark-green pill the Sample Box button used,
  // re-purposed as the primary auth CTA. Visual weight unchanged.
  if (!user) {
    return (
      <Link
        href="/login"
        prefetch={false}
        className="flex items-center gap-2 bg-[#051C05] text-[#DFFF00] font-bold text-[14px] px-5 py-3 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group whitespace-nowrap"
      >
        <UserPlus size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
        <span>Login / Register</span>
      </Link>
    );
  }

  // Signed-in: avatar pill + dropdown. Same dark-green base so the visual
  // language stays consistent with the signed-out state.
  // Use the first token of full_name so the pill stays compact ("Hassan" vs
  // "Hassan Jamal"). Fall back to email prefix when full_name is empty.
  const displayName =
    user.full_name?.trim().split(/\s+/)[0] ||
    user.email?.split("@")[0] ||
    "Account";
  const initials = (user.full_name || user.email || "?")
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="flex items-center gap-2 bg-[#051C05] text-[#DFFF00] font-bold text-[14px] px-3 py-2 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
      >
        <span className="w-8 h-8 rounded-full bg-[#DFFF00] text-[#051C05] font-black text-[12px] flex items-center justify-center">
          {initials}
        </span>
        <span className="text-[13px] font-bold max-w-[120px] truncate">{displayName}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white border border-gray-200 rounded-[14px] shadow-xl py-2 z-50">
          <Link
            href="/account"
            prefetch={false}
            className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-[#F9FAF5] hover:text-panda-dark transition-colors"
          >
            <UserCircle size={16} className="text-panda-green" />
            My Account
          </Link>
          <Link
            href="/account/orders"
            prefetch={false}
            className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-[#F9FAF5] hover:text-panda-dark transition-colors"
          >
            <Package size={16} className="text-panda-green" />
            My Orders
          </Link>
          <div className="my-1 border-t border-gray-100" />
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-[#F9FAF5] hover:text-panda-dark transition-colors text-left"
            >
              <LogOut size={16} className="text-gray-400" />
              Sign Out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
