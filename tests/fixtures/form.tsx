import { createRoot } from 'react-dom/client';
import { QuoteForm } from '../../src/main';

createRoot(document.getElementById('test-root')!).render(<QuoteForm service={() =>
  new Promise((_, reject) => setTimeout(() => reject(new Error('Falha sintética')), 500))} />);
