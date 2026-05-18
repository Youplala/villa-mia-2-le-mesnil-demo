# Static Local Business — Boilerplate

A tiny, zero-build static site for local-business demos (restaurant, bar, café,
salon, garage…). Plain HTML / CSS / JS — no Node, no npm, no toolchain.

- **Content-driven** — edit `business.json`, the page fills itself.
- **JS-optional** — the HTML ships with real fallback content, so the site still
  reads correctly if `business.json` 404s or JavaScript is disabled.
- **Mobile-first**, accessible, with automatic dark mode.
- **Deploys as-is** to GitHub Pages or Vercel.
- French defaults.

## Quick start

1. **Use this repo as a template** (GitHub → *Use this template*) or clone it.
2. Open `index.html` in a browser — it works straight off the file system,
   except `fetch("business.json")` is blocked by the `file://` protocol. Serve
   locally to see content injection:

   ```bash
   # Python 3
   python3 -m http.server 8000
   # or
   npx serve .
   ```

   Then visit <http://localhost:8000>.

3. Edit `business.json` and `index.html` to fit the client.

## File layout

```
index.html        Page structure + fallback content
styles.css        Design tokens + section styles
script.js         Loads business.json and fills [data-field] / [data-list]
business.json     Example data (restaurant/bar in Lyon)
social-card.svg   1200×630 generic OG image
vercel.json       Static config + caching headers
AGENTS.md         Instructions for AI agents customizing this template
```

## How the content pipeline works

The HTML contains good default content. `script.js` then looks up paths in
`business.json` and overrides matching elements. If anything is missing, the
default content stays.

Four attributes drive everything:

| Attribute                 | Effect                                                   |
| ------------------------- | -------------------------------------------------------- |
| `data-field="a.b.c"`      | `element.textContent = data.a.b.c`                       |
| `data-link="a.b.c"`       | `element.href = data.a.b.c`                              |
| `data-attr-<name>="path"` | `element.setAttribute(name, value)` (e.g. `data-attr-content` for `<meta>`) |
| `data-list="a.b"`         | Repeats a `<template>` child for each item in the array  |

Inside a `data-list` template, paths are resolved against the **current item**,
not the whole document. Lists can nest (see `menu.sections[].items`).

### Example

```html
<h1 data-field="name">Le Petit Bistrot</h1>

<ul data-list="hours.schedule">
  <template>
    <li><strong data-field="day"></strong> — <span data-field="hours"></span></li>
  </template>
  <li><strong>Lundi</strong> — Fermé</li>   <!-- fallback, removed when JSON loads -->
</ul>
```

## Rebranding in 60 seconds

1. **Colours & type** — top of `styles.css`, in the `:root` block. The
   `--color-accent` token drives all CTAs and links. `--font-display` is used
   for headings.
2. **Logo / favicon** — replace the emoji `🍷` in `index.html` (`<span class="brand__mark">`) and the inline `<link rel="icon">` SVG.
3. **Social card** — replace `social-card.svg` (or export a PNG of the same
   dimensions, 1200 × 630).
4. **Content** — edit `business.json`. Keep the same shape; missing keys just
   fall back to the HTML defaults.
5. **Fallback content** — also edit the visible defaults in `index.html` so the
   no-JS view matches the JSON.

## Deploy

### GitHub Pages

1. Push to GitHub.
2. *Settings → Pages → Build and deployment → Source: Deploy from a branch*.
3. Pick `main` / `/ (root)`. Save. Wait a minute.

### Vercel

1. *Add New… → Project* and import the repo.
2. Framework preset: **Other**. Build command: empty. Output directory: `./`.
3. Deploy. `vercel.json` handles caching and basic security headers.

### Any static host

`netlify`, `cloudflare pages`, `surge`, plain Nginx — all work. There is
nothing to build.

## Accessibility & SEO checklist

- Semantic landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`, `<address>`).
- Skip link, visible focus, reduced-motion media query.
- `lang="fr"` — change for other locales.
- Single `<h1>`, descriptive `<title>` and meta description (kept in sync via
  `data-attr-content`).
- `prefers-color-scheme: dark` honored automatically.
- Add real Open Graph URLs once the site has a domain.

## Customizing the data shape

The schema in `business.json` is just a convention — extend it as needed:

```json
{
  "gallery": [
    { "src": "img/dish-1.jpg", "alt": "Plat signature" }
  ]
}
```

Add a matching `data-list="gallery"` block in `index.html`:

```html
<ul class="gallery" data-list="gallery">
  <template>
    <li><img data-attr-src="src" data-attr-alt="alt" /></li>
  </template>
</ul>
```

## License

Code is MIT. The example content in `business.json` is fictional and free to
reuse. Replace `social-card.svg` with your own artwork before going live.
