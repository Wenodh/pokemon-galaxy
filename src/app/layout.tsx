import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { RootProvider } from "@/components/providers/root-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { RouteAnnouncer } from "@/components/layout/route-announcer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  title: "Pokemon Galaxy",
  description: "Explore the Pokémon universe with a fast, beautiful, and modern Pokédex.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pokemon Galaxy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <RootProvider>
          <SkipToContent />
          <RouteAnnouncer />
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="bottom-right" closeButton richColors />
        </RootProvider>
      </body>
    </html>
  );
}
