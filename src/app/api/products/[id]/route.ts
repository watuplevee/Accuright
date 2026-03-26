import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Product id or slug is required' }, { status: 400 });
    }

    // Support lookup by numeric id or slug string
    const isNumericId = /^\d+$/.test(id);

    const product = await prisma.product.findFirst({
      where: isNumericId
        ? { id }
        : {
            OR: [{ id }, { slug: id }],
          },
      include: {
        category: true,
        variants: {
          orderBy: [{ size: 'asc' }, { color: 'asc' }],
        },
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('[GET /api/products/[id]]', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
