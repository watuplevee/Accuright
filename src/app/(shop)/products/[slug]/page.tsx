import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductImages } from '@/components/product/ProductImages';
import { ProductInfo } from '@/components/product/ProductInfo';
import { SizeSelector } from '@/components/product/SizeSelector';
import { ColorSelector } from '@/components/product/ColorSelector';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { ShareBar } from '@/components/product/ShareBar';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { ProductStory } from '@/components/product/ProductStory';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: {
      OR: [{ isFeatured: true }, { isLimited: true }, { isNew: true }],
    },
    select: { slug: true },
    take: 50,
  });

  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const title = product.metaTitle ?? `${product.name} — ${product.brand}`;
  const description =
    product.metaDesc ??
    `Shop the ${product.name} by ${product.brand}. $${product.price.toFixed(2)} — ${product.description.slice(0, 120)}`;
  const image = product.images[0] ?? '/og-default.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: product.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      variants: { orderBy: [{ colorName: 'asc' }, { size: 'asc' }] },
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    include: { variants: true },
    take: 4,
    orderBy: { isFeatured: 'desc' },
  });

  // Derive unique colors and sizes from variants
  const colors = Array.from(
    new Map(
      product.variants.map((v) => [
        v.colorHex,
        { name: v.colorName, hex: v.colorHex },
      ])
    ).values()
  );

  const sizes = Array.from(
    new Set(product.variants.map((v) => v.size))
  ).sort((a, b) => parseFloat(a) - parseFloat(b));

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-brand-muted">
          <a href="/" className="hover:text-brand-white transition-colors">
            Home
          </a>
          <span>/</span>
          <a
            href="/products"
            className="hover:text-brand-white transition-colors"
          >
            Sneakers
          </a>
          <span>/</span>
          <a
            href={`/products?category=${product.category.slug}`}
            className="hover:text-brand-white transition-colors"
          >
            {product.category.name}
          </a>
          <span>/</span>
          <span className="text-brand-white truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Main product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24">
          {/* Left: Images */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductImages
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Right: Product details */}
          <div className="flex flex-col gap-6">
            <ProductInfo product={product} />

            <div className="h-px bg-white/10" />

            <ColorSelector colors={colors} />

            <SizeSelector sizes={sizes} variants={product.variants} />

            {/* Add to Cart */}
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0] ?? '',
              }}
              variants={product.variants}
              className="w-full h-14 text-lg font-bold uppercase tracking-widest bg-brand-accent hover:bg-orange-500 text-white rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-200"
            />

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { icon: '🛡️', label: 'Authenticity Guaranteed' },
                { icon: '📦', label: 'Free Shipping $150+' },
                { icon: '↩️', label: '30-Day Returns' },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 border border-white/10 text-center"
                >
                  <span className="text-xl">{icon}</span>
                  <span className="text-xs text-brand-muted leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-white/10" />

            <ShareBar
              url={`https://accuright.com/products/${product.slug}`}
              title={`${product.name} by ${product.brand}`}
            />
          </div>
        </div>

        {/* Product story */}
        {product.story && (
          <div className="mt-20">
            <ProductStory story={product.story} brand={product.brand} />
          </div>
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-display font-black uppercase tracking-tight text-brand-white mb-8">
              You Might Also Like
            </h2>
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
