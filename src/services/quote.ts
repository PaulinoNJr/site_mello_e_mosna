export interface QuoteRequest {
  nome: string;
  email: string;
  telefone: string;
  tipo: string;
  mensagem: string;
}
export type QuoteService = (request: QuoteRequest) => Promise<{ mode: 'demo' }>;
// Deliberately no network calls or persistence. Replace only with an authorized API.
export const submitQuote: QuoteService = async () => ({ mode: 'demo' });
