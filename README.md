# Altai Jet Boat — Premium Landing Page

A light, clean, premium landing page for **Altai Jet Boat** — jet boat adventure tours through the Altai Mountains of Russia.

Inspired by Apple, DJI, Patagonia, Land Rover, Red Bull Adventure, and Moggaro.

---

## 🚀 Running the Site

This is a **static HTML/CSS/JS** site — no build tools or dependencies required.

### Option 1 — Open directly in a browser

```bash
open index.html
# or double-click index.html in your file manager
```

### Option 2 — Local development server (recommended for best results)

```bash
# Python 3
python3 -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code: use the "Live Server" extension
```

Then open `http://localhost:8080` in your browser.

---

## 📁 File Structure

```
altai-landing/
├── index.html   # Main landing page (semantic HTML5)
├── styles.css   # Design tokens, layout, components, animations
├── script.js    # Scroll reveal, nav, parallax, video embeds, lazy load
└── README.md    # This file
```

---

## 🎨 Design System

All colors are defined as **CSS custom properties** at the top of `styles.css`:

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#ffffff` | Page background |
| `--color-bg-alt` | `#f7f7f7` | Section backgrounds |
| `--color-card` | `#ffffff` | Card surfaces |
| `--color-text` | `#111111` | Primary text |
| `--color-text-muted` | `rgba(17,17,17,.65)` | Secondary text |
| `--color-accent` | `#00d26a` | Brand accent (CTAs, highlights) |
| `--color-border` | `rgba(0,0,0,.08)` | Borders and dividers |

---

## 🖼️ Replacing Placeholder Media

The page ships with placeholder images from **Unsplash** so it renders immediately out of the box. Before going to production, replace every placeholder with your own assets.

Search `index.html` for `<!-- TODO:` comments — each marks a spot where real media should go.

### Hero Video

```html
<!-- In index.html, locate the <video class="hero__video"> element -->
<source src="assets/video/hero.webm" type="video/webm" />
<source src="assets/video/hero.mp4"  type="video/mp4"  />
```

- Create an `assets/video/` directory and place your compressed hero video there.
- Recommended: 1920×1080, 30 fps, ≤8 MB (use HandBrake or ffmpeg to compress).
- Provide both WebM (VP9) and MP4 (H.264) for cross-browser support.
- Also update the `<img class="hero__image-fallback">` `src` with a matching poster image.

### Section Images

All non-hero images use `data-src` for lazy loading. Replace the Unsplash URL with your own:

```html
<!-- Before -->
<img data-src="https://images.unsplash.com/..." />

<!-- After -->
<img data-src="assets/images/katun-river.jpg" />
```

Recommended image dimensions:
- Hero fallback / media banners: 2400×1012 px (WebP or JPEG ≤300 KB)
- Feature split images: 1200×1200 px
- Highlight cards: 800×600 px
- Route cards: 700×1050 px
- Gallery featured: 1200×600 px
- Gallery regular: 600×600 px

### YouTube / Video Embed

In the "Feel the Power" section, replace `VIDEO_ID` with your YouTube video ID:

```html
data-src="https://www.youtube.com/embed/YOUR_VIDEO_ID?rel=0&modestbranding=1"
```

Or swap the `<iframe>` for a self-hosted `<video>` element.

---

## ✉️ Contact & Booking Links

Search `index.html` for `TODO:` comments and update:

- `href="mailto:info@altaijetboat.ru"` → your real email
- `href="tel:+73852000000"` → your real phone
- Social media `href="#"` links → your real profiles
- Legal page links (Privacy Policy, Terms) → your real pages

---

## ♿ Accessibility

- Semantic HTML5 landmarks (`<header>`, `<main>`, `<footer>`, `<section>`, `<nav>`)
- All images have descriptive `alt` text
- ARIA labels on interactive elements
- `prefers-reduced-motion` respected — all animations disable gracefully
- Color contrast meets WCAG AA on both light and dark backgrounds

---

## 📱 Responsive Breakpoints

| Breakpoint | Min-width | Layout |
|---|---|---|
| Mobile | 0 | Single column, stacked sections |
| Tablet | 640 px | 2-column grid for some sections |
| Tablet+ | 768 px | Nav links visible, 2-col grids |
| Desktop | 1024 px | Full desktop layout, split features |
| Wide | 1280 px | Max-width container clamps |

---

## 🔧 Performance Notes

- All non-hero images use `loading="lazy"` or `data-src` lazy loading
- Hero image uses `fetchpriority="high"` for LCP optimization
- Google Fonts loaded with `display=swap`
- CSS animations respect `prefers-reduced-motion`
- No JavaScript frameworks — vanilla JS only (~9 KB unminified)
