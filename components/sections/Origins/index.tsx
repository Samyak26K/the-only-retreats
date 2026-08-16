import { valleys } from "@/lib/content/valleys";
import { ValleyExperience } from "./ValleyExperience";

const publishedValleys = valleys
  .filter((valley) => valley.isPublished)
  .sort((first, second) => first.order - second.order);

export function OriginsSection() {
  return (
    <section id="origins" aria-label="Where it comes from">
      <ValleyExperience valleys={publishedValleys} />
    </section>
  );
}
