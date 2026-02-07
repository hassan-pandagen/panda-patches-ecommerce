import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // <--- CHANGED TO OUTFIT
import "./globals.css";
import TawkToWidget from "@/components/TawkToWidget";

// Configure Outfit Font
const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Panda Patches | Custom Iron On Patches",
  description: "No Minimums, Quick Delivery!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased`}>
        <TawkToWidget />
        {children}
      </body>
    </html>
  );
}
