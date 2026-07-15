export const siteConfig = {
  name: "Shaka Fishing Charter & Tours",
  shortName: "Shaka Fishing Charter",
  tagline: "Blue-water sportfishing out of Lahaina Harbor",
  phone: "(808) 555-0142",
  phoneHref: "+18085550142",
  email: "book@shakafishingcharter.com",
  harbor: "Lahaina Harbor",
  address: "Slip 12, Lahaina Harbor, Lahaina, HI 96761",
  coordinates: "20.8712° N, 156.6779° W",
  instagram: "@shakafishingcharter",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/charters", label: "Charters" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export type CharterTier = {
  id: string;
  name: string;
  duration: string;
  price: number;
  tag?: string;
  summary: string;
  includes: string[];
  idealFor: string;
};

export const charterTiers: CharterTier[] = [
  {
    id: "four-hour",
    name: "4-Hour Charter",
    duration: "4 Hours",
    price: 1500,
    summary:
      "A fast-moving run out to the ledges off Lahaina for anglers working with a tight schedule. Enough time to get lines wet and get tight without giving up the whole day.",
    includes: [
      "Rods, reels & tackle",
      "Bait & terminal gear",
      "Ice, water & soft drinks",
      "Captain & deckhand",
      "Up to 6 anglers",
    ],
    idealFor: "First-timers, cruise-ship stops, short-window travel days",
  },
  {
    id: "eight-hour",
    name: "8-Hour Charter",
    duration: "8 Hours",
    price: 2800,
    tag: "Most Booked",
    summary:
      "A full day on the water with time to run the FADs, work the drop-offs, and stay on fish when they're biting. Our most-booked trip for a reason.",
    includes: [
      "Rods, reels & tackle",
      "Bait & terminal gear",
      "Ice, water & soft drinks",
      "Captain & deckhand",
      "Up to 6 anglers",
      "Extended range to deeper grounds",
    ],
    idealFor: "Serious anglers, groups chasing marlin, tournament practice",
  },
  {
    id: "full-experience",
    name: "Full-Day Experience",
    duration: "8 Hours + Cookout",
    price: 4500,
    tag: "Signature Trip",
    summary:
      "Everything in the 8-hour charter, then we idle back to a quiet anchorage, fire up the grill, and cook your catch right there on the boat. No fishing trip, this is a day on the water.",
    includes: [
      "Everything in the 8-Hour Charter",
      "Fresh catch cooked onboard",
      "Extended anchorage time to swim & relax",
      "Ice-cold drinks & light snacks",
      "Up to 6 anglers",
    ],
    idealFor: "Celebrations, family trips, anyone who wants the whole day on the water",
  },
];

export type Species = {
  name: string;
  hawaiianOrCommon: string;
  season: string;
  blurb: string;
};

export const targetSpecies: Species[] = [
  {
    name: "Blue Marlin",
    hawaiianOrCommon: "A'u",
    season: "Year-round, peak summer",
    blurb: "The reason people fly to Maui with rods in their bag. We work the drop-offs west of Lahaina where the blues stage.",
  },
  {
    name: "Mahi-Mahi",
    hawaiianOrCommon: "Dorado",
    season: "Best spring–fall",
    blurb: "Fast, acrobatic, and one of the best eating fish in the Pacific. We find them running current lines and floating debris.",
  },
  {
    name: "Ono",
    hawaiianOrCommon: "Wahoo",
    season: "Year-round",
    blurb: "Blistering runs and a razor bite. Ono keep the reels screaming on the troll between marlin bites.",
  },
  {
    name: "Ahi",
    hawaiianOrCommon: "Yellowfin Tuna",
    season: "Best summer",
    blurb: "Heavy, hard-pulling, and worth every minute on the rod. A prized catch for the cookout at the end of the day.",
  },
];

export type FAQ = { question: string; answer: string };

export const faqs: FAQ[] = [
  {
    question: "Do I need a fishing license?",
    answer:
      "No. Hawai'i does not require a license for recreational saltwater fishing, so you can step aboard and start fishing with nothing to arrange beforehand.",
  },
  {
    question: "What happens to the fish we catch?",
    answer:
      "The catch is yours. On the 4-Hour and 8-Hour Charters we'll bag and ice your fish so you can take it home or to a local kitchen to have it prepared. On the Full-Day Experience, we cook it fresh on the boat.",
  },
  {
    question: "I've never been deep sea fishing. Is that a problem?",
    answer:
      "Not at all — most of our guests are first-timers. Your captain and deckhand handle the technical parts and walk you through everything boat-side.",
  },
  {
    question: "What should I bring?",
    answer:
      "Reef-safe sunscreen, a hat, sunglasses, a light jacket for the ride out, and a camera. We provide rods, tackle, ice, water, and soft drinks on every trip.",
  },
  {
    question: "What if I get seasick?",
    answer:
      "Waters off Lahaina are protected by Moloka'i and Lāna'i, so conditions are usually calm. If you're prone to motion sickness, we recommend taking a non-drowsy motion-sickness tablet an hour before departure.",
  },
  {
    question: "What's your weather/cancellation policy?",
    answer:
      "Your safety comes first. If conditions aren't fishable, we'll work with you to reschedule or provide a full refund — no cancellation fee on our end.",
  },
  {
    question: "Can I book a private charter for a group or celebration?",
    answer:
      "Yes — every charter is private, just your group aboard. Let us know if you're celebrating something specific and we'll help you plan the day.",
  },
];
