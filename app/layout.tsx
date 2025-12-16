import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ProgressBarProvider from '@/components/ProgressBarProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zee Crown Admin",
  description: "Admin panel for Zee Crown",
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // If publishable key is missing, render without ClerkProvider (for build)
  if (!publishableKey) {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ProgressBarProvider>
            {children}
          </ProgressBarProvider>
          <Toaster richColors position="top-right" />
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* ✅ The ProgressBarProvider handles the top loading bar.
            We have removed the <Suspense> and <NavigationLoader>
          */}
          <ProgressBarProvider>
            {children}
          </ProgressBarProvider>

          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}