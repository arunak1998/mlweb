import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <Link href="/" className="mt-6 inline-flex min-h-12 items-center font-semibold text-accent">
        ← Back to all concepts
      </Link>
    </div>
  );
}
