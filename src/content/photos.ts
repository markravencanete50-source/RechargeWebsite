// Every property photo on the site comes from this list. Photos are real Recharge homes only,
// served from Cloudinary. Until a `src` is filled in, the site shows a plain brand panel in its place.
//
// To add one: upload the photo to Cloudinary and paste its https://res.cloudinary.com/... address as `src`.

export type Photo = {
  src: string | null;
  alt: string;
};

export type Home = {
  name: string;
  area: string;
  sleeps?: number;
  photo: Photo;
};

export const heroPhoto: Photo = {
  src: null,
  alt: "Living room in a Recharge serviced apartment",
};

// CONFIRM: names and areas below are from the old site's home page.
export const homes: Home[] = [
  { name: "The Alice", area: "Paisley", photo: { src: null, alt: "The Alice, Paisley" } },
  { name: "The Lindores", area: "Tranent", photo: { src: null, alt: "The Lindores, Tranent" } },
  { name: "City apartment", area: "Edinburgh", photo: { src: null, alt: "Recharge apartment in Edinburgh" } },
  { name: "Family home", area: "Livingston", photo: { src: null, alt: "Recharge home in Livingston" } },
];
