import Link from "next/link";

import { navigationContent } from "@/lib/content/navigation";

type MobileNavigationProps = {
  onNavigate?: () => void;
};

export function MobileNavigation({ onNavigate }: MobileNavigationProps) {
  return (
    <nav aria-label="Mobile" className="flex flex-col">
      <ul className="flex flex-col gap-3">
        {navigationContent.primaryLinks.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="flex min-h-12 items-center text-lg font-medium uppercase tracking-[0.2em] text-foreground transition-colors duration-fast hover:text-forest"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
