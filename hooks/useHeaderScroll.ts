"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether the page has scrolled past `threshold` so the Navbar can
 * transition from transparent (over the Hero) to a solid paper background.
 * Uses a passive scroll listener per the Navbar spec's performance rules.
 */
export function useHeaderScroll(threshold = 12) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return isScrolled;
}
