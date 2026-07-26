import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

import { container } from "@/lib/theme";
import { cn } from "@/lib/utils";

type ContainerProps = ComponentPropsWithoutRef<"div">;

const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { className, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("mx-auto w-full", className)}
      style={{
        maxWidth: container.maxWidth,
        paddingInline: container.padding,
        ...style,
      }}
      {...props}
    />
  );
});

Container.displayName = "Container";

export { Container };
