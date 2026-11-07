import Link from "next/link";
import { NavTabs } from "./NavTabs";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link href="/" className="flex min-h-11 items-center text-lg font-bold tracking-tight">
          ML<span className="text-accent">.notes</span>
        </Link>
        <div className="flex items-center gap-2">
          <NavTabs />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
