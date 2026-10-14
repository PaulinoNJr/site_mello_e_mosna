const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const serialize = value => JSON.stringify(value).replace(/</g, '\\u003c');

export function normalizeSiteUrl(value) {
  if (!value?.trim()) return '';
  const url = new URL(value.trim());
  if (url.protocol !== 'https:' || url.username || url.password || url.port ||
      url.pathname !== '/' || url.search || url.hash ||
      ['localhost', '127.0.0.1'].includes(url.hostname)) {
    throw new Error('siteUrl deve ser a origem HTTPS do domínio oficial, sem caminho, porta, parâmetros ou credenciais.');
  }
  return url.origin + '/';
}

export function buildSeo({ config, content, contact, services }) {
  const origin = normalizeSiteUrl(config.siteUrl);
  const indexable = Boolean(origin && config.indexable === true);
  const robots = indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow';
  const absolute = path => new URL(path, origin).href;
  const graph = [{
    '@type': 'Organization',
    ...(origin ? { '@id': absolute('#organizacao'), url: origin,
      logo: { '@type': 'ImageObject', url: absolute('assets/logo-mello-mosna-completo.png'), width: 1774, height: 887 } } : {}),
    name: 'Mello & Mosna Corretora de Seguros',
    description: content.description,
    telephone: '+5519983422822',
    email: contact.email,
    sameAs: [contact.instagram, contact.facebook],
    areaServed: [{ '@type': 'Country', name: 'Brasil' }, ...['Hortolândia', 'Sumaré', 'Campinas'].map(name => ({ '@type': 'City', name }))],
    contactPoint: { '@type': 'ContactPoint', telephone: '+5519983422822', email: contact.email,
      contactType: 'Atendimento e cotações', availableLanguage: 'pt-BR', areaServed: 'BR' },
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Modalidades de seguros e soluções',
      itemListElement: services.map(service => ({ '@type': 'OfferCatalog', name: service.title })) },
  }];
  if (origin) graph.push({ '@type': 'WebSite', '@id': absolute('#website'), url: origin,
    name: 'Mello & Mosna Corretora de Seguros', inLanguage: 'pt-BR', publisher: { '@id': absolute('#organizacao') } },
    { '@type': 'WebPage', '@id': absolute('#webpage'), url: origin, name: content.title,
      description: content.description, inLanguage: 'pt-BR', isPartOf: { '@id': absolute('#website') },
      about: { '@id': absolute('#organizacao') } });
  const meta = (name, value, attribute = 'name') => `<meta ${attribute}="${escapeHtml(name)}" content="${escapeHtml(value)}" />`;
  const head = [
    `<title>${escapeHtml(content.title)}</title>`,
    meta('description', content.description), meta('robots', robots),
    meta('og:type', 'website', 'property'), meta('og:locale', 'pt_BR', 'property'),
    meta('og:site_name', 'Mello & Mosna Corretora de Seguros', 'property'),
    meta('og:title', content.title, 'property'), meta('og:description', content.description, 'property'),
    meta('twitter:card', 'summary_large_image'), meta('twitter:title', content.title), meta('twitter:description', content.description),
    ...(origin ? [`<link rel="canonical" href="${escapeHtml(origin)}" />`, meta('og:url', origin, 'property'),
      meta('og:image', absolute('assets/compartilhamento.png'), 'property'),
      meta('og:image:type', 'image/png', 'property'),
      meta('og:image:width', '1200', 'property'), meta('og:image:height', '630', 'property'),
      meta('og:image:alt', 'Mello & Mosna — Corretora de Seguros', 'property'),
      meta('twitter:image', absolute('assets/compartilhamento.png')),
      meta('twitter:image:alt', 'Mello & Mosna — Corretora de Seguros')] : []),
    ...(config.googleSiteVerification ? [meta('google-site-verification', config.googleSiteVerification)] : []),
    `<script type="application/ld+json">${serialize({ '@context': 'https://schema.org', '@graph': graph })}</script>`,
  ].join('\n    ');
  const sitemap = origin && indexable ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escapeHtml(origin)}</loc></url></urlset>\n` : null;
  const robotsTxt = 'User-agent: *\nAllow: /\n' + (sitemap ? `\nSitemap: ${origin}sitemap.xml\n` : '');
  return { head, sitemap, robotsTxt, indexable, origin };
}
