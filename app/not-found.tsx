import Link from "next/link";
import { FooterSection } from "@/components/sections/Footer";

export default function NotFound() {
  return (
    <>
      <div
        className="h-(--navbar-height-mobile) 
        md:h-(--navbar-height-tablet) 
        lg:h-(--navbar-height-desktop)"
      />

      <div
        className="min-h-[70vh] flex flex-col items-center 
        justify-center text-center px-6"
      >
        <p
          className="font-display text-[8rem] leading-none 
          text-foreground/5 select-none mb-8"
        >
          404
        </p>

        <p
          className="text-[0.6rem] uppercase tracking-[0.24em] 
          text-gold mb-4"
        >
          Page Not Found
        </p>

        <h1
          className="font-display text-3xl md:text-4xl 
          tracking-[-0.03em] text-foreground mb-4"
        >
          This path leads nowhere.
        </h1>

        <p className="text-sm text-muted max-w-sm mb-10 leading-6">
          The page you are looking for does not exist or has been moved. Return
          to the source.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center 
              px-6 py-3 rounded-full text-xs uppercase 
              tracking-[0.2em] bg-forest text-white 
              hover:bg-forest/90 transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center 
              px-6 py-3 rounded-full text-xs uppercase 
              tracking-[0.2em] border border-border 
              text-foreground hover:border-gold hover:text-gold 
              transition-colors"
          >
            Browse Collection
          </Link>
        </div>
      </div>

      <FooterSection />
    </>
  );
}
