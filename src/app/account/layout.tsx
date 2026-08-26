import PixelIdentify from "@/components/PixelIdentify";
import { getCurrentUser } from "@/lib/supabase/guards";

/**
 * Authenticated-area layout. Its only job is to attach Meta advanced matching
 * once for every /account/* page (CL4DE6 §2.2) instead of wiring the component
 * into each page separately.
 *
 * Uses getCurrentUser (non-redirecting) rather than requireUser: each page runs
 * its own guard, and a layout must not fight that with a second redirect. When
 * nobody is signed in this renders nothing.
 */
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <>
      <PixelIdentify email={user?.email} />
      {children}
    </>
  );
}
