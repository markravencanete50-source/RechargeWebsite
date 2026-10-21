// Listing text written for Airbnb, reworded for Recharge's own website. Used by import-properties.mjs.

// Sentences that point guests "outside Airbnb" or "outside the platform" for registration, which
// read oddly on a direct-booking site. The registration step stays; only the platform wording goes.
const PLATFORM = [
  [/\b(link|form)\s+(?:that(?:['’]s| is)\s+)?outside\s+(?:of\s+)?(?:the\s+)?(?:Airbnb|booking)?\s*(?:platform)?(?=[\s.,;)]|$)/gi, "$1 we send you"],
  [/\busing a link outside (?:of )?(?:the )?(?:Airbnb|booking)?\s*platform\b/gi, "using a link we send you"],
];

export function cleanDescription(text) {
  let out = text;
  for (const [re, to] of PLATFORM) out = out.replace(re, to);
  return out.replace(/link we send you\s+we send you/gi, "link we send you").replace(/\bour (link|form) we send you/gi, "a secure $1 we send you").replace(/[ \t]+([.,])/g, "$1");
}
