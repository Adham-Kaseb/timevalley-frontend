"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
}

export default function Breadcrumbs({ customItems }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Hide on homepage unless custom items are provided
  if (pathname === "/" && !customItems) {
    return null;
  }

  // Parse path segments
  const pathSegments = pathname.split("/").filter(Boolean);

  // Segment Label Dictionary
  const labelMap: { [key: string]: string } = {
    diplomas: "Diploma",
    ideation: "Ideation Matrix",
    "market-research": "Market Research",
    teams: "Build Team",
    founder: "Founder: Dr. Wael",
    events: "Pitch & Events",
    "content-library": "Content Library",
    community: "Ecosystem Community",
    about: "About Us",
    register: "Student Registration",
    login: "Student Sign In",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
  };

  const items: BreadcrumbItem[] = customItems || [
    { label: "Home", href: "/" },
    ...pathSegments.map((segment, idx) => {
      const href = "/" + pathSegments.slice(0, idx + 1).join("/");
      const label = labelMap[segment] || segment.replace(/-/g, " ");
      return {
        label: label.charAt(0).toUpperCase() + label.slice(1),
        href,
      };
    }),
  ];

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className="py-3 flex items-center text-xs font-semibold text-gray-500 overflow-x-auto"
    >
      <div className="bg-white/90 backdrop-blur-md border border-gray-200/90 rounded-full px-4 py-2 shadow-2xs inline-flex items-center gap-2.5">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const isFirst = idx === 0;

          return (
            <div key={idx} className="flex items-center gap-2.5 shrink-0">
              {!isFirst && (
                <i className="fa-solid fa-chevron-right text-[#EDA296] text-[10px]"></i>
              )}

              {isFirst ? (
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-gray-700 hover:text-[#0E6875] transition-colors"
                >
                  <i className="fa-solid fa-house text-[#0E6875] text-xs"></i>
                  <span>Home</span>
                </Link>
              ) : isLast ? (
                <span className="text-[#0E6875] font-extrabold">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-[#0E6875] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-600 font-medium">{item.label}</span>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
