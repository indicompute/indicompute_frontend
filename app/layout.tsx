import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "IndiCompute",
  description: "Next.js 14 stable version for IndiCompute Frontend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-gray-900 text-white min-h-screen flex flex-col`}
      >
        {/* 🔹 Global Navbar */}
        <nav className="flex justify-center gap-8 bg-gray-800 py-4 shadow-md border-b border-gray-700">
          <a href="/dashboard" className="hover:text-green-400 font-medium">
            Dashboard
          </a>
          <a href="/wallet" className="hover:text-green-400 font-medium">
            Wallet
          </a>
          <a href="/marketplace" className="hover:text-green-400 font-medium">
            Marketplace
          </a>
          <a href="/jobs" className="hover:text-green-400 font-medium">
            Jobs
          </a>
        </nav>

        {/* 🔹 Main Page Content */}
        <main className="flex-1">{children}</main>

        {/* 🔹 Footer (Optional) */}
        <footer className="text-center text-sm text-gray-500 py-4 border-t border-gray-800">
          © {new Date().getFullYear()} IndiCompute — Powered by AI Compute Network
        </footer>
      </body>
    </html>
  );
}
