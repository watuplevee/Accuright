import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: { slug: string };
}

export default async function OGImage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  const name = product?.name ?? 'Accuright';
  const brand = product?.brand ?? 'Accuright';
  const price = product?.price ? `$${product.price.toFixed(0)}` : '';
  const image = product?.images?.[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0A0A0A',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background accent gradient */}
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            right: '-200px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,60,0,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-150px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(0,255,133,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Left content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px',
            flex: 1,
            zIndex: 1,
          }}
        >
          {/* Brand logo area */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '40px',
                background: '#FF3C00',
                borderRadius: '4px',
              }}
            />
            <span
              style={{
                fontSize: '24px',
                fontWeight: 900,
                color: '#F5F5F0',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              ACCURIGHT
            </span>
          </div>

          {/* Product info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span
              style={{
                fontSize: '18px',
                color: '#FF3C00',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
              }}
            >
              {brand}
            </span>
            <span
              style={{
                fontSize: '56px',
                fontWeight: 900,
                color: '#F5F5F0',
                lineHeight: 1,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                maxWidth: '540px',
              }}
            >
              {name}
            </span>
            {price && (
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#00FF85',
                }}
              >
                {price}
              </span>
            )}
          </div>

          {/* Bottom tag */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              background: 'rgba(255,60,0,0.15)',
              border: '1px solid rgba(255,60,0,0.3)',
              borderRadius: '8px',
              width: 'fit-content',
            }}
          >
            <span style={{ fontSize: '14px', color: '#FF3C00', fontWeight: 600 }}>
              Shop Now at accuright.com
            </span>
          </div>
        </div>

        {/* Right: Product image */}
        {image && (
          <div
            style={{
              width: '480px',
              height: '630px',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
            {/* Gradient overlay for blend */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to right, #0A0A0A 0%, transparent 30%)',
              }}
            />
          </div>
        )}
      </div>
    ),
    {
      ...size,
    }
  );
}
