import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = ComponentPropsWithoutRef<"div">;

const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full max-w-(--container-max-width) px-6 md:px-12 lg:px-20",
        className,
      )}
      {...props}
    />
  );
});

Container.displayName = "Container";

export { Container };
