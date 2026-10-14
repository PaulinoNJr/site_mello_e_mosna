# Validação — 14/10/2026

## Implementado

Página única em React/TypeScript/Vite, seis seções, header fixo, menu móvel, marca com Shield, 17 cards na ordem pedida, quatro diferenciais, apresentação institucional e fotografia, três depoimentos da referência, contato, formulário e rodapé. Destinos comerciais centralizados, ícones SVG, fotografia e fontes locais. Sem roteador, páginas de modalidades, filtros, login ou painel.

## Evidência e comparação

A primeira tentativa de inspeção pela ferramenta de navegador conectado falhou por ausência de navegador disponível. O HTML, JS e CSS públicos foram lidos por HTTP. Depois da instalação do Chromium para os testes, a referência foi renderizada e capturada com Playwright em **1440×900, 1280×800, 768×1024, 390×844 e 360×800**. A inspeção bloqueou todas as requisições diferentes de GET/HEAD antes da transmissão. Não foi enviado formulário nem acionado contato externo.

Capturas completas e do hero estão em `capturas/referencia/` e `capturas/replica/`. O menu original também foi capturado nos três tamanhos inferiores a 1.024 px e o link interno de contato foi acionado. Fontes e fotografia foram aguardadas. A referência e a réplica foram inspecionadas visualmente, além da comparação geométrica automatizada de nove elementos em cada viewport.

`capturas/referencia/measurements.json` contém os valores reais de getComputedStyle e bounding boxes da referência. `capturas/referencia/comparison.json` contém os valores da réplica e as diferenças em pixels para os mesmos elementos. O método compara geometria e propriedades CSS selecionadas; não é um diff pixel a pixel nem uma medição percentual de fidelidade.

Resultados da comparação final:

- Nos cinco tamanhos, header no topo, H1 e container do hero têm as mesmas coordenadas e dimensões medidas na referência.
- Em 1.440, 1.280 e 768 px, título de serviços, grade e primeiro card também têm as mesmas coordenadas e dimensões medidas. Fonte, peso, caixa alta, colunas, gaps e tokens foram conferidos.
- Em 390 e 360 px, a grade começa na mesma posição, mas fica respectivamente 40 e 81 px mais alta por conta das quebras de palavras que impedem o overflow do original.
- Pequenas diferenças acumuladas permanecem no bloco institucional e no rodapé. Em desktop, a fotografia começa 0,5 px abaixo e o rodapé 36 px abaixo da referência; o aviso demonstrativo do formulário contribui para a diferença vertical.
- A referência apresentou overflow horizontal em telas estreitas; a réplica passa sem overflow nos cinco tamanhos. A correção reduz a largura dos campos ao espaço disponível e permite que textos longos quebrem.

## Verificações executadas

O npm falhou ao extrair pacotes diretamente no disco virtual G:, com erros de escrita `TAR_ENTRY_ERROR`. A execução foi transferida para `%LOCALAPPDATA%\mello-mosna-site` pelo script `scripts/local.ps1`, preservando os fontes nesta pasta. A instalação local concluiu com 25 pacotes e auditoria sem vulnerabilidades reportadas naquele momento.

Comandos reais:

```powershell
powershell -NoProfile -File scripts/local.ps1 -Task test
powershell -NoProfile -File scripts/local.ps1 -Task build
powershell -NoProfile -File scripts/local.ps1 -Task dev
```

O comando `build` inclui `tsc --noEmit` antes de `vite build`. TypeScript e build passaram. A suíte final tem **7 testes aprovados**:

1. Falha sintética do serviço: botão desabilitado enquanto aguarda, mensagem de erro, preservação dos dados e possibilidade de tentar novamente.
2. Conteúdo e formulário: 17 cards e sua ordem; 19 options, primeira vazia e `Outro` ao final; quatro campos obrigatórios e mensagem opcional; seis âncoras; destinos dos CTAs e rodapé; validação nativa de campos vazios/e-mail; confirmação demonstrativa, foco da confirmação e retorno ao formulário. Nenhuma requisição de escrita ou chave em localStorage durante o envio.
3. a 7. Cada viewport: quantidade de colunas, ausência de overflow, carregamento da fotografia, ausência de erros de console/JavaScript, acesso por hash e recarga, navegação pelos cinco links do menu com compensação de 80 px. Nos tamanhos móveis também abertura, aria-expanded, Escape e retorno de foco.

Uma falha intermediária nos testes móveis foi causada pelo próprio seletor do teste: ele procurava “Abrir menu” depois de o nome acessível mudar corretamente para “Fechar menu”. O seletor foi corrigido; a execução final passou integralmente. A implementação recebeu ajustes posteriores de altura de linha e separadores do hero, novamente validados.

O servidor local respondeu HTTP 200 em `http://127.0.0.1:5173/`. O build está em `dist/`. Os testes usam dados sintéticos e o cenário de falha fica em `tests/fixtures/`, fora da entrada de produção do Vite.

## Simulado

O formulário usa `src/services/quote.ts`, sem rede nem persistência. Exibe aviso prévio e confirmação explícita de que a solicitação não foi enviada. E-mail, CRM, armazenamento e entrega comercial não foram implementados nem simulados como reais. Os links WhatsApp abrem o destino público indicado, sem envio automático de mensagem.

## Não verificado

Backend original, recebimento de solicitações, autenticidade de depoimentos, certificações e alegações comerciais, titularidade da fotografia, comportamento em Safari/Firefox e aparelhos físicos. Nenhum teste submeteu dados à referência. Não foi feita auditoria completa de acessibilidade nem teste pixel a pixel.

## Diferenças restantes

Título da aba e favicon próprios da corretora; ausência do selo Base44 e scripts de plataforma; formulário demonstrativo com aviso e resultado próprios; melhorias de labels, foco, Escape, movimento reduzido e overflow. O textarea pode ser redimensionado verticalmente. O header ajusta seus gaps e oculta as redes sociais entre 1.024 e 1.279 px para evitar colisões; essa faixa intermediária não foi incluída nas cinco capturas pedidas. As redes continuam acessíveis no hero e no rodapé. Os links legais continuam em `#`.

A limpeza dos pacotes parciais de `node_modules/` no G: foi bloqueada pela revisão automática. Esses arquivos são ignorados e não são usados pelo script local. Nenhum arquivo preexistente do usuário foi removido.
