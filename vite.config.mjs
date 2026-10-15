import { readFileSync } from 'node:fs';
import { cp } from 'node:fs/promises';
import { basename, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const partialsDirectory = resolve(root, 'partials');

function htmlPartials() {
  return {
    name: 'html-partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        const filename = basename(context.filename, '.html');
        const currentPage = filename === 'index' ? 'about' : filename;

        return html.replace(
          /^([ \t]*)<!--\s*include:([a-z][a-z0-9-]*)\s*-->[ \t]*$/gm,
          (_comment, indent, name) => {
            const partial = readFileSync(resolve(partialsDirectory, `${name}.html`), 'utf8');
            return partial
              .replace(/\sdata-page="([^"]+)"/g, (_attribute, page) =>
                page === currentPage ? ' aria-current="page"' : '',
              )
              .trimEnd()
              .split('\n')
              .map((line) => indent + line)
              .join('\n');
          },
        );

      },
    },
    configureServer(server) {
      server.watcher.add(partialsDirectory);
      server.watcher.on('all', (event, file) => {
        if (['add', 'change', 'unlink'].includes(event) && file.startsWith(partialsDirectory + sep)) {
          server.ws.send({ type: 'full-reload', path: '*' });
        }
      });
    },
    buildStart() {
      for (const name of ['header.html', 'footer.html', 'theme.html', 'favicons.html']) {
        this.addWatchFile(resolve(partialsDirectory, name));
      }
    },
  };
}

function copyStaticFiles() {
  let outputDirectory;
  return {
    name: 'copy-static-files',
    apply: 'build',
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir);
    },
    async writeBundle() {
      // Keep game URLs, image preview links, and downloads at their original paths.
      for (const name of ['games', 'img', 'licenses', 'LICENSE', 'favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'eric-richard-austin-resume.pdf']) {
        await cp(resolve(root, name), resolve(outputDirectory, name), { recursive: true });
      }
    },
  };
}

export default {
  appType: 'mpa',
  publicDir: false,
  plugins: [htmlPartials(), copyStaticFiles()],
  build: {
    outDir: 'dist',
    modulePreload: false,
    rolldownOptions: {
      input: {
        index: resolve(root, 'index.html'),
        portfolio: resolve(root, 'portfolio.html'),
      },
    },
  },
};
