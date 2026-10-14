# Responsividade de celulares e tablets

Atualização em 14/10/2026. O layout se adapta à largura disponível, sem depender do nome ou fabricante do aparelho. A matriz inclui telas estreitas, celulares, tablets, orientação horizontal e larguras intermediárias de tela dividida.

## Regras aplicadas

- Gutter fluido de 16 a 40 px, respeitando `safe-area-inset-left/right` em telas com recortes. O viewport permite `viewport-fit=cover` e mantém o zoom do usuário habilitado.
- Títulos, texto de apoio e espaçamentos fluidos, sem esconder overflow horizontal para mascarar conteúdo cortado.
- Selo de atendimento pode quebrar linha quando necessário; marca e menu ficam compactos abaixo de 360 px.
- Seguros em uma coluna abaixo de 340 px, duas entre 340 e 639 px, três entre 640 e 1.023 px e quatro a partir de 1.024 px. São 18 cards, com Consórcio e Previdência separados.
- Menu lateral até 1.279 px, incluindo tablets. Navegação completa a partir de 1.280 px. O menu fecha ao retornar à largura desktop e libera a rolagem do documento.
- Em telas de até 500 px de altura, o cabeçalho passa de 80 para 64 px e as âncoras compensam a altura correspondente. O menu lateral continua rolável.
- Barra fixa de contato somente em telas menores que 768 px e com mais de 500 px de altura. Um ResizeObserver mede sua altura real e reserva esse espaço no corpo, incluindo safe area e eventuais quebras de linha, para não cobrir o rodapé. O texto foi encurtado para telas estreitas.
- Ao focar nome, e-mail, telefone, modalidade ou mensagem, a barra fixa é ocultada. Isso libera espaço durante o preenchimento e evita sobreposição com o teclado. Os campos usam tamanho de fonte mínimo de 1 rem (16 px no padrão), sem bloquear o zoom do navegador.
- Rodapé com links em duas colunas nos celulares e tablets e quatro blocos no desktop; links de rodapé e ícones oferecem área de toque mínima de 44 px em dispositivos com ponteiro coarse. Veja também `ESPACAMENTOS.md` para a revisão de margens e intervalos.
- Foto, mensagens de contato, botões e informações institucionais se ajustam ao espaço disponível. As FAQs continuam operáveis sem JavaScript.
- Movimento reduzido, foco visível, contatos e mensagem do WhatsApp, conteúdo pré-renderizado e arquivos de SEO permanecem ativos.

## Matriz de validação

27 dimensões CSS, com simulação de toque e DPR 2, em Chromium, WebKit e Firefox:

| Grupo | Viewports |
| --- | --- |
| Telas estreitas e celulares compactos | 280×653, 320×568, 344×882, 360×640, 375×667 |
| Celulares maiores | 390×844, 412×915, 430×932 |
| Dobráveis, tela dividida e transições | 540×720, 600×960, 639×900, 640×900 |
| Celulares na horizontal | 667×375, 740×360 |
| Tablets na vertical | 768×1024, 800×1280, 820×1180, 834×1194, 912×1368 |
| Tablets na horizontal e limites do menu | 1023×768, 1024×768, 1112×834, 1180×820, 1194×834, 1279×800 |
| Tablet grande e desktop | 1280×800, 1366×1024 |

Cada caso verifica ausência de rolagem horizontal, elementos fora da viewport e títulos cortados, quantidade de colunas, espaço entre marca e menu, campo de formulário utilizável, ocultação da barra durante foco, espaço reservado para a barra e destino de âncoras. Casos selecionados também abrem o menu lateral e navegam por ele, inclusive em 1.024 e 1.194 px.

Em cada engine há verificações adicionais de rotação com o menu aberto, uso do menu em pouca altura, retorno ao desktop sem scroll lock e aumento da fonte padrão para 200% em viewport estreita. Essa última verificação testa reflow, não simula integralmente todas as modalidades de zoom de cada sistema operacional.

## Execução

```powershell
powershell -NoProfile -File .\scripts\local.ps1 -Task test
```

O script instala os três navegadores de teste, compila o site e executa os projetos definidos no Playwright. Em uma cópia convencional fora do Google Drive:

```sh
npm ci
npx playwright install chromium firefox webkit
npm test
```

Os testes de responsividade usam o preview de produção na porta 4180. Os testes anteriores de conteúdo, formulário, SEO, hidratação, teclado e axe continuam na suíte. As capturas geradas ficam em `test-results/`; as selecionadas para a entrega ficam em `docs/capturas/responsividade/`.

## Limites

São testes de navegador e emulação de viewport/toque, não execução em todos os modelos físicos. WebKit no Windows não equivale a validar integralmente Safari/iOS em hardware real. Teclados virtuais, barras do sistema e valores de safe area variam por sistema; as regras foram preparadas para isso, mas ainda é recomendável conferir a publicação em aparelhos físicos representativos. Nenhuma lista finita de modelos elimina a necessidade de layout fluido e acompanhamento após a publicação.

## Resultado final

**100 testes de navegador aprovados e cinco testes do gerador de SEO aprovados (105 no total)**. TypeScript, build cliente e build de HTML estático também passaram. A matriz de 27 dimensões foi executada em cada um dos três engines; testes adicionais cobriram rotação, aumento da fonte padrão, foco do formulário, menu lateral, SEO, validação nativa e acessibilidade automatizada.

O preview de produção respondeu HTTP 200 em `http://127.0.0.1:4173/`. Os arquivos finais foram copiados para `dist/` e as capturas selecionadas foram mantidas em subpastas por caso/engine em `docs/capturas/responsividade/`. Foram inspecionadas capturas de tela estreita, celular na horizontal e tablet.

As execuções intermediárias identificaram a sobreposição do botão de retorno e a reserva insuficiente da barra de contato em 280 px quando seu texto ocupava duas linhas. O seletor do ícone foi corrigido e a reserva passou a usar a altura efetiva da barra. A execução final passou sem excluir cenários ou afrouxar as verificações de layout.

## Correções encontradas pela validação

A largura de 280 px revelou um selo de atendimento parcialmente cortado. A nova regra permite quebra de linha e ajustes de espaçamento. O teste do formulário também revelou que o CTA de WhatsApp do resultado herdava o estilo circular do ícone da confirmação, cobrindo o botão de retorno. O seletor foi limitado ao `span` do ícone, preservando a área retangular e clicável do CTA.
