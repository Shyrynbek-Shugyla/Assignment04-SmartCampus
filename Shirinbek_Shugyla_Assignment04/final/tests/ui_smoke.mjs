// UI check: bundles src/App.tsx with esbuild and renders it to HTML with react-dom/server.
// Run: npm run test:ui   (requires `npm install` first; uses esbuild that ships with Vite)
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'package.json'));
const out = path.join(root, '.ui-smoke-bundle.cjs');
const stubIcons = {
  name: 'icons',
  setup(b) {
    // If lucide-react is not installed (offline sandbox), fall back to a stub; real installs use the real package.
    b.onResolve({ filter: /^lucide-react$/ }, (a) => {
      try { return { path: require.resolve('lucide-react', { paths: [root] }) }; }
      catch { return { path: 'lucide-stub', namespace: 'stub' }; }
    });
    b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({
      contents: ['MapPin','Timer','Clock','SearchX','Users','CalendarCheck','CalendarX'].map((n) => `export const ${n} = () => null;`).join('\n'), loader: 'js',
    }));
  },
};
await build({
  entryPoints: [path.join(root, 'src/App.tsx')], bundle: true, platform: 'node', format: 'cjs',
  outfile: out, jsx: 'automatic', alias: { '@': path.join(root, 'src') }, plugins: [stubIcons], logLevel: 'silent', external: ['react', 'react-dom', 'react/jsx-runtime'],
  nodePaths: [path.join(root, 'node_modules')],
});
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const App = require(out).default;
const html = renderToStaticMarkup(React.createElement(App));
fs.rmSync(out);

const options = (html.match(/<option /g) || []).length;
assert.equal(options, 5, `expected 5 room options, got ${options}`);
for (const text of ['Campus Room Availability', 'Check Availability', 'Attendees (optional)', 'Projector', 'Video conferencing', 'R5 — Lecture Hall']) {
  assert.ok(html.includes(text), `missing "${text}"`);
}
assert.ok(!html.includes('data-testid="result-card"'), 'no result before Check');
assert.ok(!html.includes('data-testid="empty-state"'), 'no empty state by default');
console.log('UI smoke check passed: 5 room options, filters and form rendered, no result/empty state initially.');
