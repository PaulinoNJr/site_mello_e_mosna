# Ajuste de espaçamentos — 14/10/2026

O site foi compactado sem retirar informações comerciais ou campos dos formulários.

- Espaçamento vertical das seções: 32–56 px, substituindo 56–112 px.
- Abertura: menor distância do cabeçalho ao conteúdo, título ajustado para duas linhas no computador e margens menores entre texto, botões e indicadores.
- Cards: padding e intervalos menores, com ícones de 40 px.
- Títulos de seção: escala mais compacta e menor distância até o conteúdo.
- Formulários: campos agrupados em duas colunas quando há largura disponível e intervalos menores entre grupos.
- Avaliações: publicações e formulário ficam em blocos independentes, um abaixo do outro. A lista de avaliações aprovadas aparece primeiro; enquanto estiver vazia, apresenta uma mensagem própria. O formulário permanece abaixo, também no celular.
- Rodapé: duas colunas de links no celular, contatos mais próximos e menos espaço entre os blocos. As áreas de toque são preservadas.

## Comparação medida

Medições locais no Chromium, com o formulário de avaliações sem publicações e viewport de 900 px de altura:

| Largura | Altura total anterior | Altura total ajustada | Redução aproximada |
| --- | ---: | ---: | ---: |
| 1440 px | 8103 px | 5822 px | 28% |
| 390 px | 11317 px | 9447 px | 17% |

A altura muda com fontes, conteúdo, orientação e área de toque do dispositivo. As capturas da revisão estão em `docs/capturas/espacamentos/`. O pacote do componente Google Sites também foi regenerado com o formulário compacto.

Validação: TypeScript e build concluídos; 105 testes de navegador, 5 testes de SEO e 4 testes das regras de avaliações passaram (114 no total). A matriz inclui Chromium, Firefox e WebKit, telas de celular e tablet, orientação horizontal, campos, âncoras e acessibilidade automatizada.
