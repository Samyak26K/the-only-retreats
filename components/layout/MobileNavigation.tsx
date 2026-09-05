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
            {item.label === "roots-and-ore-brand" ? (
              <Link
                href={item.href}
                onClick={onNavigate}
                className="flex min-h-12 flex-col items-center justify-center leading-tight text-foreground transition-colors duration-fast hover:text-forest"
              >
                <span className="font-sanskrit text-sm">मूल • धातु</span>
                <span className="text-[0.45rem] uppercase tracking-[0.2em]">
                  ROOTS AND ORE
                </span>
              </Link>
            ) : (
              <Link
                href={item.href}
                onClick={onNavigate}
                className="flex min-h-12 items-center text-lg font-medium uppercase tracking-[0.2em] text-foreground transition-colors duration-fast hover:text-forest"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
