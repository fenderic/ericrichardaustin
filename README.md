# ericrichardaustin

My personal site: [www.ericrichardaustin.com](https://www.ericrichardaustin.com/).

Plain HTML, CSS, JavaScript, and images, deployed from this repository through
Cloudflare Pages. Vite assembles shared HTML partials and prepares the static
production files.

## Run locally

You need Node.js 20.19+ on the 20.x release line, or Node.js 22.12+, and npm.
From the repository directory, install dependencies once and start the preview:

```sh
npm ci
npm run dev
```

Open **[http://127.0.0.1:3000/](http://127.0.0.1:3000/)**. Keep the terminal running
while you work; press **Ctrl+C** to stop. `npm start` starts the same server.
If port 3000 is occupied, use `npm run dev -- --port 3001`.

HTML, CSS, and shared partial changes update automatically. Refresh after editing
game scripts.
Vite uses multi-page mode so missing pages return a 404.

To build and test the production version:

```sh
npm run build
npm run preview
```

Open [http://127.0.0.1:4173/](http://127.0.0.1:4173/). The build writes the complete
site to `dist/`; this generated directory is ignored by Git.
Run `npm run build` again after edits to refresh the production preview.

## Shared header and footer

Edit `partials/header.html` or `partials/footer.html` once to update both main
pages. `index.html` and `portfolio.html` insert them with:

```html
<!-- include:header -->
<!-- include:footer -->
```

Put each include comment on its own line. Vite expands the partials during local
development and production builds, so the browser receives complete HTML.
Navigation and social links are rendered as complete HTML; the theme toggle
uses the small shared script in `partials/theme.html`.

In the shared header, `data-page="about"` and `data-page="portfolio"` identify the
navigation links. Vite sets `aria-current="page"` on the matching link based on
the page filename, treating `index.html` as About.

## Light and dark themes

About and Portfolio have a sun/moon button in the bottom-right corner, both
locally and in production. Light mode uses **Photo / Stone**; dark mode uses
**Photo / Dusk**. Edit their colour variables in `css/themes.css`.

The first visit follows the browser's system preference. Clicking the button
saves a choice in browser storage and keeps it across navigation and reloads.
The shared script in `partials/theme.html` applies it before the stylesheet loads
to avoid flashing the other theme. The button's icon and accessible label describe
the mode it will switch to. Without JavaScript, the pages display the light theme.
Games keep their own styling.

## Favicons

The favicon combines two overlapping boulders with a bold SVG-path “E”, using
the site colours. `favicon.svg` adapts to the browser's light/dark preference and
can be used as the source artwork in a favicon generator.

Both main pages include `partials/favicons.html`. The theme script selects
`img/favicon-light.svg` or `img/favicon-dark.svg` so the browser-tab icon follows
the site's sun/moon toggle, including a saved preference.

`favicon.ico` contains 16px, 32px, and 48px fallbacks; `apple-touch-icon.png` is a
180px light version with an opaque background for home-screen shortcuts. When
changing the design, keep the three SVGs' paths consistent and regenerate these
raster fallbacks.

## Pages and files

| Page | Local address |
| --- | --- |
| About | http://127.0.0.1:3000/ |
| Portfolio | http://127.0.0.1:3000/portfolio.html |
| Ninja Slaughterhaus | http://127.0.0.1:3000/games/ninja |
| Temperature | http://127.0.0.1:3000/games/temperature.html |
| Team Test | http://127.0.0.1:3000/games/team-test.html |

The main pages share `css/style.css`, organized into site-wide, About, and
Portfolio sections. Game styles stay in each game's own CSS folder.

Below 768px, page shells have a 33rem width cap and 1.5rem minimum side gutters.
The interests grid uses two or three columns according to its available width.
Navigation and social links adapt to narrower content when text is enlarged.

The portrait backdrop uses two decorative inline SVG boulders in `index.html`.
Their colour follows `--color-portrait` in the selected theme. The photo and both
shapes share a centred grid cell, with a circular photo crop. The front boulder
rotates clockwise over 160 seconds; the back rotates counterclockwise over 200
seconds. The About section of `css/style.css` controls their motion, and
reduced-motion preferences keep both shapes still. The animation uses CSS
transforms and needs no JavaScript.

The portrait uses pre-cropped 320px, 512px, and 640px square images in AVIF, with WebP
fallbacks. The browser chooses a size using `srcset` and `sizes`; the image stays
high priority because it is visible on the first screen. `img/rockhouse.jpg` is
kept as the original for future edits. To regenerate the crops in an image tool,
use a 720px square starting at x=216, y=0 in the original, then export all three sizes.
These exports are checked into Git, so image tools are not needed to run or build
the site.

Game pages are in `games/`. Each game's files live together in
`games/temperature/`, `games/ninja/`, or `games/team-test/`:

```text
TODO.md
css/style.css
js/game.js
images/
audio/          # Temperature only
```

Use lowercase, hyphenated asset names and root-relative URLs such as
`/games/ninja/images/ninja.png`. The résumé is
`eric-richard-austin-resume.pdf` at the repository root; replace it there when
updating it.

## Testing and assets

Check affected pages, game interactions, and desktop/mobile layouts in your
browser. Use the Console for JavaScript errors and Network for missing files.
For the main pages, also check 320px layouts, 200% text enlargement, keyboard
focus, and both colour themes. Font sizes use `rem`; body line height is 1.5.
The main pages use CSS Grid and a locally hosted Inter font with
`font-display: swap`. The font and SVG icons work without external requests.
Ninja Slaughterhaus still loads jQuery for its game code. Inter’s font license is
preserved in `licenses/inter.txt`.
Social and trophy icons are inline SVGs from Bootstrap Icons; their license is
preserved in `licenses/bootstrap-icons.txt`. The About and theme icons use small
inline SVG paths and follow the active theme's colours.

Keep site images, game audio, PDFs, and other source assets in Git so local
previews and deployments have the same files. `.gitignore` covers dependencies
and machine files. Large media libraries or videos can use separate storage.

## Deployment

Set these Cloudflare Pages build settings **before deploying these changes**:

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Repository root (leave blank) |

The repository's `.node-version` selects Node.js 22 for the Cloudflare build.
If the project already has a `NODE_VERSION` environment variable, use a supported
version (22.12+ or 20.19+ on the 20.x release line).

Publish `dist/` rather than the source repository: the source pages contain
include comments that Vite must expand. Vite bundles the main stylesheet, font,
and referenced images. The build also copies games, original image previews,
the résumé, favicon, and license notices to their existing URLs.

Deployment continues through the existing GitHub integration; saving files
locally does not publish them.

See [Cloudflare build settings](https://developers.cloudflare.com/pages/configuration/build-configuration/)
and [Node version selection](https://developers.cloudflare.com/pages/configuration/build-image/).
Cloudflare Pages serves HTML files at extensionless URLs, so `games/ninja.html`
is available at `/games/ninja`.
