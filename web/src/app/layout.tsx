import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"; // 1. Added Analytics Import
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Brief 24 | The Bleeding Edge of AI",
  description: "Curated, real-time intelligence on Artificial Intelligence, Machine Learning, and Robotics. Stay ahead of the curve.",
  keywords: [
    "AI news",
    "artificial intelligence",
    "machine learning",
    "AI tools",
    "SaaS launches",
    "startups",
    "TechCrunch AI",
    "Y Combinator startups",
    "Hugging Face models",
    "Product Hunt tools",
    "robotics"
  ],
  authors: [{ name: "AI Brief 24" }],
  openGraph: {
    title: "AI Brief 24 | The Bleeding Edge of AI",
    description: "Curated, real-time intelligence on Artificial Intelligence, Machine Learning, and Robotics.",
    url: "https://aibrief24.com",
    siteName: "AI Brief 24",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Brief 24 | The Bleeding Edge of AI",
    description: "Curated, real-time intelligence on Artificial Intelligence, Machine Learning, and Robotics.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-white selection:bg-indigo-500/30 selection:text-indigo-200`}>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-white/10">
                    <span className="text-white font-black text-sm tracking-tighter">AI</span>
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white">
                    Brief<span className="text-indigo-400">24</span>
                  </span>
                </div>
                <div className="hidden sm:block">
                  <a
                    href="https://t.me/aibrief24"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-white/80 hover:text-white transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.08] px-5 py-2.5 rounded-full border border-white/10 hover:border-indigo-400/30 hover:shadow-[0_0_15px_rgba(79,70,229,0.15)]"
                  >
                    Join Telegram Channel
                  </a>
                </div>
              </div>
            </div>
          </header>
          
          <div className="flex-1">
            {children}
          </div>

          <footer className="border-t border-white/5 py-12 mt-20 bg-black/40 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-white/40 font-medium">
              <p>&copy; {new Date().getFullYear()} AI Brief 24. All rights reserved.</p>
              <p className="mt-2 text-white/30">Automated intelligence gathering for the future.</p>
            </div>
          </footer>
        </div>
        {/* 2. Added the Analytics component just before the body closes */}
        <Analytics />
      </body>
    </html>
  );
}
