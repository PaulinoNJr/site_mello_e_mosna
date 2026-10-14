import fs from 'node:fs/promises';
import path from 'node:path';

export async function buildReviews() {
  const template = await fs.readFile('google-sites/Avaliacoes.template.html', 'utf8');
  const bootstrap = (await fs.readFile('node_modules/bootstrap/dist/css/bootstrap.min.css', 'utf8')).replace(/\/\*# sourceMappingURL=.*?\*\//g, '');
  const html = template.replace('/* BOOTSTRAP_CSS */', bootstrap);
  await fs.writeFile('google-sites/Avaliacoes.html', html);
  await fs.writeFile('public/reviews-preview.html', html);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve('scripts/build-reviews.mjs')) await buildReviews();
