import { ShippingCarrier, ShippingOption } from "@/types";
import { CartItem } from "@/lib/cart-context";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function calculateBulkPrice(basePrice: number, quantity: number): number {
  if (quantity >= 10000) return basePrice * 0.70;
  if (quantity >= 5000) return basePrice * 0.75;
  if (quantity >= 1000) return basePrice * 0.80;
  if (quantity >= 500) return basePrice * 0.85;
  if (quantity >= 100) return basePrice * 0.90;
  if (quantity >= 25) return basePrice * 0.95;
  return basePrice;
}

export function getBulkTier(quantity: number): string {
  if (quantity >= 10000) return "30% off (10,000+)";
  if (quantity >= 5000) return "25% off (5,000+)";
  if (quantity >= 1000) return "20% off (1,000+)";
  if (quantity >= 500) return "15% off (500+)";
  if (quantity >= 100) return "10% off (100+)";
  if (quantity >= 25) return "5% off (25+)";
  return "";
}

const BASE_SHIPPING_OPTIONS: Omit<ShippingOption, "tracking">[] = [
  // UPS
  { carrier: ShippingCarrier.UPS, service: "Ground", estimatedDays: 6, price: 12.99 },
  { carrier: ShippingCarrier.UPS, service: "2nd Day Air", estimatedDays: 2, price: 24.99 },
  { carrier: ShippingCarrier.UPS, service: "Next Day Air", estimatedDays: 1, price: 49.99 },
  // FedEx
  { carrier: ShippingCarrier.FEDEX, service: "Ground", estimatedDays: 6, price: 11.99 },
  { carrier: ShippingCarrier.FEDEX, service: "Express", estimatedDays: 2, price: 27.99 },
  { carrier: ShippingCarrier.FEDEX, service: "Priority Overnight", estimatedDays: 1, price: 54.99 },
  // DHL
  { carrier: ShippingCarrier.DHL, service: "eCommerce", estimatedDays: 9, price: 8.99 },
  { carrier: ShippingCarrier.DHL, service: "Express", estimatedDays: 4, price: 22.99 },
  { carrier: ShippingCarrier.DHL, service: "Express Plus", estimatedDays: 1, price: 59.99 },
];

function isGroundService(service: string): boolean {
  return service === "Ground" || service === "eCommerce";
}

export function getShippingOptions(items: CartItem[]): ShippingOption[] {
  const totalWeight = items.reduce(
    (sum, item) => sum + (item.weight ?? 0.1) * item.quantity,
    0
  );
  const orderSubtotal = items.reduce(
    (sum, item) =>
      sum + calculateBulkPrice(item.price, item.quantity) * item.quantity,
    0
  );

  const weightMultiplier = Math.max(1, totalWeight / 10);

  return BASE_SHIPPING_OPTIONS.map((opt) => {
    let price = opt.price * weightMultiplier;

    // Price breaks
    if (orderSubtotal >= 1000 && isGroundService(opt.service)) {
      price = 0;
    } else if (orderSubtotal >= 500) {
      price = price * 0.9;
    }

    return {
      ...opt,
      price: Math.round(price * 100) / 100,
      tracking: "",
    };
  });
}

export function getShippingRates(
  zipCode: string,
  weightLbs: number
): ShippingOption[] {
  const weightMultiplier = Math.max(1, weightLbs / 10);

  return BASE_SHIPPING_OPTIONS.map((opt) => ({
    ...opt,
    price: Math.round(opt.price * weightMultiplier * 100) / 100,
    tracking: "",
  }));
}
