import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Bike, Briefcase, Building, Building2, Car, Check, CircleCheck,
  Clock, Coins, Facebook, FileCheck, Globe, Headphones, Heart, HeartPulse, House,
  Instagram, KeyRound, Laptop, Mail, MapPin, Menu, MessageCircle, PawPrint, Phone,
  PiggyBank, Plane, Send, Shield, ShieldCheck, Smartphone, Star, Sun, Zap,
  type LucideIcon } from 'lucide-react';
import data from './data.json';
import seoContent from './seo-content.json';
import { contact, navigation } from './config';
import { submitQuote, type QuoteService } from './services/quote';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Spinner from 'react-bootstrap/Spinner';
import './bootstrap.scss';
import './styles.css';

const icons: Record<string, LucideIcon> = { Bike, Briefcase, Building, Building2, Car,
  Clock, Coins, FileCheck, Headphones, Heart, HeartPulse, House, KeyRound, Laptop,
  MapPin, PawPrint, PiggyBank, Plane, Smartphone, Sun, Zap };

function Brand() {
  return <a className="brand" href="#topo" aria-label="Mello & Mosna — início">
    <span className="brand-symbol gold"><Shield size={20} strokeWidth={2} /></span>
    <span><strong>Mello & Mosna</strong><small>Corretora de Seguros</small></span>
  </a>;
}

function SocialLinks({ whatsapp = true, onNavigate }: { whatsapp?: boolean; onNavigate?: () => void }) {
  const links = [
    ...(whatsapp ? [{ name: 'WhatsApp', href: contact.whatsapp, Icon: MessageCircle }] : []),
    { name: 'Instagram', href: contact.instagram, Icon: Instagram },
    { name: 'Facebook', href: contact.facebook, Icon: Facebook },
  ];
  return <div className="social-links">{links.map(({ name, href, Icon }) =>
    <a key={name} className={`social ${name === 'WhatsApp' ? 'gold' : ''}`} href={href}
      target="_blank" rel="noopener noreferrer" aria-label={name} onClick={onNavigate}>
      <Icon size={16} strokeWidth={1.5} />
    </a>)}</div>;
}

function QuoteLink({ children, className = '', onClick }: { children?: React.ReactNode; className?: string; onClick?: () => void }) {
  return <Button className={`button gold ${className}`} href={contact.whatsapp} target="_blank"
    rel="noopener noreferrer" onClick={onClick}>{children ?? <><MessageCircle size={16} />Faça sua cotação</>}</Button>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('#topo');
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const scroll = () => {
      setScrolled(window.scrollY > 24);
      const current = ['#topo', ...navigation.map(([, href]) => href)].reverse()
        .find(href => (document.querySelector(href)?.getBoundingClientRect().top ?? Infinity) <= 120);
      if (current) setActive(current);
    };
    scroll();
    const resize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('scroll', scroll); window.removeEventListener('resize', resize); };
  }, []);
  return <Navbar as="header" className={`header ${scrolled || open ? 'solid' : ''}`}>
    <Container className="header-row"><Brand />
      <Nav as="nav" className="desktop-nav" aria-label="Navegação principal">{navigation.map(([label, href]) => <Nav.Link key={href} href={href} active={active === href} aria-current={active === href ? 'location' : undefined}>{label}</Nav.Link>)}</Nav>
      <div className="header-actions"><SocialLinks /><QuoteLink /></div>
      <Button ref={toggle} variant="outline-light" className="menu-toggle" type="button" aria-label="Abrir menu"
        aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}><Menu size={24} /></Button>
    </Container>
    <Offcanvas show={open} onHide={() => setOpen(false)} placement="end" className="mobile-drawer" aria-labelledby="mobile-menu-title" restoreFocus>
      <Offcanvas.Header closeButton closeLabel="Fechar menu" closeVariant="white"><Offcanvas.Title as="h2" id="mobile-menu-title">Explore o site</Offcanvas.Title></Offcanvas.Header>
      <Offcanvas.Body><Nav as="nav" className="mobile-nav" id="mobile-menu" aria-label="Navegação móvel">
        {navigation.map(([label, href]) => <Nav.Link key={href} href={href} active={active === href} aria-current={active === href ? 'location' : undefined} onClick={() => setOpen(false)}>{label}<ArrowRight size={16} aria-hidden="true" /></Nav.Link>)}
        <QuoteLink onClick={() => setOpen(false)} /><SocialLinks onNavigate={() => setOpen(false)} />
      </Nav><p className="drawer-caption">Hortolândia, Sumaré e Campinas.<br />Atendimento em todo o Brasil.</p></Offcanvas.Body>
    </Offcanvas>
  </Navbar>;
}

function Hero() {
  return <section id="topo" className="hero" aria-labelledby="hero-title">
    <div className="hero-container">
      <Badge bg="" className="national-badge"><span />Atendimento todo Brasil</Badge>
      <h1 id="hero-title">{seoContent.heading}</h1>
      <p>{seoContent.intro}</p>
      <div className="hero-buttons"><QuoteLink>Faça sua cotação<ArrowRight size={16} /></QuoteLink>
        <Button variant="outline-light" className="button outline" href="#servicos">Conhecer coberturas</Button></div>
      <SocialLinks />
      <div className="trust-indicators">{['15+ anos de experiência', 'Principais seguradoras', 'Atendimento personalizado'].map((text, index) =>
        <React.Fragment key={text}>{index > 0 && <span className="trust-divider" aria-hidden="true" />}<div><ShieldCheck size={20} strokeWidth={1.5} /><span>{text}</span></div></React.Fragment>)}</div>
    </div>
  </section>;
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span>
    <h2>{title}</h2><div className="gold heading-rule" />{description && <p>{description}</p>}</div>;
}

function ServicesSection() {
  return <section id="servicos" className="section"><div className="container">
    <SectionHeading eyebrow="Coberturas" title="Seguros para cada necessidade"
      description="Trabalhamos com as principais e melhores seguradoras do mercado para oferecer a cobertura ideal ao seu perfil." />
    <div className="services-grid">{data.services.map(({ icon, title, description }) => {
      const Icon = icons[icon];
      return <Card as="article" className="service-card" key={title}><Card.Body><div className="service-icon"><Icon size={24} strokeWidth={1.5} /></div>
        <Card.Title as="h3">{title}</Card.Title><Card.Text>{description}</Card.Text></Card.Body></Card>;
    })}</div>
  </div></section>;
}

function DifferentialsSection() {
  return <section id="diferenciais" className="section tinted"><div className="container">
    <SectionHeading eyebrow="Por que Mello & Mosna" title="Mais do que uma apólice"
      description="Não vendemos seguros — desenhamos tranquilidade. Cada cliente é único, e nossa missão é garantir que a cobertura acompanhe cada mudança na sua vida e no seu negócio." />
    <div className="differentials-grid">{data.differentials.map(({ icon, title, description }) => {
      const Icon = icons[icon];
      return <Card as="article" className="differential-card" key={title}><Card.Body><div className="tile-icon gold"><Icon size={24} strokeWidth={1.5} /></div>
        <Card.Title as="h3">{title}</Card.Title><Card.Text>{description}</Card.Text></Card.Body></Card>;
    })}</div>
  </div></section>;
}

function InsurersNote() {
  return <div className="insurers-note"><Shield size={20} strokeWidth={1.5} /><span>Trabalhamos com as principais e melhores seguradoras do mercado</span></div>;
}

function AboutSection() {
  return <section id="sobre" className="section"><div className="container about-grid">
    <div className="office-photo"><picture><source type="image/webp" srcSet="/assets/escritorio-600.webp 600w, /assets/escritorio-900.webp 900w" sizes="(min-width: 1024px) 568px, calc(100vw - 48px)" />
      <img src="/assets/escritorio.jpg" width="900" height="600" alt="Ambiente de escritório — imagem ilustrativa" loading="lazy" decoding="async" /></picture><div className="photo-shade" /></div>
    <div className="about-copy"><span className="eyebrow">Sobre a Mello & Mosna</span>
      <h2>Relações duradouras baseadas em confiança</h2><div className="gold heading-rule" />
      <p className="lead">A Mello & Mosna nasceu da convicção de que proteger patrimônios e vidas exige mais do que assinar apólices — exige entender pessoas. Nossa equipe combina conhecimento técnico profundo com um atendimento humano e próximo.</p>
      <p>Atuamos como seus aliados na relação com a seguradora: negociamos melhores condições, acompanhamos sinistros e garantimos que você receba exatamente o que a apólice promete.</p>
      <ul className="benefits">{data.benefits.map(text => <li key={text}><span className="gold"><Check size={14} strokeWidth={2.5} /></span>{text}</li>)}</ul>
      <InsurersNote />
      <div className="local-service"><h3>Atendimento em Hortolândia, Sumaré e Campinas</h3>
        <p>Converse com a Mello &amp; Mosna sobre seguros pessoais, familiares e empresariais. O atendimento digital conecta você à corretora na região e em todo o Brasil.</p>
        <a href="#contato">Veja os canais de atendimento <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </div></section>;
}

function TestimonialsSection() {
  return <section id="depoimentos" className="section tinted"><div className="container">
    <SectionHeading eyebrow="Depoimentos" title="Quem confia, recomenda" />
    <div className="testimonials-grid">{data.testimonials.map(item => <Card as="article" className="testimonial-card" key={item.author}>
      <div className="stars" role="img" aria-label="5 de 5 estrelas">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={16} fill="currentColor" aria-hidden="true" />)}</div>
      <blockquote>"{item.quote}"</blockquote>
      <div className="testimonial-author"><span className="avatar gold">{item.initial}</span><div><strong>{item.author}</strong><span>{item.role}</span></div></div>
    </Card>)}</div>
  </div></section>;
}

export function QuoteForm({ service = submitQuote }: { service?: QuoteService }) {
  const [state, setState] = useState<'idle' | 'submitting' | 'complete'>('idle');
  const [error, setError] = useState('');
  const result = useRef<HTMLDivElement>(null);
  useEffect(() => { if (state === 'complete') result.current?.focus(); }, [state]);
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setError(''); setState('submitting');
    try {
      await service({ nome: String(values.get('nome')), email: String(values.get('email')),
        telefone: String(values.get('telefone')), tipo: String(values.get('tipo')), mensagem: String(values.get('mensagem')) });
      setState('complete');
    } catch {
      setError('Não foi possível concluir a demonstração. Tente novamente ou fale conosco pelo WhatsApp.'); setState('idle');
    }
  }
  return <Card className="quote-panel">{state === 'complete' ?
    <div className="demo-result" tabIndex={-1} ref={result} role="status"><span className="gold"><CircleCheck size={32} /></span>
      <h3>Demonstração concluída</h3><p>Sua solicitação não foi enviada. Este formulário é uma demonstração local e não armazena os dados informados.</p>
      <QuoteLink>Falar pelo WhatsApp<ArrowRight size={16} /></QuoteLink>
      <Button variant="link" type="button" className="reset-form" onClick={() => setState('idle')}>Voltar ao formulário</Button>
    </div> : <Form onSubmit={handleSubmit} aria-describedby="demo-notice" aria-busy={state === 'submitting'}>
      <div className="form-heading"><span className="eyebrow">Conte com a nossa equipe</span><h3>O primeiro passo para sua proteção</h3><p>Escolha a modalidade e conheça os canais de atendimento.</p></div>
      <Form.Group className="field" controlId="nome"><Form.Label>Nome completo</Form.Label><Form.Control name="nome" type="text" autoComplete="name" placeholder="Seu nome" required /></Form.Group>
      <div className="form-row"><Form.Group className="field" controlId="email"><Form.Label>E-mail</Form.Label><Form.Control name="email" type="email" autoComplete="email" placeholder="seu@email.com" required /></Form.Group>
        <Form.Group className="field" controlId="telefone"><Form.Label>Telefone</Form.Label><Form.Control name="telefone" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" required /></Form.Group></div>
      <Form.Group className="field" controlId="tipo"><Form.Label>Tipo de seguro</Form.Label><Form.Select name="tipo" defaultValue="" required>
        <option value="" disabled>Selecione uma opção</option>{[...data.services.map(s => s.title), 'Outro'].map(title => <option value={title} key={title}>{title}</option>)}
      </Form.Select></Form.Group>
      <Form.Group className="field" controlId="mensagem"><Form.Label>Mensagem (opcional)</Form.Label><Form.Control as="textarea" name="mensagem" rows={4} placeholder="Conte-nos sobre o que deseja proteger..." /></Form.Group>
      <Alert variant="warning" className="demo-notice" id="demo-notice" role="note">Modo demonstrativo: a solicitação não será enviada. Para atendimento, fale pelo WhatsApp.</Alert>
      {error && <Alert variant="danger" className="form-error" role="alert">{error}</Alert>}
      <Button className="button gold submit-button" type="submit" disabled={state === 'submitting'}>{state === 'submitting' ? <><Spinner animation="border" size="sm" aria-hidden="true" />Validando demonstração...</> : <>Enviar solicitação<Send size={16} /></>}</Button>
    </Form>}</Card>;
}

function ContactSection() {
  return <section id="contato" className="section"><div className="container contact-grid">
    <div><span className="eyebrow">Contato</span><h2>Faça sua cotação</h2><div className="gold heading-rule" />
      <p className="lead contact-intro">Solicite sua cotação pelo WhatsApp ou entre em contato por e-mail. O formulário abaixo é demonstrativo; para iniciar o atendimento, utilize um dos nossos canais.</p>
      <div className="contact-details">
        <div><span className="contact-icon"><MessageCircle size={20} strokeWidth={1.5} /></span><div><small>WhatsApp</small><a href={contact.whatsapp} target="_blank" rel="noopener noreferrer">{contact.whatsappPhone}</a></div></div>
        <div><span className="contact-icon"><Phone size={20} strokeWidth={1.5} /></span><div><small>Telefone</small><a href={contact.tel}>{contact.phone}</a></div></div>
        <div><span className="contact-icon"><Mail size={20} strokeWidth={1.5} /></span><div><small>E-mail</small><a href={contact.mailto}>{contact.email}</a></div></div>
        <div><span className="contact-icon"><MapPin size={20} strokeWidth={1.5} /></span><div><small>Atendimento</small><strong>{contact.locations}</strong></div></div>
      </div>
      <div className="contact-direct"><QuoteLink>Conversar pelo WhatsApp<ArrowRight size={16} /></QuoteLink><span>Prefere e-mail? <a href={contact.mailto}>Escreva para a equipe</a></span></div>
      <div className="contact-faq accordion"><h3>Perguntas frequentes sobre o atendimento</h3>
        {seoContent.faqs.map(item => <details className="accordion-item" key={item.question}><summary className="accordion-button">{item.question}</summary><div className="accordion-body"><p>{item.answer}</p></div></details>)}
      </div>
    </div><QuoteForm />
  </div></section>;
}

function Footer() {
  const groups = {
    Serviços: [['Auto', '#servicos'], ['Residencial', '#servicos'], ['Saúde', '#servicos'], ['Vida', '#servicos']],
    Empresa: [['Sobre nós', '#sobre'], ['Diferenciais', '#diferenciais'], ['Depoimentos', '#depoimentos'], ['Contato', '#contato']],
    Legal: [['Política de Privacidade', '#'], ['Termos de Uso', '#']],
  };
  return <footer><div className="container footer-container"><div className="footer-grid">
    <div className="footer-brand"><Brand /><p>Segurança para cada momento da sua vida. Atendimento personalizado em todo o Brasil.</p><SocialLinks whatsapp={false} /></div>
    {Object.entries(groups).map(([title, links]) => <nav key={title} aria-label={title}><h3>{title}</h3><ul>{links.map(([label, href]) => <li key={label}><a href={href}>{label}</a></li>)}</ul></nav>)}
    </div><div className="footer-contact"><div><a href={contact.tel}>{contact.phone}</a><span className="divider">|</span><a href={contact.mailto}>{contact.email}</a><span className="divider">|</span><span><Globe size={16} />{contact.locations}</span></div>
      <span className="footer-national"><Globe size={16} />Atendimento todo Brasil</span></div>
    <div className="footer-insurers"><InsurersNote /></div>
    <p className="copyright">© {new Date().getFullYear()} Mello & Mosna Corretora de Seguros. Todos os direitos reservados.</p>
  </div></footer>;
}

export default function App() {
  useEffect(() => {
    if (window.location.hash) {
      try { document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' }); } catch { /* Ignore malformed hashes. */ }
    }
  }, []);
  return <><a className="skip-link" href="#servicos">Pular para o conteúdo</a><Header /><main><Hero /><ServicesSection />
    <DifferentialsSection /><AboutSection /><TestimonialsSection /><ContactSection /></main><Footer />
    <aside className="mobile-contact-bar" aria-label="Atendimento rápido"><a className="quick-phone" href={contact.tel} aria-label="Ligar para a corretora"><Phone size={20} /></a><QuoteLink>Falar com a corretora<ArrowRight size={16} /></QuoteLink></aside></>;
}
