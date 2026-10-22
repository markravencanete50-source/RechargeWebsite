// Where Recharge homes can be booked besides the Recharge website. Shown on the About page under "Our trusted partners".
// Add a logo by putting the file in public/partners and setting `logo` ("/partners/airbnb.svg"); until then the name is shown.
export type Partner = { name: string; logo?: string };

export const partners: Partner[] = [
  { name: "Airbnb" },
  { name: "Booking.com" },
];
