import { Container } from "@/components/ui/Container";
import { ProductsGrid } from "@/components/product/ProductsGrid";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: {
      status: {
        in: ["ACTIVE", "COMING_SOON", "SEASONAL", "SOLD_OUT", "DRAFT"],
      },
      OR: [
        { brand: "Himalayan" },
        { brand: "The Only Retreats" },
        { brand: null },
        { brand: "" },
      ],
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      primaryOrigin: {
        select: { name: true },
      },
      media: {
        orderBy: { sortOrder: "asc" },
        select: {
          url: true,
          alt: true,
        },
        take: 1,
      },
      variants: {
        where: { status: "ACTIVE" },
        select: {
          sellingPrice: true,
        },
      },
    },
  });

  return (
    <section className="bg-background">
      <div
        aria-hidden="true"
        className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)"
      />

      <Container>
        <header className="border-b border-border pt-8 pb-6 md:pt-12 md:pb-8">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">
            THE COLLECTION
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-tight text-foreground md:text-5xl">
            From the Valleys
          </h1>
          <p className="mt-3 max-w-md font-body text-sm text-muted md:text-base">
            Each product is a preservation of place, practice and time.
          </p>
        </header>

        <ProductsGrid
          products={products.map((product) => ({
            ...product,
            variants: product.variants.map((variant) => ({
              sellingPrice: Number(variant.sellingPrice),
            })),
          }))}
        />
      </Container>
    </section>
  );
}
