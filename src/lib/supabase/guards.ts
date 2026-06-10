import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./server";

/**
 * Server-side auth guard for /account/* pages.
 *
 * Call at the top of any /account page's default-exported server component.
 * If no user is signed in, redirects to /login with ?returnTo set so the user
 * lands back on the page they wanted after signing in.
 *
 * Usage:
 *   export default async function AccountDashboardPage() {
 *     const { user, supabase } = await requireUser("/account");
 *     // ...fetch data using supabase, RLS enforces user-scoped reads
 *   }
 */
export async function requireUser(returnTo: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  return { user, supabase };
}

/**
 * Optional sibling: read the current user without forcing a redirect.
 * Useful in the Navbar to render "Sign In" vs avatar+dropdown.
 */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
