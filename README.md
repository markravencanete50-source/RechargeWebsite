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
- `cd video && npm install && npm run render`: render the advertisement into `public/video/`
  (MP4 and poster), mastered to -14 LUFS. `npm run studio` opens it in Remotion Studio.
  It is built the same way as the Medville Diabetes ad: the voiceover leads and every scene is timed
  against it.
  - `npm run voiceover`: regenerate the voice (Kokoro, voice `af_heart`, runs locally, downloads the
    model once). Edit `LINES` in `video/voiceover/voiceover.py` to change the script; scenes follow.
  - `npm run sound`: rebuild the music bed and sound effects to the new length (synthesised, no
    licensed audio).
  - B-roll photos are free-to-use Pexels images, credited in `video/public/img/SOURCES.md`. App and
    website shots are real captures of the Recharge app (sample mode) and this website.

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
