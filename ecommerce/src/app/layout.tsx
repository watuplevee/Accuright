import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export const metadata: Metadata = {
  title: "Accutite | Precision Fasteners & Industrial Hardware",
  description:
    "Accutite is your trusted source for precision fasteners, bolts, nuts, screws, and industrial hardware. ISO 9001 certified with volume pricing and fast shipping.",
  keywords: [
    "fasteners",
    "bolts",
    "nuts",
    "screws",
    "industrial hardware",
    "precision fasteners",
    "bulk fasteners",
    "aerospace fasteners",
    "automotive fasteners",
  ],
  openGraph: {
    title: "Accutite | Precision Fasteners & Industrial Hardware",
    description:
      "Your trusted source for precision fasteners and industrial hardware. ISO 9001, AS9100, and IATF 16949 certified.",
    type: "website",
    siteName: "Accutite",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
