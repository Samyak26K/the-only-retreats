"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "fade";
};

export function RevealOnScroll({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  const baseClass =
    direction === "left"
      ? "reveal-left"
      : direction === "fade"
        ? "reveal-fade"
        : "reveal";

  return (
    <div ref={ref} className={`${baseClass} ${className}`}>
      {children}
    </div>
  );
}
