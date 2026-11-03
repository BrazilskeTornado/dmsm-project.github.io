# AuraPerform

AuraPerform is a static product presentation website for an intra-workout ionic drink mix enhanced with creatine and performance ingredients.

## Pages

- `index.html` — landing page
- `science.html` — formula and ingredient information
- `faq.html` — usage guide and FAQ
- `about.html` — brand story
- `shop.html` — responsive shop, product details, cart, and demo checkout
- `blog.html` — journal overview
- `blog-article.html` — dynamic article shell used by `/blog/[slug]`
- `admin.html` — browser-local content management panel

The site has no server-side database or payment processing. Product and journal edits are stored in browser `localStorage`, making the public pages update immediately without server infrastructure. The demo admin panel is available at `/admin` and uses the passcode `aura2026`.

Vercel clean routes are configured in `vercel.json`:

- `/shop`
- `/blog`
- `/blog/[slug]`
- `/admin`

## Local preview

Open `index.html` in a browser, or serve the folder with any static HTTP server. For example:

```bash
npx serve .
```

## Analytics

Google Analytics 4 and Microsoft Clarity are included in each HTML page:

- Google Analytics: `G-CK04YY3HGC`
- Microsoft Clarity: `z0qdnompiz`

Review analytics consent and privacy requirements before publishing the site publicly.

## GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Select the branch and the repository root (`/`).
4. Save and wait for GitHub Pages to publish the site.

`index.html` is the entry point.
