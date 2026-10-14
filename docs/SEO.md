# Preparação para busca orgânica

Atualizado em 14/10/2026. Esta etapa evolui a réplica visual para um site preparado tecnicamente para busca. Não constitui uma comprovação de indexação nem promessa de posição no Google.

## Implementação

- HTML completo gerado no build com React SSR estático: conteúdo, telefone, e-mail, modalidades, links e perguntas frequentes chegam na primeira resposta, mesmo sem JavaScript. O navegador hidrata esse mesmo HTML para ativar menu e formulário.
- Um H1 descritivo com a corretora e a região de atendimento. Title e description com intenção local, sem listar cidades repetidamente em páginas artificiais.
- Informações úteis sobre contato e quatro perguntas frequentes visíveis, sem criar coberturas, preços, endereços, horários ou condições comerciais.
- JSON-LD com `Organization`, `WebSite` e `WebPage`, contatos e redes da referência. Não foi incluído endereço nem marcação `LocalBusiness`/`InsuranceAgency` elegível a recurso local, pois não há endereço físico confirmado. Não foram marcados depoimentos como `Review` ou `AggregateRating`. Não há promessa de estrelas ou resultado enriquecido.
- Canonical, Open Graph, Twitter Card e imagem de compartilhamento 1.200 × 630 px. URLs absolutas derivam exclusivamente do domínio oficial configurado.
- Sitemap XML com somente a URL real `/`. Âncoras não são páginas independentes e não entram no sitemap. Sem lastmod inventado.
- Robots.txt permite rastreamento de conteúdo e assets e informa o sitemap quando a produção está configurada. `noindex` é controlado por meta tag, não por bloqueio em robots.txt.
- Fontes WOFF2 locais com subsets latino/latino estendido e preload do subconjunto principal. Os dois arquivos somam 108.644 bytes; os cinco TTF anteriores somavam cerca de 905 KB. O navegador carrega só os subconjuntos necessários. Os TTF continuam no repositório como fonte da imagem de compartilhamento.
- Foto em WebP responsivo: 15.028 bytes em 600 px e 27.072 bytes em 900 px, com JPEG de fallback (75.141 bytes), lazy loading, dimensões reservadas e decodificação assíncrona. O alt agora informa que é imagem ilustrativa.
- Página 404 no build e exemplo de Nginx com status 404 real, HTTPS, compressão e cache de arquivos. A configuração do servidor depende da hospedagem escolhida.

## Domínio oficial — configurado

O domínio foi informado pelo usuário e configurado em `site.config.json`:

```json
{
  "siteUrl": "https://mellomosnaseguros.com.br/",
  "indexable": true,
  "googleSiteVerification": ""
}
```

A versão oficial escolhida é HTTPS sem www. Configure o redirecionamento 301 de HTTP e www para essa origem na hospedagem. O gerador rejeita HTTP, localhost, credenciais, portas e caminhos. A configuração não altera DNS nem publica o site por si só.

Depois, gere novo build:

```powershell
powershell -NoProfile -File .\scripts\local.ps1 -Task test
powershell -NoProfile -File .\scripts\local.ps1 -Task build
```

Sem `siteUrl`, o build funciona para revisão, mas emite `noindex, follow`, não inventa canonical e não gera sitemap.xml. O aviso aparece no terminal e em `dist/seo-status.json`. Com domínio e `indexable: true`, o mesmo build gera canonical, URLs sociais, sitemap.xml e `index, follow`. Para homologação, use `indexable: false`. Não publique o build de revisão esperando indexação.

## Publicação e Google

1. Publicar `dist/` no domínio oficial com HTTPS. Servir `/` com HTTP 200; URLs inexistentes devem devolver 404, sem fallback genérico da SPA. O arquivo `deploy/nginx.conf.example` é apenas modelo para Nginx e não foi aplicado a servidor algum.
2. Confirmar no HTML entregue pelo domínio: title, description, H1, canonical correto e robots com `index, follow`. Confirmar `/robots.txt`, `/sitemap.xml`, a imagem de compartilhamento e os arquivos CSS/JS/fontes.
3. Criar/verificar uma propriedade de domínio no Google Search Console. A opção de domínio usa DNS; não há como verificar a propriedade sem acesso à conta/DNS. Se preferir propriedade por prefixo e verificação por meta tag, preencher `googleSiteVerification` com o token exato e gerar/publicar outro build.
4. Enviar o sitemap no Search Console e usar Inspeção de URL na home. Solicitar indexação após a publicação e verificar se o Google escolheu o canonical esperado. Não há envio automático a buscadores neste projeto.
5. Confirmar e completar o Perfil da Empresa no Google: nome comercial real, categoria apropriada, telefone e site consistentes, região atendida, endereço e horários somente se verdadeiros e elegíveis. Usar o perfil existente se houver, evitando duplicação por cidade.
6. Validar os dados no Rich Results Test e no Schema Markup Validator. O schema atual descreve a organização; não garante recurso enriquecido nem deve inventar endereço para passar validação local.
7. Medir PageSpeed Insights e Core Web Vitals na URL publicada. A validação local não substitui dados de campo de usuários reais. Acompanhar indexação, consultas, impressões, cliques e contatos pelo WhatsApp. Não foi adicionado rastreamento de terceiros nesta etapa.

## Conteúdo e confiança

Antes da publicação comercial, confirmar as afirmações herdadas da referência: experiência de 15+ anos, certificação SUSEP, parcerias, revisão anual e autenticidade/autorização dos três depoimentos. Confirmar identidade da empresa e informações regulatórias para exibir dados reais; não completar números por suposição. O formulário continua demonstrativo, informado no texto e nas FAQs. Para captar solicitações pelo formulário será necessária uma integração real e tratamento de privacidade correspondente; os contatos WhatsApp/e-mail já oferecem caminho de conversão.

Manter a página atual com informações corretas é o primeiro passo. Para ampliar a busca por modalidade, uma próxima etapa editorial pode criar páginas próprias com conteúdo original, útil e revisado pela corretora, sobre as dúvidas de seus clientes. Não foram geradas 17 páginas quase idênticas nem páginas que apenas trocam nomes de cidades. Não foram usados textos ocultos, meta keywords, avaliações inventadas ou compra de links.

## Fontes oficiais utilizadas

- [SEO para JavaScript: HTML pré-renderizado, links e canonical](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Guia de SEO do Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Dados de Organization](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Dados de LocalBusiness e campos necessários](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Regras de avaliações e estrelas](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- [Criação e envio de sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

## Validação desta etapa

Resultados são registrados em `SEO-VALIDACAO.md`. O relatório visual anterior (`VALIDACAO.md`) descreve a réplica antes destas alterações editoriais; as capturas antigas não representam o novo H1 e os novos blocos de conteúdo.
