import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import CustomCursor from "@/components/common/CustomCursor";
import CustomContextMenu from "@/components/common/CustomContextMenu";
import SmoothScrollProvider from "@/components/common/SmoothScrollProvider";

import { AuthProvider } from "@/context/AuthContext";
import EnrollmentModal from "@/components/auth/EnrollmentModal";

import Script from "next/script";

const tajawal = Tajawal({
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0E6875",
};

export const metadata: Metadata = {
  title: "TimeValley | Empowering Startups from Day Zero to Global Scale",
  description:
    "TimeValley combines strategic business consulting, co-founder matchmaking, 120h Tutor LMS diplomas, and pre-seed capital investment for tech entrepreneurs.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TimeValley",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" data-scroll-behavior="smooth" className={tajawal.variable}>
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" type="image/png" sizes="192x192" />
        <link rel="shortcut icon" href="/icons/icon-192x192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <Script src="https://unpkg.com/lenis@1.1.20/dist/lenis.min.js" strategy="afterInteractive" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF0E9] text-[#1C2B2D] font-sans relative antialiased selection:bg-[#0E6875] selection:text-white">
        <AuthProvider>
          <SmoothScrollProvider>
            {/* Global Interactive Custom Cursor */}
            <CustomCursor />

            {/* Global 1-Second Right-Click Navigation Menu */}
            <CustomContextMenu />

            {/* Conditional Public Header/Footer vs Admin Fullscreen */}
            <ConditionalLayout>{children}</ConditionalLayout>
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
