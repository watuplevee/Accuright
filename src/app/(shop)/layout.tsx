import { ShopNav } from '@/components/layout/ShopNav';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ShopNav />
      {children}
    </>
  );
}
