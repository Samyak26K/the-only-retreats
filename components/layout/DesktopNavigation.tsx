import Link from "next/link";

const navItems = [
  { label: "Journey", href: "#journey" },
  { label: "Collection", href: "#collection" },
  { label: "Origins", href: "#origins" },
  { label: "Heritage", href: "#heritage" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];

export function DesktopNavigation() {
  return (
    <nav
      aria-label="Primary"
      className="hidden flex-1 items-center justify-center md:flex"
    >
      <ul className="flex items-center gap-6 xl:gap-8">
        {navItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-[0.8rem] font-medium uppercase tracking-[0.24em] text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
