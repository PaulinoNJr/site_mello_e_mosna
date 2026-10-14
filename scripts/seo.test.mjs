import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { buildSeo, normalizeSiteUrl } from './seo.mjs';

const content = JSON.parse(await fs.readFile('src/seo-content.json', 'utf8'));
const services = JSON.parse(await fs.readFile('src/data.json', 'utf8')).services;
const contact = { email: 'atendimento@mellomosnaseguros.com.br', instagram: 'https://www.instagram.com/mellomosnaconsultoria/', facebook: 'https://www.facebook.com/profile.php?id=61593576255730' };
const options = config => ({ config, content, contact, services });

test('official HTTPS domain produces consistent canonical, sitemap, social and schema URLs', () => {
  const result = buildSeo(options({ siteUrl: 'https://seguros.example', indexable: true }));
  assert.equal(result.origin, 'https://seguros.example/');
  assert.match(result.head, /rel="canonical" href="https:\/\/seguros.example\/"/);
  assert.match(result.head, /index, follow, max-image-preview:large/);
  assert.match(result.sitemap, /<loc>https:\/\/seguros.example\/<\/loc>/);
  assert.equal((result.sitemap.match(/<loc>/g) || []).length, 1);
  assert.match(result.robotsTxt, /Sitemap: https:\/\/seguros.example\/sitemap.xml/);
  const graph = JSON.parse(result.head.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
  assert.deepEqual(graph.map(item => item['@type']), ['Organization', 'WebSite', 'WebPage']);
  assert.equal(graph[0].hasOfferCatalog.itemListElement.length, 17);
  assert.equal(graph[0].address, undefined);
  assert.equal(graph[0].aggregateRating, undefined);
  assert.equal(graph[0].review, undefined);
});
test('unconfigured domain is explicit and never emits invented canonical or sitemap', () => {
  const result = buildSeo(options({ siteUrl: '', indexable: true }));
  assert.equal(result.indexable, false);
  assert.equal(result.sitemap, null);
  assert.match(result.head, /noindex, follow/);
  assert.doesNotMatch(result.head, /canonical|og:url|example\.com/);
  assert.doesNotMatch(result.robotsTxt, /Disallow: \/|Sitemap:/);
});
test('staging retains its real canonical but stays noindex and out of sitemap', () => {
  const result = buildSeo(options({ siteUrl: 'https://staging.example', indexable: false }));
  assert.match(result.head, /noindex, follow/);
  assert.equal(result.sitemap, null);
});
test('invalid domain configuration fails instead of silently publishing bad URLs', () => {
  for (const value of ['http://seguros.example', 'https://user:pass@seguros.example', 'https://seguros.example/sub', 'https://seguros.example/?x=1', 'https://seguros.example/#topo', 'https://localhost']) {
    assert.throws(() => normalizeSiteUrl(value));
  }
});
test('metadata escapes attributes and JSON-LD cannot terminate its script tag', () => {
  const result = buildSeo({ ...options({ siteUrl: '', indexable: false }), content: { ...content, title: '"><script>alert(1)</script>', description: '</script><script>alert(1)</script>' } });
  assert.match(result.head, /&quot;&gt;&lt;script&gt;/);
  assert.match(result.head, /\\u003c\/script>/);
  assert.equal((result.head.match(/<script/g) || []).length, 1);
});
