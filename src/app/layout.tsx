import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // <--- CHANGED TO OUTFIT
import "./globals.css";
import TawkToWidget from "@/components/TawkToWidget";
import { generateOrganizationSchema, generateSchemaScript } from "@/lib/schemas";

// Configure Outfit Font
const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Panda Patches | Custom Iron On Patches",
  description: "Low Minimums, Quick Delivery!",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased`}>
        {/* Global Organization Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateSchemaScript(generateOrganizationSchema())}
        />

        <TawkToWidget />
        {children}
      </body>
    </html>
  );
}
