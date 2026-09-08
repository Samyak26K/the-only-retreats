import Image from "next/image";

import { Container } from "@/components/ui/Container";

export function BharatBhumiSection() {
  return (
    <section
      id="bharat-bhumi"
      className="relative overflow-hidden"
      style={{ backgroundColor: "#F5EDD8" }}
    >
      <Container className="max-w-none px-0 py-0 md:px-0 lg:px-0">
        <div className="grid min-h-[600px] grid-cols-1 lg:min-h-[700px] lg:grid-cols-2">
          <div
            className="order-2 flex flex-col justify-center px-6 py-16 md:px-12 lg:order-1 lg:px-16 xl:px-20"
            style={{ backgroundColor: "#F5EDD8" }}
          >
            <p
              className="mb-6 text-[0.6rem] font-medium uppercase tracking-[0.3em]"
              style={{ color: "#8A6B3A" }}
            >
              Our Living Atlas
            </p>

            <h2
              className="font-sanskrit mb-2 text-4xl leading-tight md:text-5xl lg:text-6xl"
              style={{ color: "#2C1A0E" }}
            >
              भारतभूमि
            </h2>

            <p
              className="font-heading mb-6 text-2xl font-semibold uppercase tracking-[0.08em] md:text-3xl"
              style={{ color: "#2C1A0E" }}
            >
              Bharat Bhumi
            </p>

            <div className="mb-2">
              <p
                className="font-sanskrit text-lg leading-snug"
                style={{ color: "#5A3A1A" }}
              >
                ॐ पृथिव्यै नमः
              </p>
              <p
                className="mt-1 text-xs uppercase tracking-[0.18em]"
                style={{ color: "#8A6B3A" }}
              >
                Om Prithivyai Namah
              </p>
              <p
                className="font-body mt-1 text-sm italic"
                style={{ color: "#7A5A2A" }}
              >
                Salutations to Mother Earth
              </p>
            </div>

            <div
              className="my-6 h-px w-8"
              style={{ backgroundColor: "#B07428" }}
            />

            <p
              className="font-body max-w-sm text-sm leading-7"
              style={{ color: "#5A3A1A" }}
            >
              A land of diverse landscapes, timeless wisdom and living
              traditions. From the snow-clad Himalayas to serene coasts, every
              region nurtures a unique story, united by a shared soul.
            </p>

            <div className="mt-10">
              <p
                className="font-heading text-xl font-semibold uppercase tracking-[0.2em]"
                style={{ color: "#2C1A0E" }}
              >
                India
              </p>
              <div
                className="mt-2 h-px w-6"
                style={{ backgroundColor: "#B07428" }}
              />
            </div>
          </div>

          <div className="relative order-1 aspect-video lg:order-2 lg:aspect-auto">
            <Image
              src="/images/origins/bharat-bhumi-map.png"
              alt="Bharat Bhumi - A Living Atlas of India"
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority={false}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
