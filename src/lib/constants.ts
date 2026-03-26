// ============================================================
// ACCURIGHT — Site Constants & Configuration
// ============================================================

// ============================================================
// SITE CONFIG
// ============================================================

export const SITE_CONFIG = {
  name: "Accuright",
  tagline: "Step Into Tomorrow.",
  description:
    "Premium sneakers for the culture. Exclusive drops, limited editions, and iconic styles — curated for those who move first.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://accuright.com",
  ogImage: "/og-image.jpg",
  twitterHandle: "@Accuright",
  email: {
    support: "support@accuright.com",
    orders: "orders@accuright.com",
    press: "press@accuright.com",
  },
  phone: "+1 (888) 227-2748",
  address: {
    line1: "1 Accuright Plaza",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    country: "US",
  },
} as const;

// ============================================================
// CAMPAIGN — #AccurightRise2027
// ============================================================

export const CAMPAIGN_CONFIG = {
  hashtag: "#AccurightRise2027",
  name: "Rise 2027",
  description:
    "The movement starts now. Share your fit, tag us, and become part of the Accuright story.",
  launchDate: new Date("2027-01-15T00:00:00Z"),
  endDate: new Date("2027-12-31T23:59:59Z"),
  goalUnits: 27000,
  prizeDescription:
    "The top 10 community posts win an exclusive Accuright Rise 2027 collector's box.",
} as const;

// ============================================================
// SOCIAL HANDLES
// ============================================================

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/accuright",
  twitter: "https://twitter.com/accuright",
  tiktok: "https://tiktok.com/@accuright",
  youtube: "https://youtube.com/@accuright",
  linkedin: "https://linkedin.com/company/accuright",
  facebook: "https://facebook.com/accuright",
} as const;

// ============================================================
// NAVIGATION
// ============================================================

export const NAV_LINKS = [
  { label: "New Drops", href: "/products?sort=newest" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Kids", href: "/kids" },
  { label: "Brands", href: "/brands" },
  { label: "Sale", href: "/sale" },
  { label: "Rise 2027", href: "/rise-2027", highlight: true },
] as const;

// ============================================================
// PRODUCT CATEGORIES
// ============================================================

export const PRODUCT_CATEGORIES = [
  { name: "Running", slug: "running" },
  { name: "Basketball", slug: "basketball" },
  { name: "Lifestyle", slug: "lifestyle" },
  { name: "Skate", slug: "skate" },
  { name: "Training", slug: "training" },
  { name: "Outdoor", slug: "outdoor" },
  { name: "Collaborations", slug: "collaborations" },
] as const;

// ============================================================
// FEATURED BRANDS
// ============================================================

export const FEATURED_BRANDS = [
  "Nike",
  "Adidas",
  "New Balance",
  "Jordan",
  "Asics",
  "Puma",
  "Reebok",
  "Vans",
  "Converse",
  "Saucony",
  "On Running",
  "Hoka",
] as const;

// ============================================================
// SHIPPING OPTIONS
// ============================================================

export const SHIPPING_OPTIONS = [
  {
    id: "standard",
    label: "Standard Shipping",
    description: "5–7 business days",
    price: 8.99,
    freeThreshold: 100,
  },
  {
    id: "express",
    label: "Express Shipping",
    description: "2–3 business days",
    price: 18.99,
    freeThreshold: null,
  },
  {
    id: "overnight",
    label: "Overnight Shipping",
    description: "Next business day by 12:00 PM",
    price: 34.99,
    freeThreshold: null,
  },
] as const;

export const FREE_SHIPPING_THRESHOLD = 100;

// ============================================================
// TAX
// ============================================================

export const TAX_RATE = 0.0875; // 8.75% — update per jurisdiction as needed

// ============================================================
// PAGINATION
// ============================================================

export const PAGINATION = {
  defaultPageSize: 24,
  pageSizeOptions: [12, 24, 48, 96],
} as const;

// ============================================================
// SIZE CHARTS
// ============================================================

export const US_MEN_SIZES = [
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
  "13",
  "14",
] as const;

export const US_WOMEN_SIZES = [
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
] as const;

export const US_KIDS_SIZES = [
  "1Y",
  "1.5Y",
  "2Y",
  "2.5Y",
  "3Y",
  "3.5Y",
  "4Y",
  "4.5Y",
  "5Y",
  "5.5Y",
  "6Y",
  "6.5Y",
  "7Y",
] as const;

export const EU_SIZES: Record<string, string> = {
  "6": "38.5",
  "6.5": "39",
  "7": "40",
  "7.5": "40.5",
  "8": "41",
  "8.5": "42",
  "9": "42.5",
  "9.5": "43",
  "10": "44",
  "10.5": "44.5",
  "11": "45",
  "11.5": "45.5",
  "12": "46",
  "13": "47.5",
  "14": "48.5",
};

export const UK_SIZES: Record<string, string> = {
  "6": "5.5",
  "6.5": "6",
  "7": "6.5",
  "7.5": "7",
  "8": "7.5",
  "8.5": "8",
  "9": "8.5",
  "9.5": "9",
  "10": "9.5",
  "10.5": "10",
  "11": "10.5",
  "11.5": "11",
  "12": "11.5",
  "13": "12.5",
  "14": "13.5",
};

// Width options
export const WIDTH_OPTIONS = [
  { value: "N", label: "Narrow (N)" },
  { value: "M", label: "Medium (M)" },
  { value: "W", label: "Wide (W)" },
  { value: "XW", label: "Extra Wide (XW)" },
] as const;

// ============================================================
// SORT OPTIONS
// ============================================================

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "name-desc", label: "Name: Z–A" },
  { value: "featured", label: "Featured" },
] as const;

// ============================================================
// ORDER STATUSES (display labels + colors)
// ============================================================

export const ORDER_STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    description: "Awaiting payment confirmation",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  PAYMENT_FAILED: {
    label: "Payment Failed",
    description: "Payment could not be processed",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  CONFIRMED: {
    label: "Confirmed",
    description: "Order confirmed and being prepared",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  PROCESSING: {
    label: "Processing",
    description: "Your order is being packed",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  SHIPPED: {
    label: "Shipped",
    description: "On its way to you",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  DELIVERED: {
    label: "Delivered",
    description: "Successfully delivered",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  REFUNDED: {
    label: "Refunded",
    description: "Refund has been issued",
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
  CANCELLED: {
    label: "Cancelled",
    description: "Order has been cancelled",
    color: "text-red-400",
    bgColor: "bg-red-400/10",
  },
} as const;

// ============================================================
// RETURN POLICY
// ============================================================

export const RETURN_POLICY = {
  windowDays: 30,
  conditions: [
    "Unworn and in original condition",
    "Original packaging intact",
    "Tags still attached",
  ],
  excludedItems: [
    "Customized / personalized products",
    "Final sale items",
    "Worn items",
  ],
} as const;

// ============================================================
// NEWSLETTER
// ============================================================

export const NEWSLETTER_CONFIG = {
  welcomeDiscountPercent: 10,
  welcomeSubject: "Welcome to Accuright — Your 10% Off Is Inside",
} as const;

// ============================================================
// CHAT (Ace AI)
// ============================================================

export const CHAT_CONFIG = {
  assistantName: "Ace",
  welcomeMessage:
    "Hey! I'm Ace, your Accuright style guide. Ask me anything — fit advice, size help, drop info, or styling tips.",
  maxMessages: 50,
  maxInputLength: 1000,
} as const;
