import Link from "next/link";
import { NavTabs } from "./NavTabs";
import { ThemeToggle } from "./ThemeToggle";

// On phones the tabs move to their own row below the logo, so all three fit.
export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-2 gap-y-1 px-4 py-2 sm:px-6">
        <Link href="/" className="order-1 flex min-h-12 items-center text-lg font-bold tracking-tight">
          ML<span className="text-accent">.notes</span>
        </Link>
        <div className="order-3 w-full sm:order-2 sm:ml-auto sm:w-auto">
          <NavTabs />
        </div>
        <div className="order-2 sm:order-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
