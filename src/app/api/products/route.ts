import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const q = searchParams.get('q') ?? undefined;
    const brand = searchParams.get('brand') ?? undefined;
    const size = searchParams.get('size') ?? undefined;
    const color = searchParams.get('color') ?? undefined;
    const gender = searchParams.get('gender') ?? undefined;
    const category = searchParams.get('category') ?? undefined;
    const priceMin = searchParams.get('priceMin')
      ? Number(searchParams.get('priceMin'))
      : undefined;
    const priceMax = searchParams.get('priceMax')
      ? Number(searchParams.get('priceMax'))
      : undefined;
    const isNew = searchParams.get('isNew') === 'true' ? true : undefined;
    const isLimited = searchParams.get('isLimited') === 'true' ? true : undefined;
    const sort = searchParams.get('sort') ?? 'createdAt_desc';
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const rawLimit = parseInt(searchParams.get('limit') ?? String(DEFAULT_PAGE_SIZE), 10);
    const limit = Math.min(Math.max(1, rawLimit), MAX_PAGE_SIZE);
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (brand) {
      where.brand = { equals: brand, mode: 'insensitive' };
    }

    if (gender) {
      where.gender = { equals: gender, mode: 'insensitive' };
    }

    if (category) {
      where.category = {
        OR: [
          { name: { equals: category, mode: 'insensitive' } },
          { slug: { equals: category, mode: 'insensitive' } },
        ],
      };
    }

    if (isNew !== undefined) {
      where.isNew = isNew;
    }

    if (isLimited !== undefined) {
      where.isLimited = isLimited;
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price.gte = priceMin;
      if (priceMax !== undefined) where.price.lte = priceMax;
    }

    // Filter by size or color through variants
    if (size || color) {
      const variantWhere: Prisma.ProductVariantWhereInput = {};
      if (size) variantWhere.size = { equals: size, mode: 'insensitive' };
      if (color) variantWhere.color = { equals: color, mode: 'insensitive' };
      where.variants = { some: variantWhere };
    }

    // Build orderBy
    const orderByMap: Record<string, Prisma.ProductOrderByWithRelationInput> = {
      price_asc: { price: 'asc' },
      price_desc: { price: 'desc' },
      name_asc: { name: 'asc' },
      name_desc: { name: 'desc' },
      createdAt_asc: { createdAt: 'asc' },
      createdAt_desc: { createdAt: 'desc' },
    };
    const orderBy: Prisma.ProductOrderByWithRelationInput =
      orderByMap[sort] ?? { createdAt: 'desc' };

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          variants: {
            select: {
              id: true,
              size: true,
              color: true,
              stock: true,
              price: true,
              sku: true,
            },
          },
          images: { select: { url: true, alt: true }, orderBy: { position: 'asc' }, take: 1 },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('[GET /api/products]', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
