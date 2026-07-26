import Image from "next/image";

import type { Certification } from "@/lib/content/certifications";
import { cn } from "@/lib/utils";

type CertificationItemProps = {
  certification: Certification;
};

export function CertificationItem({ certification }: CertificationItemProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-center justify-center gap-3 rounded-lg border border-border bg-surface px-4 py-4 text-center md:min-w-[12rem]",
      )}
    >
      <Image
        src={certification.icon}
        alt=""
        aria-hidden="true"
        width={20}
        height={20}
        className="h-5 w-5 shrink-0"
      />
      <span className="text-sm font-medium tracking-[0.02em] text-foreground">
        {certification.name}
      </span>
    </div>
  );
}
