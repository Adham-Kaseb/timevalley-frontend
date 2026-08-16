"use client";

import { usePathname } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  if (isAdminRoute || isAuthRoute) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="flex-1 z-10">{children}</main>
      <Footer />
    </>
  );
}
