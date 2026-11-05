import { CREATOR_NAME } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line px-4 py-6 text-center text-sm text-muted">
      Made by <span className="font-semibold text-soft">{CREATOR_NAME}</span>
    </footer>
  );
}
