import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type DividerVariant = "short" | "long" | "center";

type DividerProps = ComponentPropsWithoutRef<"hr"> & {
  variant?: DividerVariant;
};

const variantClasses: Record<DividerVariant, string> = {
  short: "w-16",
  long: "w-full",
  center: "mx-auto w-16",
};

const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider(
  { className, variant = "long", ...props },
  ref,
) {
  return (
    <hr
      ref={ref}
      aria-orientation="horizontal"
      className={cn(
        "border-t border-border",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
});

Divider.displayName = "Divider";

export { Divider };
