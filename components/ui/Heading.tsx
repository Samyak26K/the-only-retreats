import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type HeadingAlignment = "left" | "center" | "right";

type HeadingProps = ComponentPropsWithoutRef<"div"> & {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  alignment?: HeadingAlignment;
};

const alignmentClasses: Record<HeadingAlignment, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

const Heading = forwardRef<HTMLDivElement, HeadingProps>(function Heading(
  { eyebrow, title, subtitle, alignment = "left", className, ...props },
  ref,
) {
  const hasEyebrow = Boolean(eyebrow);
  const hasSubtitle = Boolean(subtitle);

  return (
    <div
      ref={ref}
      className={cn(
        "flex max-w-3xl flex-col gap-3 sm:gap-4",
        alignmentClasses[alignment],
        className,
      )}
      {...props}
    >
      {hasEyebrow ? (
        <p className="font-sanskrit text-[0.75rem] uppercase tracking-[0.28em] text-muted sm:text-sm">
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="font-display text-[clamp(2.25rem,4vw,4.75rem)] leading-[0.95] tracking-[-0.04em] text-foreground">
          {title}
        </h2>
        {hasSubtitle ? (
          <p className="font-body text-base leading-7 text-muted sm:text-lg sm:leading-8">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
});

Heading.displayName = "Heading";

export { Heading };
