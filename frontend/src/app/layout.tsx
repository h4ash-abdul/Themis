import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "THEMIS",
  description: "Interactive Fraud Inoculation Simulator",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans antialiased">
        <BackgroundWrapper />
        <LanguageProvider>
          <div className="flex flex-col min-h-screen p-4 md:p-8 lg:p-12 z-10 relative">
            <Navbar />
            
            <main className="flex-1">
              {children}
            </main>
            
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
