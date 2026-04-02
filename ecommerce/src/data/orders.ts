import { Order } from "@/types";

export const sampleOrders: Order[] = [
  {
    id: "ORD-2026-001",
    items: [
      {
        product: {
          id: "p1", name: "Hex Head Cap Screw", sku: "HCS-38-16-2", description: "", category: "Bolts", subcategory: "Hex", material: "Grade 8 Steel", finish: "Zinc Plated", grade: "Grade 8", threadSize: "3/8-16", length: '2"', diameter: '3/8"', headType: "Hex", driveType: "Hex", price: 0.42, bulkPricing: [], inStock: true, stockQty: 50000, images: [], specs: {}, certifications: [], weight: 0.05, unitOfMeasure: "each"
        },
        quantity: 5000,
      },
      {
        product: {
          id: "p2", name: "Flat Washer", sku: "FW-38-SS", description: "", category: "Washers", subcategory: "Flat", material: "Stainless Steel 304", finish: "Plain", grade: "N/A", threadSize: "3/8", length: "N/A", diameter: '3/8"', headType: "N/A", driveType: "N/A", price: 0.08, bulkPricing: [], inStock: true, stockQty: 100000, images: [], specs: {}, certifications: [], weight: 0.01, unitOfMeasure: "each"
        },
        quantity: 5000,
      },
    ],
    subtotal: 2500.0,
    shipping: 85.0,
    tax: 206.8,
    total: 2791.8,
    status: "delivered",
    shippingOption: { carrier: "UPS" as any, service: "Ground", estimatedDays: 5, price: 85.0, tracking: "1Z999AA10123456784" },
    trackingNumber: "1Z999AA10123456784",
    createdAt: "2026-01-15T10:30:00Z",
    estimatedDelivery: "2026-01-20T00:00:00Z",
  },
  {
    id: "ORD-2026-002",
    items: [
      {
        product: {
          id: "p3", name: "Socket Head Cap Screw", sku: "SHCS-14-20-1", description: "", category: "Bolts", subcategory: "Socket", material: "Alloy Steel", finish: "Black Oxide", grade: "Grade 12.9", threadSize: "1/4-20", length: '1"', diameter: '1/4"', headType: "Socket", driveType: "Hex Socket", price: 0.35, bulkPricing: [], inStock: true, stockQty: 75000, images: [], specs: {}, certifications: [], weight: 0.02, unitOfMeasure: "each"
        },
        quantity: 10000,
      },
    ],
    subtotal: 3500.0,
    shipping: 120.0,
    tax: 290.4,
    total: 3910.4,
    status: "shipped",
    shippingOption: { carrier: "FEDEX" as any, service: "Express", estimatedDays: 3, price: 120.0, tracking: "794644790132" },
    trackingNumber: "794644790132",
    createdAt: "2026-02-20T14:15:00Z",
    estimatedDelivery: "2026-02-23T00:00:00Z",
  },
  {
    id: "ORD-2026-003",
    items: [
      {
        product: {
          id: "p4", name: "Hex Nut", sku: "HN-12-13-GR5", description: "", category: "Nuts", subcategory: "Hex", material: "Grade 5 Steel", finish: "Zinc Plated", grade: "Grade 5", threadSize: "1/2-13", length: "N/A", diameter: '1/2"', headType: "N/A", driveType: "N/A", price: 0.18, bulkPricing: [], inStock: true, stockQty: 200000, images: [], specs: {}, certifications: [], weight: 0.03, unitOfMeasure: "each"
        },
        quantity: 20000,
      },
      {
        product: {
          id: "p5", name: "Lock Washer", sku: "LW-12-SS", description: "", category: "Washers", subcategory: "Lock", material: "Stainless Steel 316", finish: "Plain", grade: "N/A", threadSize: "1/2", length: "N/A", diameter: '1/2"', headType: "N/A", driveType: "N/A", price: 0.12, bulkPricing: [], inStock: true, stockQty: 150000, images: [], specs: {}, certifications: [], weight: 0.02, unitOfMeasure: "each"
        },
        quantity: 20000,
      },
    ],
    subtotal: 6000.0,
    shipping: 210.0,
    tax: 497.64,
    total: 6707.64,
    status: "processing",
    shippingOption: { carrier: "UPS" as any, service: "Freight", estimatedDays: 7, price: 210.0, tracking: "" },
    trackingNumber: "",
    createdAt: "2026-03-10T09:00:00Z",
    estimatedDelivery: "2026-03-17T00:00:00Z",
  },
  {
    id: "ORD-2026-004",
    items: [
      {
        product: {
          id: "p6", name: "Carriage Bolt", sku: "CB-516-18-3", description: "", category: "Bolts", subcategory: "Carriage", material: "Grade 5 Steel", finish: "Hot Dip Galvanized", grade: "Grade 5", threadSize: "5/16-18", length: '3"', diameter: '5/16"', headType: "Round", driveType: "Square Neck", price: 0.55, bulkPricing: [], inStock: true, stockQty: 30000, images: [], specs: {}, certifications: [], weight: 0.06, unitOfMeasure: "each"
        },
        quantity: 8000,
      },
    ],
    subtotal: 4400.0,
    shipping: 150.0,
    tax: 365.2,
    total: 4915.2,
    status: "delivered",
    shippingOption: { carrier: "FEDEX" as any, service: "Ground", estimatedDays: 5, price: 150.0, tracking: "794644790245" },
    trackingNumber: "794644790245",
    createdAt: "2026-01-28T11:45:00Z",
    estimatedDelivery: "2026-02-02T00:00:00Z",
  },
  {
    id: "ORD-2026-005",
    items: [
      {
        product: {
          id: "p7", name: "Self-Tapping Screw", sku: "STS-10-1", description: "", category: "Screws", subcategory: "Self-Tapping", material: "Hardened Steel", finish: "Zinc Plated", grade: "N/A", threadSize: "#10", length: '1"', diameter: '#10', headType: "Pan", driveType: "Phillips", price: 0.15, bulkPricing: [], inStock: true, stockQty: 500000, images: [], specs: {}, certifications: [], weight: 0.008, unitOfMeasure: "each"
        },
        quantity: 25000,
      },
    ],
    subtotal: 3750.0,
    shipping: 95.0,
    tax: 309.76,
    total: 4154.76,
    status: "delivered",
    shippingOption: { carrier: "UPS" as any, service: "Ground", estimatedDays: 5, price: 95.0, tracking: "1Z999AA10123456800" },
    trackingNumber: "1Z999AA10123456800",
    createdAt: "2026-02-05T08:20:00Z",
    estimatedDelivery: "2026-02-10T00:00:00Z",
  },
  {
    id: "ORD-2026-006",
    items: [
      {
        product: {
          id: "p8", name: "Threaded Rod", sku: "TR-38-16-36", description: "", category: "Rods", subcategory: "Threaded", material: "Low Carbon Steel", finish: "Zinc Plated", grade: "Grade 2", threadSize: "3/8-16", length: '36"', diameter: '3/8"', headType: "N/A", driveType: "N/A", price: 4.25, bulkPricing: [], inStock: true, stockQty: 5000, images: [], specs: {}, certifications: [], weight: 0.8, unitOfMeasure: "each"
        },
        quantity: 500,
      },
    ],
    subtotal: 2125.0,
    shipping: 175.0,
    tax: 184.4,
    total: 2484.4,
    status: "shipped",
    shippingOption: { carrier: "DHL" as any, service: "Express", estimatedDays: 2, price: 175.0, tracking: "1234567890" },
    trackingNumber: "1234567890",
    createdAt: "2026-03-18T16:00:00Z",
    estimatedDelivery: "2026-03-20T00:00:00Z",
  },
  {
    id: "ORD-2026-007",
    items: [
      {
        product: {
          id: "p9", name: "Wing Nut", sku: "WN-14-20-SS", description: "", category: "Nuts", subcategory: "Wing", material: "Stainless Steel 304", finish: "Plain", grade: "N/A", threadSize: "1/4-20", length: "N/A", diameter: '1/4"', headType: "Wing", driveType: "Hand", price: 0.22, bulkPricing: [], inStock: true, stockQty: 80000, images: [], specs: {}, certifications: [], weight: 0.01, unitOfMeasure: "each"
        },
        quantity: 15000,
      },
    ],
    subtotal: 3300.0,
    shipping: 88.0,
    tax: 271.1,
    total: 3659.1,
    status: "cancelled",
    shippingOption: { carrier: "UPS" as any, service: "Ground", estimatedDays: 5, price: 88.0, tracking: "" },
    trackingNumber: "",
    createdAt: "2026-03-01T13:30:00Z",
    estimatedDelivery: "2026-03-06T00:00:00Z",
  },
  {
    id: "ORD-2025-048",
    items: [
      {
        product: {
          id: "p10", name: "Anchor Bolt", sku: "AB-58-11-8", description: "", category: "Bolts", subcategory: "Anchor", material: "Grade 5 Steel", finish: "Hot Dip Galvanized", grade: "Grade 5", threadSize: "5/8-11", length: '8"', diameter: '5/8"', headType: "L-Bolt", driveType: "N/A", price: 3.80, bulkPricing: [], inStock: true, stockQty: 10000, images: [], specs: {}, certifications: [], weight: 0.45, unitOfMeasure: "each"
        },
        quantity: 2000,
      },
    ],
    subtotal: 7600.0,
    shipping: 320.0,
    tax: 635.76,
    total: 8555.76,
    status: "delivered",
    shippingOption: { carrier: "FEDEX" as any, service: "Freight", estimatedDays: 7, price: 320.0, tracking: "794644790500" },
    trackingNumber: "794644790500",
    createdAt: "2025-11-12T10:00:00Z",
    estimatedDelivery: "2025-11-19T00:00:00Z",
  },
];
