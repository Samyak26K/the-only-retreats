"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    let frameId = 0;
    let disposed = false;
    let lenis:
      | {
          raf: (time: number) => void;
          destroy: () => void;
        }
      | undefined;

    async function initLenis() {
      const LenisClass = (await import("lenis")).default;

      if (disposed) return;

      lenis = new LenisClass({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time: number) {
        if (!lenis || disposed) return;
        lenis.raf(time);
        frameId = requestAnimationFrame(raf);
      }

      frameId = requestAnimationFrame(raf);
    }

    initLenis();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      lenis?.destroy();
    };
  }, []);

  return null;
}
