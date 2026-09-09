import Image from "next/image";

export function BharatBhumiSection() {
  return (
    <section
      id="bharat-bhumi"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#E8D5A3" }}
    >
      <div
        className="relative w-full"
        style={{
          height: "75vh",
          maxHeight: "680px",
          minHeight: "400px",
        }}
      >
        <div className="absolute inset-0 hidden lg:block">
          <Image
            src="/images/origins/bharat-bhumi-map.png"
            alt="Bharat Bhumi - A Living Atlas of India"
            fill
            className="object-cover object-center"
            sizes="(min-width: 1024px) 100vw, 0vw"
            priority={false}
          />
        </div>

        <div
          className="absolute inset-0 lg:hidden"
          style={{
            backgroundImage:
              "url('/images/origins/bharat-bhumi-map-mobile.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />

        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to right, rgba(232,213,163,0.97) 0%, rgba(232,213,163,0.90) 20%, rgba(232,213,163,0.60) 38%, rgba(232,213,163,0.10) 58%, transparent 72%)",
          }}
        />

        <div className="absolute inset-0 z-[2] flex items-center">
          <div className="w-full max-w-[260px] px-5 py-8 sm:max-w-[280px] sm:px-8 md:max-w-[320px] md:px-12 lg:max-w-[360px] lg:px-14 xl:max-w-[400px] xl:px-16">
            <p
              className="mb-3 text-[0.55rem] font-medium uppercase tracking-[0.3em] sm:mb-4 sm:text-[0.6rem]"
              style={{ color: "#8A6B3A" }}
            >
              Our Living Atlas
            </p>

            <h2
              className="font-sanskrit mb-1 text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl"
              style={{ color: "#2C1A0E" }}
            >
              भारतभूमि
            </h2>

            <p
              className="font-heading mb-4 text-lg font-semibold uppercase tracking-[0.1em] sm:mb-5 sm:text-xl md:text-2xl"
              style={{ color: "#2C1A0E" }}
            >
              Bharat Bhumi
            </p>

            <div className="mb-1">
              <p
                className="font-sanskrit text-base leading-snug sm:text-lg"
                style={{ color: "#5A3A1A" }}
              >
                ॐ पृथिव्यै नमः
              </p>
              <p
                className="mt-1 text-[0.58rem] uppercase tracking-[0.18em] sm:text-[0.65rem]"
                style={{ color: "#8A6B3A" }}
              >
                Om Prithivyai Namah
              </p>
              <p
                className="font-body mt-0.5 text-xs italic sm:text-sm"
                style={{ color: "#7A5A2A" }}
              >
                Salutations to Mother Earth
              </p>
            </div>

            <div
              className="my-4 h-px w-7 sm:my-5"
              style={{ backgroundColor: "#B07428" }}
            />

            <div>
              <p
                className="font-heading text-base font-semibold uppercase tracking-[0.2em] sm:text-lg md:text-xl"
                style={{ color: "#2C1A0E" }}
              >
                India
              </p>
              <div
                className="mt-1.5 h-px w-5"
                style={{ backgroundColor: "#B07428" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
