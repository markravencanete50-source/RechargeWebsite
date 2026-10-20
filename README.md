# Recharge website

The public website for Recharge at rechargestays.co.uk: serviced accommodation for guests, and
guaranteed rent or full management for property owners.

## Stack

| Part | Service |
| --- | --- |
| Site | Next.js (App Router), hosted on Vercel |
| Property photos | Cloudinary |
| Enquiries | Firebase (to be connected) |
| Email | Resend (to be connected) |

## Commands

- `npm install` then `npm run dev`: run the site at http://localhost:3000.
- `npm run build`: production build.
- `npm run lint`: lint.
- `cd video && npm install && npm run render`: build the score and render the "why we are
  different" film into `public/video/` (MP4 with music, and a poster). Needs Python with numpy,
  scipy and soundfile, and ffmpeg. `npm run studio` opens it in Remotion Studio for editing.
  Picture and music share one timeline (`video/src/timeline.json`, 120 bpm, a beat is 15 frames),
  so every cut, tap and hit lands together. The music is original and synthesised: nothing to license.

## Where things live

- `src/content/site.ts`: phone, email, booking link, areas and other business facts. Lines marked
  `CONFIRM` came from the old site and need checking before launch.
- `src/content/photos.ts`: every property photo. Only real Recharge homes, as Cloudinary addresses.
  An empty `src` shows a plain brand panel until the photo is added.
- `public/app/`: real screens from the Recharge app (sample mode), used in the phone mockups.
- `public/brand/`: the approved thin-line Recharge logo, with the background removed. The line art is
  unchanged.
- `src/app/api/enquiry/route.ts`: the enquiry form endpoint. It checks the details and answers 503
  until Firebase and Resend are connected, so the form shows the phone and email instead.

## Brand

Colours come from the Recharge app: cream `#EFE9DB`, forest `#1B3E38`, mint `#A7D9C1`. The font is
Montserrat. Copy is UK English, plain and direct, with no em dashes.
