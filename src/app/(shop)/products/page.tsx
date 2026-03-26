import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ProductFilters } from '@/components/product/ProductFilters';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SortDropdown } from '@/components/product/SortDropdown';
import type { Prisma } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Shop All Sneakers',
  description:
    'Browse our full catalog of premium sneakers — from iconic classics to the most hyped 2027 releases.',
};

const PRODUCTS_PER_PAGE = 12;

interface ProductsPageProps {
  searchParams: {
    page?: string;
    sort?: string;
    category?: string;
    brand?: string;
    gender?: string;
    minPrice?: string;
    maxPrice?: string;
    isNew?: string;
    isLimited?: string;
    q?: string;
  };
}

type ProductOrderByField = 'createdAt' | 'price' | 'name';

function buildOrderBy(
  sort: string | undefined
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case 'price-asc':
      return { price: 'asc' };
    case 'price-desc':
      return { price: 'desc' };
    case 'name-asc':
      return { name: 'asc' };
    case 'newest':
    default:
      return { createdAt: 'desc' };
  }
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const skip = (page - 1) * PRODUCTS_PER_PAGE;

  const where: Prisma.ProductWhereInput = {
    ...(searchParams.category && {
      category: { slug: searchParams.category },
    }),
    ...(searchParams.brand && { brand: searchParams.brand }),
    ...(searchParams.gender && {
      gender: searchParams.gender as 'MEN' | 'WOMEN' | 'UNISEX' | 'KIDS',
    }),
    ...(searchParams.minPrice || searchParams.maxPrice
      ? {
          price: {
            ...(searchParams.minPrice
              ? { gte: parseFloat(searchParams.minPrice) }
              : {}),
            ...(searchParams.maxPrice
              ? { lte: parseFloat(searchParams.maxPrice) }
              : {}),
          },
        }
      : {}),
    ...(searchParams.isNew === 'true' && { isNew: true }),
    ...(searchParams.isLimited === 'true' && { isLimited: true }),
    ...(searchParams.q && {
      OR: [
        { name: { contains: searchParams.q, mode: 'insensitive' } },
        { brand: { contains: searchParams.q, mode: 'insensitive' } },
        { tags: { has: searchParams.q } },
      ],
    }),
  };

  const [products, totalCount, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { variants: true, category: true },
      orderBy: buildOrderBy(searchParams.sort),
      skip,
      take: PRODUCTS_PER_PAGE,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.findMany({
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);
  const uniqueBrands = brands.map((b) => b.brand);

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Page header */}
      <div className="border-b border-white/10 bg-brand-slate/20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-display font-black text-brand-white uppercase tracking-tight">
            All Sneakers
          </h1>
          <p className="mt-1 text-brand-muted text-sm">
            Showing{' '}
            <span className="text-brand-white font-semibold">{totalCount}</span>{' '}
            {totalCount === 1 ? 'result' : 'results'}
            {searchParams.q && (
              <>
                {' '}
                for{' '}
                <span className="text-brand-accent font-semibold">
                  &ldquo;{searchParams.q}&rdquo;
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <ProductFilters
              categories={categories}
              brands={uniqueBrands}
              currentFilters={{
                category: searchParams.category,
                brand: searchParams.brand,
                gender: searchParams.gender,
                minPrice: searchParams.minPrice,
                maxPrice: searchParams.maxPrice,
                isNew: searchParams.isNew,
                isLimited: searchParams.isLimited,
              }}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort & controls bar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <p className="text-sm text-brand-muted lg:hidden">
                <span className="text-brand-white font-semibold">
                  {totalCount}
                </span>{' '}
                products
              </p>
              <div className="ml-auto">
                <SortDropdown currentSort={searchParams.sort} />
              </div>
            </div>

            {/* Product grid */}
            <ProductGrid products={products} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {page > 1 && (
                  <a
                    href={`?page=${page - 1}${searchParams.sort ? `&sort=${searchParams.sort}` : ''}`}
                    className="px-4 py-2 rounded-lg border border-white/20 text-sm text-brand-white hover:border-brand-accent hover:text-brand-accent transition-colors"
                  >
                    Previous
                  </a>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2
                  )
                  .map((p, idx, arr) => (
                    <span key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="px-2 text-brand-muted">…</span>
                      )}
                      <a
                        href={`?page=${p}${searchParams.sort ? `&sort=${searchParams.sort}` : ''}`}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          p === page
                            ? 'bg-brand-accent text-white'
                            : 'border border-white/20 text-brand-white hover:border-brand-accent hover:text-brand-accent'
                        }`}
                      >
                        {p}
                      </a>
                    </span>
                  ))}

                {page < totalPages && (
                  <a
                    href={`?page=${page + 1}${searchParams.sort ? `&sort=${searchParams.sort}` : ''}`}
                    className="px-4 py-2 rounded-lg border border-white/20 text-sm text-brand-white hover:border-brand-accent hover:text-brand-accent transition-colors"
                  >
                    Next
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
