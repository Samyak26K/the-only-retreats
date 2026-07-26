import Link from "next/link";

const navItems = [
  { label: "Journey", href: "#journey" },
  { label: "Collection", href: "#collection" },
  { label: "Origins", href: "#origins" },
  { label: "Heritage", href: "#heritage" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];

export function MobileNavigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Mobile" className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {navItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="block text-base font-medium uppercase tracking-[0.24em] text-foreground transition-colors hover:text-muted"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
