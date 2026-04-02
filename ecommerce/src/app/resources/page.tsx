"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Wrench,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Layers,
  Shield,
  Gauge,
  FlaskConical,
  Scale,
} from "lucide-react";

/* ---------- Technical Resources ---------- */
const TECHNICAL_RESOURCES = [
  {
    title: "Specification Sheets",
    description:
      "Detailed specifications for all fastener types including dimensions, materials, and tolerances.",
    icon: FileText,
    action: "Browse Specs",
  },
  {
    title: "Fastener Identification Guide",
    description:
      "Visual guide to help identify bolt heads, drive types, thread patterns, and specialty fasteners.",
    icon: Search,
    action: "View Guide",
  },
  {
    title: "Torque Charts",
    description:
      "Recommended torque values organized by fastener size, grade, and material. Dry and lubricated values.",
    icon: Wrench,
    action: "View Charts",
  },
];

/* ---------- Material Comparison ---------- */
const MATERIALS = [
  {
    name: "Steel (Grade 5)",
    tensile: "120,000 psi",
    corrosion: "Low",
    tempRange: "-50F to 500F",
    cost: "$",
  },
  {
    name: "Stainless 304",
    tensile: "75,000 psi",
    corrosion: "High",
    tempRange: "-320F to 1500F",
    cost: "$$",
  },
  {
    name: "Stainless 316",
    tensile: "80,000 psi",
    corrosion: "Very High",
    tempRange: "-320F to 1500F",
    cost: "$$$",
  },
  {
    name: "Brass",
    tensile: "50,000 psi",
    corrosion: "High",
    tempRange: "-325F to 400F",
    cost: "$$",
  },
  {
    name: "Aluminum",
    tensile: "45,000 psi",
    corrosion: "Moderate",
    tempRange: "-320F to 400F",
    cost: "$$",
  },
];

/* ---------- Grade Reference ---------- */
const GRADES = [
  {
    grade: "Grade 2",
    proofLoad: "55,000 psi",
    tensile: "74,000 psi",
    description: "Low to medium carbon steel. General purpose, non-critical applications.",
    markings: "No markings",
  },
  {
    grade: "Grade 5",
    proofLoad: "85,000 psi",
    tensile: "120,000 psi",
    description:
      "Medium carbon steel, quenched and tempered. Automotive and structural applications.",
    markings: "3 radial lines",
  },
  {
    grade: "Grade 8",
    proofLoad: "120,000 psi",
    tensile: "150,000 psi",
    description:
      "Medium carbon alloy steel, quenched and tempered. High-strength critical applications.",
    markings: "6 radial lines",
  },
];

/* ---------- Industry Standards ---------- */
const STANDARDS = [
  {
    code: "ASTM",
    name: "American Society for Testing and Materials",
    description: "Material specifications and testing standards (A307, A325, A490, F593, F594).",
  },
  {
    code: "SAE",
    name: "Society of Automotive Engineers",
    description: "Grade classifications for bolts and screws used in automotive and industrial applications.",
  },
  {
    code: "ISO",
    name: "International Organization for Standardization",
    description: "Metric fastener property classes and dimensional standards (ISO 898, ISO 3506).",
  },
  {
    code: "ANSI",
    name: "American National Standards Institute",
    description: "Dimensional standards for bolts, nuts, screws and washers (ANSI B18 series).",
  },
  {
    code: "DIN",
    name: "Deutsches Institut fur Normung",
    description: "German industrial standards widely used for metric fasteners (DIN 931, DIN 933, DIN 934).",
  },
  {
    code: "ASME",
    name: "American Society of Mechanical Engineers",
    description: "Pressure vessel and structural fastener specifications (ASME B1.1, B18.2).",
  },
];

/* ---------- FAQ ---------- */
const FAQS = [
  {
    question: "What is your minimum order quantity?",
    answer:
      "There is no minimum order quantity for standard catalog items. However, bulk pricing discounts begin at 25 units, with additional tiers at 100, 500, 1,000, 5,000, and 10,000+ units. Custom and made-to-order fasteners may require minimum quantities.",
  },
  {
    question: "How does bulk pricing work?",
    answer:
      "Our bulk pricing is automatically applied at checkout based on quantity. 25+ units receive 5% off, 100+ units receive 10% off, 500+ units receive 15% off, 1,000+ units receive 20% off, 5,000+ units receive 25% off, and 10,000+ units receive 30% off the base price.",
  },
  {
    question: "What are your shipping options?",
    answer:
      "We ship via UPS, FedEx, and DHL with ground, express, and overnight options. Orders over $1,000 qualify for free ground shipping. Orders over $500 receive 10% off shipping costs. Most in-stock orders ship within 24 hours from our Los Angeles, Dallas, or Chicago warehouses.",
  },
  {
    question: "Can I return or exchange products?",
    answer:
      "Yes, we accept returns within 30 days of delivery for standard catalog items in original packaging. Custom and special-order items are non-returnable. Contact our support team to initiate a return and receive an RMA number. Restocking fees may apply for large quantity returns.",
  },
  {
    question: "Do you offer technical support for fastener selection?",
    answer:
      "Absolutely. Our engineering team can help you select the right fastener for your application. We provide guidance on material selection, grade requirements, corrosion resistance, torque specifications, and compliance with industry standards. Contact us or use our online resources.",
  },
  {
    question: "What certifications do your products carry?",
    answer:
      "Our quality management system is certified to ISO 9001:2015, AS9100D (aerospace), and IATF 16949 (automotive). Products are manufactured and tested to ASTM, SAE, ISO, and ANSI standards. Certificates of compliance and material test reports are available upon request.",
  },
  {
    question: "Do you offer Net 30 or purchase order terms?",
    answer:
      "Yes, we offer Net 30 payment terms for approved business accounts. You can select the Purchase Order option at checkout. New accounts are subject to a credit review. Contact our sales team to set up a wholesale account with PO terms.",
  },
  {
    question: "Can you supply custom or non-standard fasteners?",
    answer:
      "Yes, we manufacture custom fasteners to your specifications. We can produce non-standard sizes, materials, coatings, and head/drive configurations. Lead times for custom orders are typically 2-6 weeks depending on complexity. Request a quote through our contact page.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order ships, you will receive a confirmation email with a tracking number. You can also view order status and tracking information in your account dashboard under Order History. All shipments include tracking by default.",
  },
];

export default function ResourcesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Technical Resources</h1>
          <p className="text-blue-200 text-lg">
            Specifications, guides, and reference materials for fastener
            professionals
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Technical Resources Cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Technical Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TECHNICAL_RESOURCES.map((res) => {
              const Icon = res.icon;
              return (
                <div
                  key={res.title}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {res.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {res.description}
                  </p>
                  <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                    {res.action}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Material Comparison Table */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-blue-600" />
            Material Comparison
          </h2>
          <p className="text-gray-500 mb-6">
            Compare properties across common fastener materials
          </p>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Material
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Tensile Strength
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Corrosion Resistance
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Temp Range
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Relative Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MATERIALS.map((mat, idx) => (
                    <tr
                      key={mat.name}
                      className={`border-b border-gray-100 ${idx % 2 === 0 ? "" : "bg-gray-50"}`}
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {mat.name}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {mat.tensile}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                            mat.corrosion === "Very High"
                              ? "bg-green-100 text-green-700"
                              : mat.corrosion === "High"
                                ? "bg-blue-100 text-blue-700"
                                : mat.corrosion === "Moderate"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                          }`}
                        >
                          {mat.corrosion}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {mat.tempRange}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-gray-600">
                        {mat.cost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Grade Reference */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Gauge className="w-6 h-6 text-blue-600" />
            Bolt Grade Reference
          </h2>
          <p className="text-gray-500 mb-6">
            SAE bolt grade specifications and identification
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GRADES.map((g) => (
              <div
                key={g.grade}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {g.grade}
                  </h3>
                  <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-1 rounded">
                    {g.markings}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{g.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Proof Load</span>
                    <span className="font-semibold text-gray-900">
                      {g.proofLoad}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tensile Strength</span>
                    <span className="font-semibold text-gray-900">
                      {g.tensile}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Industry Standards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Scale className="w-6 h-6 text-blue-600" />
            Industry Standards
          </h2>
          <p className="text-gray-500 mb-6">
            Common standards that govern fastener manufacturing and testing
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STANDARDS.map((std) => (
              <div
                key={std.code}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex gap-4"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-blue-700">
                    {std.code}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {std.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {std.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Accordion */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 mb-6">
            Common questions about ordering, shipping, and products
          </p>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition"
                  >
                    <span className="font-medium text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Downloads CTA */}
        <section className="bg-blue-50 rounded-2xl border border-blue-200 p-8 text-center">
          <Shield className="w-10 h-10 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Need Compliance Documents?
          </h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            We provide certificates of compliance, material test reports, and
            PPAP documentation. Contact us to request documents for any order.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition inline-flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Request Documents
            </a>
            <a
              href="/products"
              className="border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition inline-flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Browse Products
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
