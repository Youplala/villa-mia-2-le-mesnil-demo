# Static Local Business Site Boilerplate

Create a reusable plain HTML/CSS/JS boilerplate for local business demo sites.

Constraints:
- No Node/npm required.
- GitHub Pages and Vercel ready.
- Content-driven: use a simple `business.json` file and a small `script.js` that fills text/links where reasonable.
- The template should still render well if JS fails: include good fallback content in HTML.
- No copyrighted assets.
- Mobile-first.
- French defaults.

Required files:
- index.html with placeholders/fallback content
- styles.css with reusable design tokens and sections
- script.js that loads `business.json` and populates `[data-field]` / links
- business.json example for a restaurant/bar
- social-card.svg generic placeholder
- vercel.json
- README.md explaining how to duplicate/fork and customize
- AGENTS.md with instructions for Hermes/Claude agents modifying a new demo
