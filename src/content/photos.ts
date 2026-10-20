// Every property on the site and its photos. Photos are real Recharge homes only, served from
// Cloudinary. Until a photo `src` is filled in, the site shows a plain brand panel in its place.
//
// To add a photo: upload it to Cloudinary and paste its https://res.cloudinary.com/... address as `src`.
// Only fill in facts (sleeps, bedrooms, licence) that are confirmed; empty ones are not shown.

export type Photo = {
  src: string | null;
  alt: string;
};

export type Home = {
  slug: string;
  name: string;
  area: string;
  summary?: string;
  sleeps?: number;
  bedrooms?: number;
  bathrooms?: number;
  // Scottish short-term let licence number. Must show on every listing once known.
  licence?: string;
  // Direct booking link for this home. Falls back to the main booking site.
  bookingUrl?: string;
  photos: Photo[];
};

// CONFIRM: names and areas below are from the old site's home page. Add the rest of the portfolio here.
export const homes: Home[] = [
  { slug: "the-alice", name: "The Alice", area: "Paisley", photos: [{ src: null, alt: "The Alice, Paisley" }] },
  { slug: "the-lindores", name: "The Lindores", area: "Tranent", photos: [{ src: null, alt: "The Lindores, Tranent" }] },
  { slug: "edinburgh-apartment", name: "Edinburgh apartment", area: "Edinburgh", photos: [{ src: null, alt: "Recharge apartment in Edinburgh" }] },
  { slug: "livingston-home", name: "Livingston home", area: "Livingston", photos: [{ src: null, alt: "Recharge home in Livingston" }] },
];

export const homeBySlug = (slug: string) => homes.find((h) => h.slug === slug);
