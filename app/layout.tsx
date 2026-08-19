import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import { CustomCursor } from "@/components/CustomCursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Premium Portfolio",
  description: "Software Engineering, AI, Product Thinking",
};

/* Matches mobile browser chrome to the active theme. Zoom is intentionally left
   unrestricted — no maximumScale/userScalable. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3F4F6" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0C0E" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
        <Providers>
          <CustomCursor />
          <Navigation />
          <SmoothScroll>
            <main className="flex-grow">
              {children}
            </main>
          </SmoothScroll>
          <footer className="mt-auto border-t border-border py-8 text-center z-10 relative bg-background">
            <p className="text-sm text-muted">
              Designed &amp; Built with{" "}
              <span className="text-foreground">intention</span>. &copy;{" "}
              {new Date().getFullYear()}
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
