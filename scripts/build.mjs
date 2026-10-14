import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { build } from 'vite';
import { buildSeo } from './seo.mjs';
import { buildReviews } from './build-reviews.mjs';

const readJson = async name => JSON.parse(await fs.readFile(name, 'utf8'));
const config = await readJson('site.config.json');
const content = await readJson('src/seo-content.json');
const data = await readJson('src/data.json');
await buildReviews();
// Render the same application and configuration used by the browser, without a browser dependency.
await build({ build: { emptyOutDir: true } });
await build({ build: { ssr: 'src/prerender.tsx', outDir: '.prerender', emptyOutDir: true } });
const { render, contact: renderedContact } = await import(pathToFileURL(path.resolve('.prerender/prerender.js')).href + `?build=${Date.now()}`);
const seo = buildSeo({ config, content, contact: renderedContact, services: data.services });
let html = await fs.readFile('dist/index.html', 'utf8');
html = html.replace(/<!--seo-start-->[\s\S]*?<!--seo-end-->/, seo.head)
  .replace('<div id="root"></div>', `<div id="root">${render()}</div>`);
await fs.writeFile('dist/index.html', html);
await fs.writeFile('dist/robots.txt', seo.robotsTxt);
if (seo.sitemap) await fs.writeFile('dist/sitemap.xml', seo.sitemap);
await fs.writeFile('dist/404.html', '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Página não encontrada | Mello &amp; Mosna</title></head><body><h1>Página não encontrada</h1><p>O endereço solicitado não existe.</p><a href="/">Voltar ao site da Mello &amp; Mosna</a></body></html>');
await fs.writeFile('dist/seo-status.json', JSON.stringify({ indexable: seo.indexable, siteUrl: seo.origin,
  htmlPrerendered: true, sitemap: Boolean(seo.sitemap), pending: seo.origin ? [] : ['Configurar siteUrl com o domínio oficial e gerar novo build.'] }, null, 2));
console.log(seo.indexable ? `SEO: HTML pré-renderizado e indexação habilitada para ${seo.origin}` : 'SEO: HTML pré-renderizado. Domínio ausente ou indexação desativada: noindex; sitemap não publicado. Configure site.config.json.');
