# Agent instructions — Static Local Business Boilerplate

Use this repo as the base for one-page local business demo sites.

## Rules

- Keep it static: no build step, no npm dependency required.
- Prefer editing `business.json` first, then fallback copy in `index.html`.
- Do not use Google Maps / third-party photos unless the client has rights.
- Do not invent exact prices, menus, awards, or opening hours. If unverified, write “à confirmer”.
- Preserve mobile-first layout, accessible contrast, skip link, visible focus states.
- Keep CTA links working: `tel:`, Google Maps directions, email, socials.
- For outreach demos, include a short disclaimer in README, not on the public page unless requested.

## Customization checklist

1. Update `business.json` with verified fields.
2. Update visible fallback content in `index.html` so no-JS mode is coherent.
3. Update `<title>`, meta description, canonical URL, `og:url`, `og:image`.
4. Update `social-card.svg` text and colors.
5. Run a local HTTP server and check `/`, `/styles.css`, `/script.js`, `/business.json`, `/social-card.svg` return 200.
6. Validate JSON files.
7. Commit and deploy to GitHub Pages or Vercel.

## Verification command

```bash
python3 -m http.server 4173
```

Then open http://127.0.0.1:4173/.
