import Link from "next/link";
import {
  Bolt,
  Hexagon,
  Disc,
  Anchor,
  CircleDot,
  PenTool,
  Layers,
  Wrench,
  ShieldCheck,
  Package,
  Truck,
  Headphones,
  Plane,
  Car,
  Building2,
  Cpu,
  Ship,
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  BarChart3,
  Clock,
} from "lucide-react";

const categories = [
  {
    name: "Bolts & Screws",
    href: "/products?category=bolts-screws",
    icon: Bolt,
    count: "2,400+",
    color: "bg-blue-100 text-[#1e40af]",
  },
  {
    name: "Nuts",
    href: "/products?category=nuts",
    icon: Hexagon,
    count: "1,800+",
    color: "bg-orange-100 text-orange-600",
  },
  {
    name: "Washers",
    href: "/products?category=washers",
    icon: Disc,
    count: "950+",
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Anchors",
    href: "/products?category=anchors",
    icon: Anchor,
    count: "600+",
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Rivets",
    href: "/products?category=rivets",
    icon: CircleDot,
    count: "750+",
    color: "bg-red-100 text-red-600",
  },
  {
    name: "Pins & Clips",
    href: "/products?category=pins-clips",
    icon: PenTool,
    count: "500+",
    color: "bg-teal-100 text-teal-600",
  },
  {
    name: "Threaded Rod",
    href: "/products?category=threaded-rod",
    icon: Layers,
    count: "300+",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    name: "Tools & Accessories",
    href: "/products?category=tools",
    icon: Wrench,
    count: "200+",
    color: "bg-amber-100 text-amber-600",
  },
];

const whyChoose = [
  {
    icon: ShieldCheck,
    title: "Certified Quality",
    description:
      "ISO 9001, AS9100, and IATF 16949 certified. Every fastener meets or exceeds industry standards with full traceability.",
  },
  {
    icon: Package,
    title: "Massive Selection",
    description:
      "Over 7,500 SKUs across all major fastener types, materials, and finishes. If we don't stock it, we'll source it.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description:
      "Same-day shipping on in-stock orders placed by 2 PM EST. Free ground shipping on orders over $1,000.",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description:
      "Our team of fastener specialists is available Monday-Friday to help with selection, specs, and custom orders.",
  },
];

const industries = [
  {
    name: "Aerospace",
    icon: Plane,
    description: "AS9100-certified fasteners for critical flight applications",
  },
  {
    name: "Automotive",
    icon: Car,
    description: "IATF 16949-compliant parts for OEM and aftermarket",
  },
  {
    name: "Construction",
    icon: Building2,
    description: "Structural bolts, anchors, and heavy-duty fasteners",
  },
  {
    name: "Electronics",
    icon: Cpu,
    description: "Micro fasteners and precision screws for assemblies",
  },
  {
    name: "Marine",
    icon: Ship,
    description: "Stainless steel and corrosion-resistant hardware",
  },
  {
    name: "Energy",
    icon: Zap,
    description: "High-strength fasteners for wind, solar, and oil & gas",
  },
];

const volumeTiers = [
  { qty: "25+", discount: "5%" },
  { qty: "100+", discount: "10%" },
  { qty: "500+", discount: "15%" },
  { qty: "1,000+", discount: "20%" },
  { qty: "5,000+", discount: "25%" },
  { qty: "10,000+", discount: "30%" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-orange-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium">
                ISO 9001 | AS9100 | IATF 16949 Certified
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Precision Fasteners for{" "}
              <span className="text-[#f97316]">Every Application</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-200 mb-8 leading-relaxed max-w-2xl">
              From aerospace-grade titanium bolts to everyday hardware, Accutite
              delivers the quality and selection professionals trust. Over 7,500
              SKUs with volume pricing and same-day shipping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#f97316] hover:bg-orange-600 text-white font-bold rounded-lg transition-colors text-lg"
              >
                Browse Products
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold rounded-lg transition-colors text-lg"
              >
                Request a Quote
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-white/20">
              <div>
                <p className="text-2xl md:text-3xl font-extrabold">7,500+</p>
                <p className="text-sm text-blue-300">Products</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extrabold">50K+</p>
                <p className="text-sm text-blue-300">Customers</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extrabold">35+</p>
                <p className="text-sm text-blue-300">Years</p>
              </div>
              <div className="hidden sm:block">
                <p className="text-2xl md:text-3xl font-extrabold">99.7%</p>
                <p className="text-sm text-blue-300">On-Time Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product Categories */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading">Shop by Category</h2>
            <p className="section-subheading">
              Explore our comprehensive range of precision fasteners and
              industrial hardware
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#1e40af]/20 transition-all duration-300 text-center"
                >
                  <div
                    className={`inline-flex p-4 rounded-xl ${cat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#1e40af] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-500">{cat.count} products</p>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/products"
              className="btn-outline inline-flex items-center gap-2"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Accutite */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading">Why Choose Accutite</h2>
            <p className="section-subheading">
              Industry-leading quality, selection, and service that
              professionals depend on
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChoose.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center">
                  <div className="inline-flex p-4 bg-blue-100 rounded-2xl mb-5">
                    <Icon className="w-8 h-8 text-[#1e40af]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Volume Pricing Callout */}
      <section className="py-16 md:py-24 bg-[#1e40af] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-400 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Volume Pricing That Scales with Your Business
            </h2>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              The more you order, the more you save. Automatic bulk discounts
              applied at checkout with no minimum order required.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {volumeTiers.map((tier) => (
              <div
                key={tier.qty}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 text-center hover:bg-white/20 transition-colors"
              >
                <p className="text-2xl md:text-3xl font-extrabold text-[#f97316]">
                  {tier.discount}
                </p>
                <p className="text-sm text-blue-200 mt-1 font-medium">
                  {tier.qty} units
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#f97316] hover:bg-orange-600 text-white font-bold rounded-lg transition-colors text-lg"
            >
              Start Saving Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Industry Sectors */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading">Industries We Serve</h2>
            <p className="section-subheading">
              Trusted by professionals across six major industry sectors with
              specialized fastener solutions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <div
                  key={industry.name}
                  className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-[#1e40af] hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-[#1e40af] transition-colors">
                      <Icon className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#1e40af] transition-colors">
                        {industry.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {industry.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shipping Partners Banner */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Shipping Partners
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2">
              <Truck className="w-6 h-6 text-[#644117]" />
              <span className="text-2xl font-extrabold text-[#644117] tracking-tight">
                UPS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-6 h-6 text-[#4D148C]" />
              <span className="text-2xl font-extrabold text-[#4D148C] tracking-tight">
                FedEx
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-6 h-6 text-[#D40511]" />
              <span className="text-2xl font-extrabold text-[#D40511] tracking-tight">
                DHL
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Same-Day Shipping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Real-Time Tracking</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Free Ground Over $1,000</span>
            </div>
          </div>
        </div>
      </section>

      {/* Account Signup CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gradient-navy rounded-2xl p-8 md:p-14 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-80 h-80 bg-orange-400 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Unlock Your Business Dashboard
              </h2>
              <p className="text-blue-200 text-lg mb-8 leading-relaxed">
                Create a free account to access order history, save favorites,
                manage quotes, track shipments, and get personalized volume
                pricing for your business.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left">
                <div className="flex items-start gap-3 bg-white/10 rounded-lg p-4">
                  <BarChart3 className="w-5 h-5 text-[#f97316] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Order Dashboard</p>
                    <p className="text-xs text-blue-300 mt-0.5">
                      Track orders, invoices, and shipments in real time
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/10 rounded-lg p-4">
                  <Users className="w-5 h-5 text-[#f97316] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Team Access</p>
                    <p className="text-xs text-blue-300 mt-0.5">
                      Add team members with role-based permissions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/10 rounded-lg p-4">
                  <Clock className="w-5 h-5 text-[#f97316] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Quick Reorder</p>
                    <p className="text-xs text-blue-300 mt-0.5">
                      Reorder previous purchases with one click
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#f97316] hover:bg-orange-600 text-white font-bold rounded-lg transition-colors text-lg"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-lg transition-colors text-lg"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
