import Image from "next/image";

export function BharatBhumiSection() {
  return (
    <section
      id="bharat-bhumi"
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#E8D5A3",
        maxHeight: "80vh",
        overflow: "hidden",
      }}
    >
      <div
        className="relative w-full"
        style={{
          aspectRatio: "16/9",
          maxHeight: "80vh",
        }}
      >
        <Image
          src="/images/origins/bharat-bhumi-map.png"
          alt="Bharat Bhumi - A Living Atlas of India"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />

        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to right, rgba(232,213,163,0.98) 0%, rgba(232,213,163,0.95) 15%, rgba(232,213,163,0.75) 30%, rgba(232,213,163,0.20) 50%, transparent 65%)",
          }}
        />

        <div className="absolute inset-0 z-[2] flex items-start md:items-center">
          <div className="max-w-[260px] px-5 py-10 md:max-w-[300px] md:px-10 lg:max-w-[340px] lg:px-12">
            <p
              className="mb-4 text-[0.6rem] font-medium uppercase tracking-[0.3em]"
              style={{ color: "#8A6B3A" }}
            >
              Our Living Atlas
            </p>

            <h2
              className="font-sanskrit mb-1 text-4xl leading-tight md:text-5xl"
              style={{ color: "#2C1A0E" }}
            >
              भारतभूमि
            </h2>

            <p
              className="font-heading mb-4 text-xl font-semibold uppercase tracking-[0.1em] md:text-2xl"
              style={{ color: "#2C1A0E" }}
            >
              Bharat Bhumi
            </p>

            <div className="mb-1">
              <p
                className="font-sanskrit text-lg leading-snug"
                style={{ color: "#5A3A1A" }}
              >
                ॐ पृथिव्यै नमः
              </p>
              <p
                className="mt-1 text-[0.65rem] uppercase tracking-[0.18em]"
                style={{ color: "#8A6B3A" }}
              >
                Om Prithivyai Namah
              </p>
              <p
                className="font-body mt-0.5 text-sm italic"
                style={{ color: "#7A5A2A" }}
              >
                Salutations to Mother Earth
              </p>
            </div>

            <div
              className="my-5 h-px w-8"
              style={{ backgroundColor: "#B07428" }}
            />

            <p
              className="font-body text-sm leading-6 md:text-sm md:leading-7"
              style={{ color: "#5A3A1A" }}
            >
              A land of diverse landscapes, timeless wisdom and living
              traditions. From the snow-clad Himalayas to serene coasts, every
              region nurtures a unique story, united by a shared soul.
            </p>

            <div className="mt-8">
              <p
                className="font-heading text-xl font-semibold uppercase tracking-[0.2em]"
                style={{ color: "#2C1A0E" }}
              >
                India
              </p>
              <div
                className="mt-1.5 h-px w-6"
                style={{ backgroundColor: "#B07428" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
