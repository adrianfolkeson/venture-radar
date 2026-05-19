import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border bg-panel/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-base font-semibold tracking-tight text-ink">
          <span className="text-accent">●</span> Venture Radar
        </Link>
        <nav className="text-sm text-mute">
          <a
            href="https://github.com"
            className="hover:text-ink"
            target="_blank"
            rel="noreferrer"
          >
            docs
          </a>
        </nav>
      </div>
    </header>
  );
}
