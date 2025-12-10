"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Cell,
  Pie,
} from "recharts";
import { MapPin, Heart, Phone, Mail, Filter, Star, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Option } from "./components/tsx-collections";
import { COLORS, DEMAND_DATA, fmtCurrency, Listing, LISTINGS, PRICE_TREND, TYPE_DIST } from "./lib/data";

export default function RealEstateShowcase() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string>("All");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [beds, setBeds] = useState<number | string>("Any");
  const [selected, setSelected] = useState<Listing | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [lead, setLead] = useState({ name: "", email: "", phone: "", message: "" });

  const cities = useMemo(() => ["All", ...Array.from(new Set(LISTINGS.map((l) => l.location)))], []);
  const featured = LISTINGS.filter((l) => l.featured);
  
  const filtered = LISTINGS.filter((l) => {
    if (city !== "All" && l.location !== city) return false;
    if (query && !`${l.title} ${l.location} ${l.type}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (minPrice !== "" && l.price < Number(minPrice)) return false;
    if (maxPrice !== "" && l.price > Number(maxPrice)) return false;
    if (beds !== "Any" && l.beds < Number(beds)) return false;
    return true;
  });

  function openContact(listing?: Listing) {
    if (listing) setSelected(listing);
    setContactOpen(true);
  }

  function toggleFav(id: string) {
    setFavorites((f) => ({ ...f, [id]: !f[id] }));
  }

  function submitLead(e?: React.FormEvent) {
    e?.preventDefault();
    console.log("lead", { ...lead, listing: selected?.id || null });
    setLead({ name: "", email: "", phone: "", message: "" });
    setContactOpen(false);
    alert("Thanks — your enquiry was submitted. An agent will contact you shortly.");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white text-slate-900">
      {/* Mobile Quick Search */}
      <div className="md:hidden px-4 sm:px-6 py-4 bg-white border-b border-gray-200 sticky top-[60px] z-30">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-100 rounded-lg text-sm font-medium"
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
        <AnimatePresence>
          {mobileFilterOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3">
              <div className="flex-1 bg-white p-4 rounded-2xl shadow block">
                <h4 className="font-semibold mb-3">Filters</h4>
                <div className="space-y-6">
                  <div className="flex-1">
                    <div className='flex flex-1 shrink-0 z-35'>
                      <Option
                        initialValue={{ value: city}}
                        title={"Location"}
                        options={cities.map(c => ({ value: c }))}
                        sendBack={(e) => setCity(e.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex-1">
                      <div className='flex flex-1 shrink-0 z-35'>
                        <Option
                          initialValue={{ value: beds === 'Any'? 'Any' : `+${beds}`}}
                          title={"Beds"}
                          options={['Any', '+1', '+2', '+3', '+4', '+5', '+6'].map(c => ({ value: c }))}
                          sendBack={(e) => setBeds(e.value.startsWith('+') ? Number(e.value.slice(1)) : "Any")}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500">Price range</div>
                    <div className="flex gap-2 mt-1">
                      <input value={minPrice === "" ? "" : String(minPrice)} onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Min" className="w-[50%] border focus:outline-amber-600 p-2 rounded" />
                      <input value={maxPrice === "" ? "" : String(maxPrice)} onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Max" className="w-[50%] border focus:outline-amber-600 p-2 rounded" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => { setCity("All"); setMinPrice(""); setMaxPrice(""); setBeds("Any"); }} className="flex-1 p-2 rounded bg-slate-100 border border-gray-400">Reset</button>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex-1 p-2 rounded bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition">Apply</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12">
        {/* MARKET CHARTS - Responsive */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
              <h3 className="font-bold text-base sm:text-lg">Price Movement</h3>
              <div className="text-xs sm:text-sm text-slate-500 mt-2 sm:mt-0">Last 6 months</div>
            </div>
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer>
                <LineChart data={PRICE_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
              <h3 className="font-bold text-base sm:text-lg">Demand by Area</h3>
              <div className="text-xs sm:text-sm text-slate-500 mt-2 sm:mt-0">Lead interest</div>
            </div>
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={DEMAND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                  <XAxis dataKey="area" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
                  <Bar dataKey="demand" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </section>

        {/* Property Type Distribution */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-12 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <h3 className="font-bold text-base sm:text-lg mb-4">Property Distribution</h3>
          <div className="flex justify-center" style={{ height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={TYPE_DIST} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                  {TYPE_DIST.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 sm:gap-6 mt-4 flex-wrap">
            {TYPE_DIST.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                <span className="text-xs sm:text-sm text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FEATURED PROPERTIES - Responsive */}
        <section id="listings" className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Featured Properties</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">Hand-picked luxury listings — contact an agent for private viewings.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featured.map((l) => (
              <motion.article key={l.id} whileHover={{ y: -4 }} className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden border border-gray-200 group">
                <div className="relative w-full h-40 sm:h-48 md:h-56 overflow-hidden">
                  <Image src={l.img} alt={l.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute left-3 top-3 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">{l.type}</div>
                  <button onClick={() => toggleFav(l.id)} className="absolute right-3 top-3 bg-white rounded-full p-2 shadow hover:bg-slate-50 transition">
                    <Heart className={`w-4 h-4 ${favorites[l.id] ? "fill-red-500 text-red-500" : "text-slate-400"}`} />
                  </button>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2">{l.title}</h3>
                      <div className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {l.location}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm sm:text-lg font-extrabold">{fmtCurrency(l.price)}</div>
                      <div className="text-xs text-slate-400">{l.areaM2} m²</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs sm:text-sm text-slate-600">
                    <div>{l.beds} beds • {l.baths} baths</div>
                    {l.rating && <div className="flex items-center gap-1 text-amber-600"><Star className="w-3 h-3 fill-current" /> {l.rating}</div>}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setSelected(l)} className="flex-1 px-2 sm:px-3 py-2 rounded-lg bg-amber-600 text-white font-semibold text-xs sm:text-sm hover:bg-amber-700 transition">View</button>
                    <button onClick={() => openContact(l)} className="flex-1 px-2 sm:px-3 py-2 rounded-lg border border-gray-400 text-xs sm:text-sm hover:bg-slate-50 transition">Enquire</button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ALL LISTINGS - Responsive Grid */}
        <div className="flex flex-row gap-8">
          <div className="bg-white p-4 rounded-2xl shadow hidden mdlg:block w-fit max-w-[300px] h-fit">
            <h4 className="font-semibold mb-3">Filters</h4>
            <div className="space-y-7">
              <div className="flex-1">
                <div className='flex flex-1 shrink-0 z-35'>
                  <Option
                    initialValue={{ value: city}}
                    title={"Location"}
                    options={cities.map(c => ({ value: c }))}
                    sendBack={(e) => setCity(e.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex-1">
                  <div className='flex flex-1 shrink-0 z-35'>
                    <Option
                      initialValue={{ value: beds === 'Any'? 'Any' : `+${beds}`}}
                      title={"Beds"}
                      options={['Any', '+1', '+2', '+3', '+4', '+5', '+6'].map(c => ({ value: c }))}
                      sendBack={(e) => setBeds(e.value.startsWith('+') ? Number(e.value.slice(1)) : "Any")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Price range</div>
                <div className="flex gap-2 mt-1">
                  <input value={minPrice === "" ? "" : String(minPrice)} onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Min" className="w-[50%] border p-2 focus:outline-amber-600 rounded" />
                  <input value={maxPrice === "" ? "" : String(maxPrice)} onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Max" className="w-[50%] border p-2 focus:outline-amber-600 rounded" />
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => { setCity("All"); setMinPrice(""); setMaxPrice(""); setBeds("Any"); }} className="flex-1 p-2 rounded bg-slate-100 border border-gray-400">Reset</button>
                <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex-1 p-2 rounded bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition">Apply</button>
              </div>
            </div>
          </div>
          <section className="mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold">All Properties</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2">{filtered.length} properties available</p>
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="hidden md:block px-4 py-2 rounded-lg border border-gray-400 focus:border-0 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm w-full md:w-64"
              />
            </div>

            {/* Mobile search */}
            <div className="md:hidden mb-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search properties..."
                className="w-full px-4 py-2.5 rounded-lg border bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-1 bsm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filtered.length > 0 ? (
                filtered.map((l) => (
                  <motion.article key={l.id} whileHover={{ y: -4 }} className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden border border-gray-200 group">
                    <div className="relative w-full h-36 sm:h-44 overflow-hidden">
                      <Image src={l.img} alt={l.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button onClick={() => toggleFav(l.id)} className="absolute right-2 top-2 bg-white rounded-full p-1.5 shadow hover:bg-slate-50 transition">
                        <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${favorites[l.id] ? "fill-red-500 text-red-500" : "text-slate-400"}`} />
                      </button>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-xs sm:text-sm line-clamp-2">{l.title}</h3>
                      <div className="text-xs text-slate-500 mt-1">{l.type} • {l.location}</div>

                      <div className="mt-2 sm:mt-3">
                        <div className="font-extrabold text-sm sm:text-base">{fmtCurrency(l.price)}</div>
                        <div className="text-xs text-slate-400">{l.areaM2} m² • {l.beds} bed</div>
                      </div>

                      <div className="mt-2 sm:mt-3 flex gap-1.5">
                        <button onClick={() => setSelected(l)} className="flex-1 px-2 py-1.5 rounded text-xs bg-amber-600 text-white hover:bg-amber-700 transition">View</button>
                        <button onClick={() => openContact(l)} className="flex-1 px-2 py-1.5 rounded text-xs border border-gray-400 hover:bg-slate-50 transition">Ask</button>
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-slate-500">
                  <p className="text-sm">No properties match your filters. Try adjusting your search.</p>
                </div>
              )}
            </div>
          </section>
        </div>
        {/* AGENTS - Responsive */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6">Our Agents</h2> 
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from(new Set(LISTINGS.map((l) => l.agent?.name))).map((name, i) => {
              const agent = LISTINGS.find((l) => l.agent?.name === name)?.agent;
              if (!agent) return null;
              return (
                <motion.div key={i} whileHover={{ y: -4 }} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mx-auto mb-4 bg-slate-100">
                    {agent.img ? <Image src={agent.img} alt={agent.name} width={80} height={80} className="object-cover" /> : <div className="w-full h-full bg-slate-200" />}
                  </div>
                  <div className="font-semibold text-sm sm:text-base">{agent.name}</div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-1 space-y-1">
                    {agent.phone && <div className="flex items-center justify-center gap-1"><Phone className="w-3 h-3" /> {agent.phone}</div>}
                    {agent.email && <div className="flex items-center justify-center gap-1"><Mail className="w-3 h-3" /> {agent.email}</div>}
                  </div>
                  <button onClick={() => openContact()} className="mt-4 w-full px-3 py-2 rounded-lg bg-amber-600 text-white text-xs sm:text-sm font-semibold hover:bg-amber-700 transition">
                    Contact
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mb-12 bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6">What Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              { text: "Beautiful portfolio and personalised service. We closed on a beachfront villa within 2 weeks.", author: "Olumide A." },
              { text: "Agent arranged virtual tours and inspection. Seamless transaction.", author: "Miriam O." },
              { text: "Outstanding professionalism and attention to detail. Highly recommended!", author: "Chioma E." },
              { text: "Best real estate team in Lagos. Found the perfect investment property.", author: "Tunde K." },
            ].map((t, i) => (
              <div key={i} className="p-4 sm:p-6 border border-gray-200 rounded-lg hover:shadow-md transition">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mb-3">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-xs sm:text-sm">— {t.author}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* LISTING DETAIL MODAL - Responsive */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Gallery */}
                <div className="relative h-64 md:h-full min-h-96">
                  {selected.gallery && selected.gallery.length > 0 ? (
                    <>
                      <Image src={selected.gallery[galleryIndex]} alt={selected.title} fill className="object-cover" />
                      {selected.gallery.length > 1 && (
                        <>
                          <button
                            onClick={() => setGalleryIndex((i) => (i - 1 + selected.gallery!.length) % selected.gallery!.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setGalleryIndex((i) => (i + 1) % selected.gallery!.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {selected.gallery.map((_, i) => (
                              <button key={i} onClick={() => setGalleryIndex(i)} className={`w-2 h-2 rounded-full ${i === galleryIndex ? "bg-white" : "bg-white/50"}`} />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <Image src={selected.img} alt={selected.title} fill className="object-cover" />
                  )}
                </div>

                {/* Details */}
                <div className="p-4 sm:p-6 flex flex-col">
                  <button
                    onClick={() => { setSelected(null); setGalleryIndex(0); }}
                    className="self-end p-2 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold">{selected.title}</h3>
                        <div className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {selected.location}
                        </div>
                      </div>
                      <button onClick={() => toggleFav(selected.id)} className="shrink-0 p-2 rounded-full hover:bg-slate-100">
                        <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${favorites[selected.id] ? "fill-red-500 text-red-500" : "text-slate-400"}`} />
                      </button>
                    </div>

                    <div className="mt-4 text-2xl sm:text-3xl font-extrabold">{fmtCurrency(selected.price)}</div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[
                        { label: "Beds", value: selected.beds },
                        { label: "Baths", value: selected.baths },
                        { label: "Area", value: `${selected.areaM2} m²` },
                      ].map((item, i) => (
                        <div key={i} className="p-3 border rounded-lg text-center">
                          <div className="font-semibold text-sm sm:text-base">{item.value}</div>
                          <div className="text-xs text-slate-500">{item.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold text-sm mb-2">Overview</h4>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Exclusive luxury property with modern smart home features, premium finishes and concierge services. Ideal for high-net-worth buyers and investors seeking long-term value.
                      </p>
                    </div>

                    {selected.agent && (
                      <div className="mt-6 p-3 bg-slate-50 rounded-lg">
                        <h4 className="font-semibold text-xs sm:text-sm mb-2">Agent</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                            {selected.agent.img && <Image src={selected.agent.img} alt={selected.agent.name} width={40} height={40} className="object-cover" />}
                          </div>
                          <div className="flex-1 text-xs">
                            <div className="font-semibold">{selected.agent.name}</div>
                            {selected.agent.phone && <div className="text-slate-500">{selected.agent.phone}</div>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => openContact(selected)}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition text-sm sm:text-base"
                    >
                      Request Viewing
                    </button>
                    <button
                      onClick={() => { setSelected(null); setGalleryIndex(0); }}
                      className="px-4 py-2.5 rounded-lg border text-sm sm:text-base hover:bg-slate-50 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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