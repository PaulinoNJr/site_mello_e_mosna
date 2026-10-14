import partners from './partners.json';

export default function PartnersSection() {
  return <section id="seguradoras" className="partners-panel" aria-labelledby="partners-title">
    <h2 id="partners-title" className="partners-title"><span>Nossas seguradoras parceiras</span></h2>
    <ul className="partners-logos">{partners.map(partner => <li key={partner.id} className={`partner-logo partner-${partner.id}`}>
      <img src={`/assets/seguradoras/${partner.image}`} width="180" height="48"
        alt={partner.name} loading="lazy" decoding="async" />
    </li>)}</ul>
  </section>;
}
