import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import CustomCursor from "@/components/common/CustomCursor";
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

export const metadata: Metadata = {
  title: "TimeValley | Empowering Startups from Day Zero to Global Scale",
  description:
    "TimeValley combines strategic business consulting, co-founder matchmaking, 120h Tutor LMS diplomas, and pre-seed capital investment for tech entrepreneurs.",
  icons: {
    icon: "/images/logos/logo-7.png",
    shortcut: "/images/logos/logo-7.png",
    apple: "/images/logos/logo-7.png",
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
        <link rel="icon" href="/images/logos/logo-7.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/images/logos/logo-7.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logos/logo-7.png" />
        <Script src="https://unpkg.com/lenis@1.1.20/dist/lenis.min.js" strategy="afterInteractive" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF0E9] text-[#1C2B2D] font-sans relative antialiased selection:bg-[#0E6875] selection:text-white">
        <AuthProvider>
          <SmoothScrollProvider>
            {/* Global Interactive Custom Cursor */}
            <CustomCursor />

            {/* Conditional Public Header/Footer vs Admin Fullscreen */}
            <ConditionalLayout>{children}</ConditionalLayout>

            {/* Global Interactive Enrollment & Auth Modal */}
            <EnrollmentModal />
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
