# Componentes Bootstrap e melhoria da interface

Atualização em 14/10/2026. A prioridade desta etapa é evoluir a interface com componentes Bootstrap, mantendo a identidade da corretora e a preparação para busca orgânica. As capturas da réplica original e da primeira etapa de SEO são históricas.

## Versões e integração

- Bootstrap **5.3.8**, versão estável atual confirmada no site oficial e no registro npm.
- React Bootstrap **2.10.10**, versão estável do adaptador confirmada no npm, compatível com Bootstrap 5 e React utilizado neste projeto.
- Dependências fixadas para os dois pacotes; `package-lock.json` registra a instalação reproduzível.
- Estilos compilados por Sass a partir dos componentes efetivamente usados, sem CDN. O tema adapta cores, tipografia, raios e breakpoints à marca.
- Interações controladas por React Bootstrap, sem adicionar o bundle JavaScript nativo do Bootstrap que também alteraria o DOM.

Documentação primária: [release Bootstrap 5.3.8](https://blog.getbootstrap.com/2025/08/25/bootstrap-5-3-8/), [integração de Bootstrap com React](https://getbootstrap.com/docs/5.3/getting-started/javascript/#usage-with-javascript-frameworks), [React Bootstrap](https://react-bootstrap.github.io/docs/getting-started/introduction/).

## Componentes utilizados

| Componente | Uso |
| --- | --- |
| Navbar, Nav e Container | Cabeçalho responsivo, links e indicação da seção atual com `aria-current` |
| Offcanvas | Menu lateral móvel, backdrop, controle de foco, Escape e botão de fechamento em português |
| Card | Modalidades, diferenciais, depoimentos e painel do formulário |
| Button | CTAs e controles com foco visível e estados disabled |
| Form.Group, Label, Control e Select | Campos associados, preenchimento automático e validação HTML nativa |
| Alert | Aviso demonstrativo e mensagem de erro |
| Spinner | Estado de processamento com botão temporariamente desabilitado |
| Badge | Identificação de atendimento nacional |

As FAQs usam `details/summary` nativos com o estilo accordion do Bootstrap para permanecerem operáveis sem JavaScript. O grid das modalidades continua em CSS Grid, mantendo duas/três/quatro colunas e os 17 cards na mesma ordem.

## Melhorias

- Texto principal com caixa normal e escala mais equilibrada, evitando um bloco excessivamente alto em desktop.
- Superfícies, bordas e cantos consistentes; contraste dos cards melhorado e descrições mais legíveis.
- Formulário com contexto antes dos campos, feedback visível e estados claros. O modo demonstrativo continua explícito e não envia dados.
- CTA direto de WhatsApp na seção de contato, opção de e-mail e barra de contato no celular com área para o safe area do dispositivo.
- Menu móvel com navegação por teclado e isolamento de foco; o link da seção atual é identificado.
- Foto e fontes otimizadas mantidas. Nenhum carrossel, vídeo, biblioteca de animação ou rastreamento adicionado.

## SEO preservado

O build continua gerando HTML completo e depois hidratando os componentes. A configuração de SSR do Vite incorpora os módulos necessários do React Bootstrap e suas dependências para evitar imports de diretórios incompatíveis com Node ESM. O filtro de log ignora somente a diretiva `use client` da biblioteca, destinada a hosts RSC; os demais avisos continuam visíveis.

O domínio é `https://mellomosnaseguros.com.br/`, com canonical, sitemap, robots.txt e JSON-LD. O conteúdo e as FAQs continuam presentes sem JavaScript. Não foram adicionadas avaliações estruturadas, endereços ou alegações comerciais novas. O custo adicional de CSS/JS dos componentes é uma troca pela biblioteca solicitada; não foi prometida redução do bundle em relação à versão sem Bootstrap.

## Verificação

Os testes incluem build/TypeScript, regras de SEO, leitura sem JavaScript, hidratação, navegação, formulário, cinco viewports, teclado/foco do Offcanvas e verificações automatizadas axe de regras WCAG. **Cinco testes de SEO e 13 testes de navegador passaram (18 no total)**, incluindo axe em 1.440 e 390 px e menu móvel aberto. Testes automatizados de acessibilidade não equivalem a auditoria manual completa ou certificação.

O axe identificou e permitiu corrigir o contraste do copyright e o uso de `aria-label` no grupo de estrelas. A análise final não encontrou violações nas regras selecionadas: WCAG 2 A/AA, 2.1 A/AA e 2.2 AA. Isso não verifica automaticamente todos os critérios WCAG, navegadores ou leitores de tela.

Build cliente: CSS aproximadamente **91,18 KB (15,65 KB gzip)** e JS **297,27 KB (94,75 KB gzip)**. HTML de produção pré-renderizado: aproximadamente **53,9 KB**. O CSS é compilado sem o grid Bootstrap nem controles de formulário não utilizados, mantendo o grid próprio. Os números de gzip são estimativas de compressão do Vite, não medições de rede em hospedagem. A hospedagem precisa habilitar compressão e cache.

Capturas completas e do hero nos cinco viewports estão em `docs/capturas/bootstrap/`. As capturas de desktop e celular foram inspecionadas. O formulário continuou demonstrativo durante os testes, sem requisições de escrita. O preview local respondeu HTTP 200 e os arquivos finais foram copiados para `dist/`. O problema inicial dos imports de diretórios da biblioteca no SSR foi corrigido pela configuração do Vite; o build final renderiza a página corretamente.

Após a suíte completa, foi ajustada apenas a orientação da seta das FAQs fechadas. TypeScript/build passaram novamente; as capturas foram refeitas a partir do preview de produção, incluindo o menu móvel. A inspeção confirmou seta sem rotação quando fechada e rotação de 180 graus quando aberta, além do canonical e da meta robots indexável no HTML final.

Os comandos continuam no README. Publicação, Google Search Console, configuração real de hospedagem e integração comercial do formulário continuam fora da execução local desta etapa.
