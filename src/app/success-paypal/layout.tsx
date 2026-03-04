import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Processing | Panda Patches",
  description: "Your PayPal payment is being processed. You will be redirected shortly.",
  robots: { index: false, follow: false },
};

export default function PayPalSuccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
