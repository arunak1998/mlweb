"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Notes" },
  { href: "/metrics", label: "Metrics" },
];

function isActive(pathname: string, href: string) {
  if (href === "/metrics") return pathname.startsWith("/metrics");
  return !pathname.startsWith("/metrics");
}

export function NavTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="flex items-center gap-1">
      {TABS.map((tab) => {
        const active = isActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center rounded-lg px-3 text-[15px] font-semibold ${
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
