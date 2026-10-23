import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';
import {SITE_CONFIG} from './src/config/site.config';

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Fills %SITE_TITLE% / %SITE_DESCRIPTION% in index.html from src/config/site.config.ts.
const siteMetaPlugin = (): Plugin => ({
  name: 'site-meta',
  transformIndexHtml: (html) =>
    html
      .replaceAll('%SITE_TITLE%', escapeHtml(SITE_CONFIG.meta.title))
      .replaceAll('%SITE_DESCRIPTION%', escapeHtml(SITE_CONFIG.meta.description)),
});

// Adds the GA4 gtag.js snippet to production builds when SITE_CONFIG.analytics has an ID.
// Page views of the client-side router are tracked by GA4's history-change measurement.
const googleAnalyticsPlugin = (): Plugin => ({
  name: 'google-analytics',
  apply: 'build',
  transformIndexHtml: () => {
    const id = SITE_CONFIG.analytics.googleMeasurementId;
    if (!id) return [];
    if (!/^G-[A-Z0-9]+$/.test(id)) throw new Error(`Invalid GA4 measurement ID: ${id}`);
    return [
      {tag: 'script', attrs: {async: true, src: `https://www.googletagmanager.com/gtag/js?id=${id}`}, injectTo: 'head'},
      {
        tag: 'script',
        children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`,
        injectTo: 'head',
      },
    ];
  },
});

// main.tsx loads React and the app with import() so the Firestore fetch can start first.
// Preload those chunks from index.html so they download in parallel with the entry
// instead of only once it has run. Lazy routes (admin, login) are imported by App, not
// the entry, so they are not preloaded.
const preloadEntryImportsPlugin = (): Plugin => ({
  name: 'preload-entry-imports',
  apply: 'build',
  transformIndexHtml: (_html, {bundle, chunk}) => {
    if (!bundle || !chunk) return [];
    const files = new Set<string>();
    const add = (fileName: string) => {
      const dep = bundle[fileName];
      if (files.has(fileName) || dep?.type !== 'chunk') return;
      files.add(fileName);
      dep.imports.forEach(add);
    };
    chunk.dynamicImports.forEach(add);
    chunk.imports.forEach((fileName) => files.delete(fileName));
    return [...files].map((fileName) => ({
      tag: 'link',
      attrs: {rel: 'modulepreload', crossorigin: true, fetchpriority: 'low', href: `/${fileName}`},
      injectTo: 'head' as const,
    }));
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), siteMetaPlugin(), googleAnalyticsPlugin(), preloadEntryImportsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Keep original .tsx files out of DevTools → Sources in production:
      // no source maps, minified output.
      sourcemap: false,
      minify: true,
      cssMinify: true,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
