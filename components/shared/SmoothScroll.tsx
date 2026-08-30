"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    let lenis: { raf: (time: number) => void; destroy: () => void } | undefined;

    async function initLenis() {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    }

    initLenis();

    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  return null;
}
