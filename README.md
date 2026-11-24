# Hitmark Group — site redesign

Wherever Studios redesign of [hitmarkgroup.com](https://www.hitmarkgroup.com/) (Hitmark Group, Devin Chatterjie, El Cajon / San Diego CA): an action-sports aviation filming company that also brokers private air charter.

Static HTML, no build step. Four pages share `assets/styles.css` and `assets/site.js`; photos live in `media/`.

## Run it

```bash
node serve.mjs 4327
```

Live preview: https://whereverstudios.github.io/hitmark-group/ (GitHub Pages from `main`, root). When the real domain moves here, point the canonical and `og:image` URLs in the four pages back at hitmarkgroup.com.

Then open http://localhost:4327/. Any static host works (GitHub Pages, Netlify, Squarespace replacement): upload the four `.html` files plus `assets/` and `media/`.

## Structure

| Page | Job |
|---|---|
| `index.html` | Split-screen gate in the style of stoyc.com: **Production** (left) / **Private Charters** (right). Hover widens a side; images drift with the cursor; arrow keys pick a side. |
| `production.html` | Sells film: hero, stats, five capability cards, 17-film reel grid (click-to-play YouTube lightbox, nine behind "load more"), client logo marquee, stills grid, kit, process, ethos, charter cross-sell, CTA. |
| `charters.html` | Sells charter: hero, "we fly for a living", four aircraft categories, how it works, concierge, mission stills, inline quote form, production cross-sell, FAA broker disclosure. |
| `contact.html` | One form with a Production brief / Charter quote switch (`?mode=charter` preselects), contact details, founder card. |

Forms compose an email to devin@hitmarkgroup.com in the visitor's mail app. Swap the submit handler in `site.js` for Formspree / Netlify Forms if Devin wants submissions without a mail client.

## Design

Red Bull / F1-driver energy over Stoyc's split-gate structure: near-black ink, bone type, one flare red, Anton display with Barlow Condensed labels and Barlow body, diagonal section cuts, film-grain overlay, HM monogram redrawn as inline SVG from the old logo, crosshair "hitmark" reticle on the gate seam.

## Content sources

- All photos are Hitmark's own, pulled from the old Squarespace galleries (Cinema, Events, Stills/Travel, Aviation, Charter) and re-exported for web; originals in `media/src/` (gitignored). Client logos trimmed from the old Clients page, shown white via CSS filter.
- Reel thumbnails are YouTube's own frames for the films embedded on the old Cinema page; the lightbox streams from youtube-nocookie.com.
- Copy is rewritten from the old Ethos, Aviation, Charter and Contact pages. The charter regulatory notice and aviation operational disclosure are kept verbatim in substance.

## To confirm with Devin before launch

- **Numbers.** "40+ films" counts the old Cinema page embeds, "24 brands" counts the old Clients page, "3 camera platforms" and "24 h reply" come from the old copy. Correct any he disagrees with.
- **Reel credits.** Several embedded films were made with or by partners (Wherever Studios' Tony Hawk piece, WARD adventure series, NFX explainers). The grid keeps the ones that read as Hitmark work and credits the collaboration where obvious; he should prune or re-credit.
- **Founder bio.** The old "Learn more about the founder" link 404s; the contact page has a one-line placeholder for Devin.
- **Phone / address.** Carried over as published: 703-380-3720, 1915 N Marshall Ave, El Cajon CA 92020. Confirm the 703 number is still the one he wants public.
- **Aircraft photos.** Per his own disclosure, aircraft shown may not be available for charter; captions avoid naming operators or types.
- Terms & Conditions and Disclaimer links point at the old Squarespace pages until those move.
- Favicon is a quick SVG of the monogram; the original vector logo would be better.
