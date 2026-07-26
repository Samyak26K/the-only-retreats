import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type SectionBackground = "background" | "surface" | "transparent";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  background?: SectionBackground;
};

const backgroundStyles: Record<SectionBackground, string> = {
  background: "bg-background text-foreground",
  surface: "bg-surface text-foreground",
  transparent: "bg-transparent text-inherit",
};

const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { background = "background", className, children, ...props },
  ref,
) {
  return (
    <section
      ref={ref}
      className={cn(
        "py-[3.5rem] md:py-20 xl:py-[7.5rem]",
        backgroundStyles[background],
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
});

Section.displayName = "Section";

export { Section };
