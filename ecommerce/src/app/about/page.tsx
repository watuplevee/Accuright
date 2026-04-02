import {
  Shield,
  Award,
  Users,
  Clock,
  Package,
  MapPin,
  Target,
  Building2,
  BadgeCheck,
  Calendar,
} from "lucide-react";

const CERTIFICATIONS = [
  {
    name: "ISO 9001:2015",
    description: "Quality Management Systems",
    icon: Shield,
  },
  {
    name: "AS9100D",
    description: "Aerospace Quality Management",
    icon: Award,
  },
  {
    name: "IATF 16949",
    description: "Automotive Quality Management",
    icon: BadgeCheck,
  },
];

const STATS = [
  { label: "SKUs", value: "7,500+", icon: Package },
  { label: "Customers", value: "50,000+", icon: Users },
  { label: "On-Time Delivery", value: "99.7%", icon: Clock },
  { label: "Years in Business", value: "35+", icon: Calendar },
];

const WAREHOUSES = [
  {
    city: "Los Angeles",
    label: "Headquarters",
    address: "1200 Industrial Way, Los Angeles, CA 90023",
    phone: "(800) 555-0100",
  },
  {
    city: "Dallas",
    label: "Regional Distribution",
    address: "4500 Commerce Dr, Dallas, TX 75247",
    phone: "(800) 555-0101",
  },
  {
    city: "Chicago",
    label: "Regional Distribution",
    address: "800 Manufacturing Pkwy, Chicago, IL 60609",
    phone: "(800) 555-0102",
  },
];

const TEAM_MEMBERS = [
  { name: "Robert Chen", title: "CEO & Founder", initials: "RC" },
  { name: "Maria Santos", title: "VP of Operations", initials: "MS" },
  { name: "David Park", title: "Director of Engineering", initials: "DP" },
  { name: "Sarah Mitchell", title: "Head of Sales", initials: "SM" },
  { name: "James Wilson", title: "Quality Assurance Lead", initials: "JW" },
  { name: "Lisa Nguyen", title: "Supply Chain Manager", initials: "LN" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Accutite Fasteners
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Providing precision fasteners with unmatched quality and service
            since 1989
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
          <Target className="w-10 h-10 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Providing precision fasteners with unmatched quality and service
            since 1989. We partner with manufacturers, contractors, and
            engineers across every industry to deliver the right fastener for
            every application -- on time, every time. Our commitment to quality
            assurance, competitive pricing, and technical expertise makes
            Accutite the trusted choice for fastener solutions nationwide.
          </p>
        </div>
      </section>

      {/* Certifications */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Industry Certifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CERTIFICATIONS.map((cert) => {
            const Icon = cert.icon;
            return (
              <div
                key={cert.name}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {cert.name}
                </h3>
                <p className="text-sm text-gray-500">{cert.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <Icon className="w-8 h-8 text-blue-300 mx-auto mb-3" />
                  <p className="text-3xl md:text-4xl font-bold mb-1">
                    {stat.value}
                  </p>
                  <p className="text-blue-300 text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Warehouse Locations */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Warehouse Locations
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Strategically located for fast delivery across the United States
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WAREHOUSES.map((wh) => (
            <div
              key={wh.city}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{wh.city}</h3>
                  <p className="text-xs text-blue-600 font-medium">
                    {wh.label}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{wh.address}</p>
              <p className="text-sm text-gray-500">{wh.phone}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Our Leadership Team
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Experienced professionals dedicated to your success
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.name} className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-gray-500">
                  {member.initials}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                {member.name}
              </h3>
              <p className="text-xs text-gray-500">{member.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Building2 className="w-10 h-10 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-gray-600 mb-6">
            Contact our team to discuss your fastener requirements, request a
            quote, or set up a wholesale account.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Contact Us
            </a>
            <a
              href="/products"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-white transition"
            >
              Browse Products
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
