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
There is no browser JavaScript dependency for the header or footer.

In the shared header, `data-page="about"` and `data-page="portfolio"` identify the
navigation links. Vite sets `aria-current="page"` on the matching link based on
the page filename, treating `index.html` as About.

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
The main pages use CSS Grid and a locally hosted Inter font with
`font-display: swap`. The font and SVG icons work without external requests.
Ninja Slaughterhaus still loads jQuery for its game code. Inter’s font license is
preserved in `licenses/inter.txt`.
Icons are inline SVGs from Bootstrap Icons; their license is preserved in
`licenses/bootstrap-icons.txt`.

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
