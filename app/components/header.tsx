"use client";


import { Heart, Home, X } from "lucide-react";
import { provider } from "@/app/components/provider";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { fmtCurrency, Listing, LISTINGS } from "../lib/data";

export default function Navbar() {
  const [contactOpen, setContactOpen] = useState(false);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [lead, setLead] = useState({ name: "", email: "", phone: "", message: "" });

  function submitLead(e?: React.FormEvent) {
    e?.preventDefault();
    console.log("lead", { ...lead, listing: selected?.id || null });
    setLead({ name: "", email: "", phone: "", message: "" });
    setContactOpen(false);
    alert("Thanks — your enquiry was submitted. An agent will contact you shortly.");
  }

  const stats = useMemo(() => {
    const avgPrice = Math.round(LISTINGS.reduce((s, l) => s + l.price, 0) / LISTINGS.length);
    const totalValue = LISTINGS.reduce((s, l) => s + l.price, 0);
    const avgBeds = Math.round(LISTINGS.reduce((s, l) => s + l.beds, 0) / LISTINGS.length);
    const totalViews = LISTINGS.reduce((s, l) => s + (l.views || 0), 0);
    return { avgPrice, totalValue, avgBeds, totalViews };
  }, []);

  function openContact(listing?: Listing) {
    if (listing) setSelected(listing);
    setContactOpen(true);
  }

  return (
    <div>
      <div className="relative overflow-hidden bg-linear-to-br from-slate-800 to-amber-600 text-white px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-20 mt-0">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0" stopColor="#1e293b" />
                <stop offset="1" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Hero Text */}
            <div className="lg:col-span-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight">
                Find Your Dream Property
              </h1>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-amber-50 max-w-2xl">
                Browse curated villas, penthouses, serviced houses and high-end apartments across Nigeria&rsquo;s premium neighborhoods. Schedule a private viewing or request a brochure — our concierge team handles everything.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => { document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-amber-500 text-white font-semibold rounded-lg shadow hover:bg-amber-600 transition focus:outline-none focus:ring-2 focus:ring-amber-300 text-sm sm:text-base"
                >
                  Explore Listings
                </button>
                <button
                  onClick={() => openContact()}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition text-sm sm:text-base"
                >
                  Schedule Viewing
                </button>
              </div>

              {/* Stats Grid - Responsive */}
              <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: "Avg. Price", value: fmtCurrency(stats.avgPrice) },
                  { label: "Total Listings", value: LISTINGS.length },
                  { label: "Avg. Beds", value: stats.avgBeds },
                  { label: "Total Views", value: `${Math.round(stats.totalViews / 1000)}K+` },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-xs sm:text-sm text-amber-100">{stat.label}</div>
                    <div className="font-bold mt-1 text-sm sm:text-base">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>            
          </div>
        </div>
      </div>
      {/* CONTACT MODAL - Responsive */}
      <AnimatePresence>
        {contactOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.form
              onSubmit={submitLead}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl sm:rounded-2xl w-full max-w-md p-4 sm:p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base sm:text-lg">
                  {selected ? `Enquire: ${selected.title}` : "Schedule a Viewing"}
                </h3>
                <button
                  type="button"
                  onClick={() => { setContactOpen(false); setSelected(null); }}
                  className="p-1 rounded hover:bg-slate-100"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  required
                  value={lead.name}
                  onChange={(e) => setLead({ ...lead, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full p-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                />
                <input
                  required
                  type="email"
                  value={lead.email}
                  onChange={(e) => setLead({ ...lead, email: e.target.value })}
                  placeholder="Email address"
                  className="w-full p-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                />
                <input
                  required
                  type="tel"
                  value={lead.phone}
                  onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                  placeholder="Phone number"
                  className="w-full p-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                />
                {selected && (
                  <input
                    value={`${selected.location} - ${selected.type}`}
                    readOnly
                    className="w-full p-2.5 border border-gray-400 rounded-lg bg-slate-50 text-slate-600 text-sm"
                  />
                )}
                <textarea
                  value={lead.message}
                  onChange={(e) => setLead({ ...lead, message: e.target.value })}
                  placeholder="Message / preferred viewing time"
                  className="w-full p-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm h-24"
                />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => { setContactOpen(false); setSelected(null); }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-400 text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition"
                >
                  Send Enquiry
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

