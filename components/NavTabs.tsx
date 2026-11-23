"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Notes" },
  { href: "/metrics", label: "Metrics" },
  { href: "/preprocessing", label: "Data Prep" },
];

// "Notes" covers the home page and every concept page.
function activeHref(pathname: string) {
  const match = TABS.find((tab) => tab.href !== "/" && pathname.startsWith(tab.href));
  return match ? match.href : "/";
}

export function NavTabs() {
  const current = activeHref(usePathname());
  return (
    <nav aria-label="Main" className="grid grid-cols-3 gap-1 sm:flex">
      {TABS.map((tab) => {
        const active = tab.href === current;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center justify-center rounded-lg px-3 text-[15px] font-semibold ${
              active ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
