import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { HotDropSection } from '@/components/home/HotDropSection';
import { InstagramFeed } from '@/components/social/InstagramFeed';
import { NewsletterForm } from '@/components/marketing/NewsletterForm';
import { SocialProofBar } from '@/components/home/SocialProofBar';
import type { Product } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Shop the most coveted sneakers of 2027. Exclusive drops, limited editions, and the culture that defines a generation.',
};

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products?isFeatured=true`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <HeroSection />
      <SocialProofBar />
      <FeaturedProducts products={featuredProducts} />
      <HotDropSection />
      <InstagramFeed />
      <NewsletterForm />
    </>
  );
}
