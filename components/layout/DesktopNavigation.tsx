"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigationContent } from "@/lib/content/navigation";
import { cn } from "@/lib/utils";

type DesktopNavigationProps = {
  isScrolled: boolean;
};

export function DesktopNavigation({ isScrolled }: DesktopNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="hidden items-center justify-center md:flex"
    >
      <ul className="flex items-center gap-1 md:gap-2 lg:gap-4 xl:gap-6">
        {navigationContent.primaryLinks.map((item) => {
          // Every link today points at an in-page anchor on the single
          // homepage route, so this never matches yet. It lights up once an
          // item becomes a real route (e.g. /journey) per the Navbar spec's
          // future scalability note, with no markup changes required.
          const isActive = pathname === item.href;

          return (
            <li key={item.label}>
              {item.label === "roots-and-ore-brand" ? (
                <Link
                  href={item.href}
                  className="flex flex-col items-center whitespace-nowrap leading-tight text-[0.6rem] md:text-[0.65rem] lg:text-[0.7rem] xl:text-sm uppercase tracking-[0.08em] md:tracking-[0.1em] lg:tracking-[0.15em] xl:tracking-[0.18em] transition-colors duration-normal"
                >
                  <span
                    className="font-sanskrit text-[0.6rem] md:text-[0.65rem] lg:text-[0.7rem] xl:text-sm"
                    style={{ color: isScrolled ? undefined : "inherit" }}
                  >
                    मूल • धातु
                  </span>
                  <span className="text-[0.4rem] md:text-[0.45rem] uppercase tracking-[0.08em] md:tracking-[0.1em] lg:tracking-[0.15em] xl:tracking-[0.18em]">
                    ROOTS AND ORE
                  </span>
                </Link>
              ) : (
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative inline-flex whitespace-nowrap py-2 text-[0.6rem] md:text-[0.65rem] lg:text-[0.7rem] xl:text-sm uppercase tracking-[0.08em] md:tracking-[0.1em] lg:tracking-[0.15em] xl:tracking-[0.18em] transition-colors duration-normal",
                    isActive
                      ? "font-semibold text-forest"
                      : cn(
                          "font-medium",
                          isScrolled
                            ? "text-foreground/70 hover:text-foreground"
                            : "text-white/80 hover:text-white",
                        ),
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-250 ease-out",
                      isActive
                        ? "scale-x-100 bg-forest"
                        : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
