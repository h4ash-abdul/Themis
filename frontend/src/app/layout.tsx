import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import { ScrambledTitle } from "@/components/ui/modern-animated-hero-section";

export const metadata: Metadata = {
  title: "THEMIS",
  description: "Interactive Fraud Inoculation Simulator",
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
        <div className="flex flex-col min-h-screen p-6 md:p-12 z-10 relative">
          <header className="flex items-center justify-between border-b border-neutral-800 pb-6 mb-12 shrink-0">
            <Link href="/" className="text-xl font-bold tracking-tighter text-white hover:text-red-500 transition-colors">
              <ScrambledTitle />
            </Link>
            <nav className="text-sm font-mono text-neutral-300 font-semibold drop-shadow-md uppercase flex gap-6">
              <Link href="/" className="hover:text-white transition-colors">Simulator</Link>
              <Link href="/learn" className="hover:text-white transition-colors">Learn</Link>
              <Link href="/quiz" className="hover:text-white transition-colors">Quiz</Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="/reports" className="hover:text-white transition-colors">Reports</Link>
            </nav>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="mt-24 pt-6 border-t border-neutral-800 text-xs text-neutral-400 font-semibold drop-shadow-md font-mono flex justify-between shrink-0">
            <div>SYS_STATUS: ONLINE</div>
            <div>SESSION_ENCRYPTED</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
