import config from './reviews.config.json';
import { useEffect, useRef, useState } from 'react';

function reviewUrl() {
  if (!config.webAppUrl) return '/reviews-preview.html';
  const url = new URL(config.webAppUrl);
  if (url.origin !== 'https://script.google.com' || !/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname)) {
    throw new Error('Configure a URL /exec da implantação do Google Apps Script.');
  }
  return url.href;
}

export default function ReviewsSection() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>();
  useEffect(() => {
    const resize = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.data?.type !== 'mello-mosna-reviews-height') return;
      // Loading the embedded form must not shift the Contact anchor below it.
      // Keep its reserved space while that anchor is active; the frame can scroll.
      if (window.location.hash === '#contato') return;
      const value = event.data.height;
      if (typeof value === 'number' && Number.isFinite(value) && value >= 200 && value <= 25000) setHeight(Math.ceil(value));
    };
    window.addEventListener('message', resize);
    return () => window.removeEventListener('message', resize);
  }, []);
  return <section id="depoimentos" className="section tinted" aria-labelledby="reviews-title"><div className="container">
    <div className="section-heading"><span className="eyebrow">Avaliações</span>
      <h2 id="reviews-title">Avaliações dos nossos clientes</h2><div className="gold heading-rule" />
      <p>Compartilhe sua nota e seu comentário. As avaliações são publicadas após aprovação da nossa equipe.</p>
    </div>
    <iframe ref={frame} style={height ? { height } : undefined} className="reviews-frame" src={reviewUrl()} title="Formulário de avaliação e avaliações aprovadas"
      loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
  </div></section>;
}
