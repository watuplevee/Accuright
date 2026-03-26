import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import authOptions from '@/lib/auth';

export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'accuright_session_id';

function getSessionId(req: NextRequest): string | null {
  return req.cookies.get(SESSION_COOKIE)?.value ?? null;
}

async function findOrCreateCart(userId?: string, sessionId?: string) {
  if (!userId && !sessionId) return null;

  const where = userId ? { userId } : { sessionId };

  const existing = await prisma.cart.findFirst({
    where,
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: {
                    take: 1,
                    orderBy: { position: 'asc' },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (existing) return existing;

  return prisma.cart.create({
    data: userId ? { userId } : { sessionId: sessionId! },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: {
                    take: 1,
                    orderBy: { position: 'asc' },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

// GET /api/cart
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    const sessionId = getSessionId(req);

    if (!userId && !sessionId) {
      return NextResponse.json({ cart: null, items: [] });
    }

    const cart = await findOrCreateCart(userId, sessionId ?? undefined);

    if (!cart) {
      return NextResponse.json({ cart: null, items: [] });
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + (item.variant.price ?? item.variant.product.price) * item.quantity,
      0
    );

    return NextResponse.json({ cart: { ...cart, subtotal } });
  } catch (error) {
    console.error('[GET /api/cart]', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST /api/cart — add item
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    const sessionId = getSessionId(req);

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'No session or user found. Cannot add to cart.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { variantId, quantity } = body as { variantId: string; quantity: number };

    if (!variantId || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { error: 'variantId and a positive quantity are required' },
        { status: 400 }
      );
    }

    // Verify variant exists and has enough stock
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) {
      return NextResponse.json({ error: 'Product variant not found' }, { status: 404 });
    }
    if (variant.stock < quantity) {
      return NextResponse.json(
        { error: `Only ${variant.stock} unit(s) available` },
        { status: 409 }
      );
    }

    const cart = await findOrCreateCart(userId, sessionId ?? undefined);
    if (!cart) {
      return NextResponse.json({ error: 'Unable to retrieve cart' }, { status: 500 });
    }

    // If item already in cart, increment quantity
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, variantId },
    });

    let cartItem;
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > variant.stock) {
        return NextResponse.json(
          { error: `Cannot add ${quantity} more — only ${variant.stock - existingItem.quantity} unit(s) remaining` },
          { status: 409 }
        );
      }
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { variant: { include: { product: true } } },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { cartId: cart.id, variantId, quantity },
        include: { variant: { include: { product: true } } },
      });
    }

    const response = NextResponse.json({ cartItem }, { status: 201 });

    // Set session cookie if guest
    if (!userId && sessionId) {
      response.cookies.set(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return response;
  } catch (error) {
    console.error('[POST /api/cart]', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}

// PUT /api/cart — update quantity
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    const sessionId = getSessionId(req);

    const body = await req.json();
    const { cartItemId, quantity } = body as { cartItemId: string; quantity: number };

    if (!cartItemId || typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { error: 'cartItemId and a non-negative quantity are required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
        variant: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    const ownedByUser = userId && cartItem.cart.userId === userId;
    const ownedBySession = sessionId && cartItem.cart.sessionId === sessionId;

    if (!ownedByUser && !ownedBySession) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (quantity === 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
      return NextResponse.json({ deleted: true });
    }

    if (cartItem.variant.stock < quantity) {
      return NextResponse.json(
        { error: `Only ${cartItem.variant.stock} unit(s) available` },
        { status: 409 }
      );
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { variant: { include: { product: true } } },
    });

    return NextResponse.json({ cartItem: updated });
  } catch (error) {
    console.error('[PUT /api/cart]', error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

// DELETE /api/cart?itemId=
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    const sessionId = getSessionId(req);

    const { searchParams } = req.nextUrl;
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'itemId query param is required' }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    const ownedByUser = userId && cartItem.cart.userId === userId;
    const ownedBySession = sessionId && cartItem.cart.sessionId === sessionId;

    if (!ownedByUser && !ownedBySession) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('[DELETE /api/cart]', error);
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
  }
}
