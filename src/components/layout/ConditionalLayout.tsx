"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const TopBar = dynamic(() => import("@/components/layout/TopBar"), { ssr: false });

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  const isWorkspaceRoute = pathname?.startsWith("/workspace");

  if (isAdminRoute || isAuthRoute) {
    return (
      <div className="min-h-screen flex flex-col" suppressHydrationWarning>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning>
      <TopBar />
      <Navbar />
      <main className="flex-1 z-10">{children}</main>
      {!isWorkspaceRoute && <Footer />}
    </div>
  );
}
