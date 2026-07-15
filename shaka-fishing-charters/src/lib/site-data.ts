// PLACEHOLDER markers below indicate content you should confirm or replace
// with real business details, photos, and copy before launch.

export const business = {
  name: "Shaka Fishing Charters & Tours",
  shortName: "Shaka Charters",
  tagline: "Maui's waters, your story to catch",
  captain: {
    name: "Chase McKenna",
    role: "Captain",
  },
  guide: {
    name: "Casimiri Bushnell",
    role: "Fishing Guide",
  },
  // PLACEHOLDER: confirm real departure marina
  location: {
    marina: "Lahaina Harbor",
    island: "Maui, Hawaii",
    address: "PLACEHOLDER — 675 Wharf St, Lahaina, HI 96761",
  },
  // PLACEHOLDER: confirm real contact details
  contact: {
    phone: "(808) 555-0142",
    email: "bookings@shakafishingcharters.com",
    instagram: "@shakafishingcharters",
  },
  // PLACEHOLDER: deposit policy — confirm real percentage/amount
  depositPercent: 25,
};

export type TripType = {
  slug: string;
  name: string;
  durationHours: number;
  price: number;
  maxGuests: number;
  summary: string;
  description: string;
  includes: string[];
  highlight?: string;
};

export const tripTypes: TripType[] = [
  {
    slug: "half-day-hunt",
    name: "4-Hour Half-Day Hunt",
    durationHours: 4,
    price: 1500,
    maxGuests: 6,
    summary: "A fast, focused run offshore for anglers short on time but not on ambition.",
    description:
      "Perfect for first-timers and families, the Half-Day Hunt gets you out past the reef and onto Maui's productive nearshore grounds fast. Expect a mix of trolling and bottom fishing depending on conditions, with Captain Chase and Guide Casimiri reading the water for mahi-mahi, ono, and reef species.",
    includes: [
      "All rods, reels, and tackle",
      "Bait and ice",
      "Captain & fishing guide",
      "Water and light snacks",
      "Fish cleaning at dock",
    ],
  },
  {
    slug: "full-day-offshore",
    name: "8-Hour Offshore Charter",
    durationHours: 8,
    price: 2800,
    maxGuests: 6,
    summary: "A full day chasing the blue water game fish Maui is famous for.",
    description:
      "Our most popular charter. Eight hours gives us the range to reach deep-water grounds where marlin, ahi, and mahi-mahi run. This trip is built for anglers who want a real shot at the big pelagics, with time to work multiple spots as conditions change through the day.",
    includes: [
      "All rods, reels, and tackle",
      "Bait, ice, and lunch",
      "Captain & fishing guide",
      "Fish cleaning and bagging at dock",
      "Photos from the day",
    ],
    highlight: "Most Popular",
  },
  {
    slug: "full-day-experience",
    name: "Full Day Experience",
    durationHours: 8,
    price: 4500,
    maxGuests: 6,
    summary: "8 hours offshore, then we cook the catch and dine together on the water.",
    description:
      "The complete Shaka day: a full 8-hour offshore charter followed by an onboard cookout of whatever you bring in, prepared fresh and served as the sun drops over the West Maui Mountains. This is the trip for a milestone day on the water — equal parts fishing trip and private dinner cruise.",
    includes: [
      "Everything in the 8-Hour Offshore Charter",
      "Onboard cooking of your catch",
      "Dinner service with island sides",
      "Sunset return",
      "Photos from the day",
    ],
    highlight: "Signature Experience",
  },
];

// PLACEHOLDER testimonials — replace with real guest reviews
export const testimonials = [
  {
    id: "testimonial-1",
    quote:
      "Captain Chase put us on fish within the first hour. The full day experience with dinner on the boat was the highlight of our trip to Maui.",
    author: "PLACEHOLDER — Guest Name 1",
    location: "Portland, OR",
  },
  {
    id: "testimonial-2",
    quote:
      "Casimiri knew exactly where to find the mahi-mahi. Professional, fun, and the boat was immaculate.",
    author: "PLACEHOLDER — Guest Name 2",
    location: "Austin, TX",
  },
  {
    id: "testimonial-3",
    quote:
      "Booked the 8-hour charter for my dad's 60th birthday. We landed an ahi and they cooked it right there for us. Unreal.",
    author: "PLACEHOLDER — Guest Name 3",
    location: "Seattle, WA",
  },
];
