export type Listing = {
  id: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  areaM2: number;
  img: string;
  gallery?: string[];
  featured?: boolean;
  type?: string;
  agent?: { name: string; phone?: string; email?: string; img?: string };
  rating?: number;
  views?: number;
};

export const PRICE_TREND = [
  { month: "Jan", price: 52 },
  { month: "Feb", price: 55 },
  { month: "Mar", price: 58 },
  { month: "Apr", price: 60 },
  { month: "May", price: 64 },
  { month: "Jun", price: 67 },
];

export const DEMAND_DATA = [
  { area: "Lekki", demand: 820 },
  { area: "Ajah", demand: 690 },
  { area: "Ikeja", demand: 770 },
  { area: "Enugu", demand: 540 },
  { area: "Abuja", demand: 910 },
];

export const TYPE_DIST = [
  { name: "Villas", value: 2 },
  { name: "Apartments", value: 1 },
  { name: "Penthouses", value: 1 },
];

export const COLORS = ["#6366f1", "#06b6d4", "#f59e0b"];

export const LISTINGS: Listing[] = [
  {
    id: "L-001",
    title: "Oceanfront Smart Villa with Infinity Pool",
    price: 450000000,
    location: "Victoria Island",
    beds: 6,
    baths: 7,
    areaM2: 1200,
    img: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80",
    ],
    featured: true,
    type: "Villa",
    rating: 4.9,
    views: 1240,
    agent: { name: "Aisha Bello", phone: "+2348012345678", email: "aisha@elite.re", img: "https://images.unsplash.com/photo-1679747725226-88fd87f220a7?w=400&q=60" },
  },
  {
    id: "L-002",
    title: "Modern Smart Apartment — Floor 12",
    price: 85000000,
    location: "Ikeja GRA",
    beds: 3,
    baths: 2,
    areaM2: 140,
    img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1400&q=80",
    gallery: [],
    featured: false,
    type: "Apartment",
    rating: 4.6,
    views: 890,
    agent: { name: "Chinedu Okonkwo", phone: "+2348098765432", email: "chinedu@elite.re", img: "https://plus.unsplash.com/premium_photo-1674777843203-da3ebb9fbca0?w=400&q=60" },
  },
  {
    id: "L-003",
    title: "Serviced Terrace House with Garden",
    price: 120000000,
    location: "Abuja Wuse 2",
    beds: 4,
    baths: 4,
    areaM2: 260,
    img: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
    gallery: [],
    featured: false,
    type: "Terrace",
    rating: 4.7,
    views: 650,
    agent: { name: "Fatima Yusuf", phone: "+2348023456789", email: "fatima@elite.re", img: "https://images.unsplash.com/photo-1667318788274-efaa1acb6e81?w=400&q=60" },
  },
  {
    id: "L-004",
    title: "Luxury Penthouse with Rooftop",
    price: 320000000,
    location: "Ikoyi",
    beds: 5,
    baths: 5,
    areaM2: 780,
    img: "https://plus.unsplash.com/premium_photo-1661883964999-c1bcb57a7357?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW9kZXJuJTIwaG91c2VzfGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=60&w=3000",
    featured: true,
    type: "Penthouse",
    rating: 4.8,
    views: 1450,
    agent: { name: "David Okafor", phone: "+2348034567890", email: "david@elite.re", img: "https://images.unsplash.com/photo-1743896158768-ffbda6f2e9d8?w=400&q=60" },
  },
  {
    id: "L-005",
    title: "Executive Duplex with Pool",
    price: 180000000,
    location: "Lekki",
    beds: 4,
    baths: 3,
    areaM2: 350,
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    featured: true,
    type: "Duplex",
    rating: 4.5,
    views: 920,
    agent: { name: "Aisha Bello", phone: "+2348012345678", email: "aisha@elite.re", img: "https://images.unsplash.com/photo-1679747725226-88fd87f220a7?w=400&q=60" },
  },
  {
    id: "L-006",
    title: "Contemporary Townhouse",
    price: 75000000,
    location: "Ajah",
    beds: 3,
    baths: 2,
    areaM2: 120,
    img: "https://images.unsplash.com/photo-1627141234469-24711efb373c?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW9kZXJuJTIwaG91c2VzfGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=60&w=3000",
    featured: false,
    type: "Townhouse",
    rating: 4.4,
    views: 560,
    agent: { name: "Chinedu Okonkwo", phone: "+2348098765432", email: "chinedu@elite.re", img: "https://plus.unsplash.com/premium_photo-1674777843203-da3ebb9fbca0?w=400&q=60" },
  },
];

export function fmtCurrency(n: number) {
  return "₦" + n.toLocaleString();
}