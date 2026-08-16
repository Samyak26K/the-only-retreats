"use client";

import { useMemo, useState } from "react";

import type { Valley } from "@/lib/content/valleys";
import { FeaturedValleyPanel } from "./FeaturedValleyPanel";
import { ValleySelector } from "./ValleySelector";

type ValleyExperienceProps = {
  valleys: Valley[];
};

export function ValleyExperience({ valleys }: ValleyExperienceProps) {
  const [selectedSlug, setSelectedSlug] = useState(valleys[0]?.slug ?? "");

  const selectedValley = useMemo(
    () => valleys.find((valley) => valley.slug === selectedSlug) ?? valleys[0],
    [valleys, selectedSlug],
  );

  if (!selectedValley) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <FeaturedValleyPanel valley={selectedValley} />
      <ValleySelector
        valleys={valleys}
        selectedSlug={selectedValley.slug}
        onSelect={setSelectedSlug}
      />
    </div>
  );
}
