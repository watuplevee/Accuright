export interface BulkPrice {
  minQty: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  subcategory: string;
  material: string;
  finish: string;
  grade: string;
  threadSize: string;
  length: string;
  diameter: string;
  headType: string;
  driveType: string;
  price: number;
  bulkPricing: BulkPrice[];
  inStock: boolean;
  stockQty: number;
  images: string[];
  specs: Record<string, string>;
  certifications: string[];
  weight: number;
  unitOfMeasure: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export enum ShippingCarrier {
  UPS = "UPS",
  FEDEX = "FEDEX",
  DHL = "DHL",
}

export interface ShippingOption {
  carrier: ShippingCarrier;
  service: string;
  estimatedDays: number;
  price: number;
  tracking: string;
}

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingOption: ShippingOption;
  trackingNumber: string;
  createdAt: string;
  estimatedDelivery: string;
}

export type InvoiceStatus = "paid" | "pending" | "overdue";

export interface Invoice {
  id: string;
  orderId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  dueDate: string;
  issuedDate: string;
  paidDate: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  accountType: "standard" | "fulltime";
}

export interface RFQItem {
  description: string;
  qty: number;
  specs: string;
}

export interface RFQRequest {
  id: string;
  items: RFQItem[];
  status: string;
  createdAt: string;
  response: string | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
