# Seguradoras parceiras

Lista indicada pelo proprietário na imagem de referência: Porto, Tokio Marine, MAPFRE, Allianz, Yelum, Azul, Bradesco, Itaú, Zurich e Mitsui Sumitomo.

A faixa foi incluída no rodapé, substituindo o aviso genérico sobre seguradoras. São cinco colunas no computador, três nas larguras intermediárias e duas no celular, com fundo claro e proporções preservadas. Os arquivos são locais, com carregamento adiado, dimensões reservadas e nomes alternativos para acessibilidade. Não há carrossel automático ou dependência de imagens externas durante a navegação.

As versões dos logotipos foram obtidas em 14/10/2026 nas fontes abaixo. Podem refletir atualizações de identidade visual em relação à imagem enviada. A indicação de parceria veio do proprietário; os sites das marcas foram usados somente como origem dos arquivos gráficos.

| Marca | Origem do arquivo |
| --- | --- |
| Porto | https://portoseguro.cdn.prismic.io/portoseguro/aScbuWGnmrmGqW3T_porto-logo.svg — vinculado em https://www.portoseguro.com.br/ |
| Tokio Marine | https://www.tokiomarine.com.br/documents/d/guest/logo |
| MAPFRE | https://www.mapfre.com.br/media/logo-mapfre.png |
| Allianz | https://commons.wikimedia.org/wiki/File:Allianz.svg — arquivo atribuído à Allianz, com origem no site oficial |
| Yelum | https://www.yelumseguros.com.br/SiteAssets/img/logo-cia-primary.svg |
| Azul | https://www.azulseguros.com.br/wp-content/uploads/2022/07/azul-seguros.svg |
| Bradesco | SVG do cabeçalho de https://www.bradescoseguros.com.br/clientes, com o preenchimento `#cc092f` definido no CSS oficial |
| Itaú | https://www.itau.com.br/media/dam/m/c5a2dcc08dba709/original/logo-192px.png |
| Zurich | https://commons.wikimedia.org/wiki/File:Zurich_Insurance_Group_Logo_Horizontal.svg — arquivo atribuído à Zurich e proveniente da biblioteca oficial de marca |
| Mitsui Sumitomo | https://msig.com.br/wp-content/uploads/2024/09/mitsui-logo.svg |

Os vetores de Allianz e Zurich são identificados no Wikimedia Commons como logotipos de texto/formas simples em domínio público. As marcas continuam pertencendo aos seus respectivos titulares. Os arquivos foram preservados sem redesenho; no SVG do Bradesco foi incorporada a cor que o site oficial aplica externamente via CSS.

Dados e apresentação: `src/partners.json`, `src/PartnersSection.tsx` e estilos de parceiros em `src/responsive.css`. Arquivos em `public/assets/seguradoras/`.

Validação: TypeScript e build concluídos; 15 testes existentes de interface, acessibilidade e SEO passaram. Os dez logotipos carregaram sem overflow em 280, 390, 768, 1024 e 1440 px, nos navegadores Chromium, WebKit e Firefox (15 combinações). Os arquivos somam cerca de 57 KB. Capturas inspecionadas em `docs/capturas/seguradoras/`.
