"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    let lenis:
      | {
          raf: (time: number) => void;
          destroy: () => void;
          scrollTo: (target: number) => void;
        }
      | undefined;
    let frameId = 0;
    let disposed = false;

    async function init() {
      try {
        const LenisClass = (await import("lenis")).default;
        if (disposed) return;

        lenis = new LenisClass({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 2,
        });

        function raf(time: number) {
          if (disposed || !lenis) return;
          lenis.raf(time);
          frameId = requestAnimationFrame(raf);
        }

        frameId = requestAnimationFrame(raf);
      } catch (err) {
        console.error("Lenis init failed:", err);
      }
    }

    init();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      lenis?.destroy();
    };
  }, [pathname]);

  return null;
}
