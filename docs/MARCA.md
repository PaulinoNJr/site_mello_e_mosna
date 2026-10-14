# Marca oficial

Em 14/10/2026, o proprietário adicionou duas novas artes transparentes em `public/assets/`. Os dois arquivos foram preservados sem alterações. O desenho, as inscrições e as proporções foram mantidos.

- `logo-mello-mosna.jpeg`: apesar do nome, o conteúdo é PNG com transparência, de 1774 × 887 px. A cópia idêntica `logo-mello-mosna-completo.png` permite servir o tipo MIME correto para `Organization.logo`.
- `logo-mello-mosna.png`: monograma transparente de 1254 × 1254 px, usado como origem dos ícones.
- Cabeçalho: apenas o monograma M&M, em PNG transparente de 192 px, com proporção quadrada e tamanho adaptado à altura do menu.
- Rodapé: logo completo sem placa de fundo, em WebP transparente de 272/544 px, com seleção pelo navegador. Arquivos de aproximadamente 23/68 KB evitam carregar o original de 1,29 MB nesse componente.
- Favicon: monograma fornecido pelo proprietário, incorporado ao SVG, com alternativa PNG de 192 px e ícone de 180 px para dispositivos Apple.
- Compartilhamento: composição de 1200 × 630 px com a arte completa sobre o fundo azul do site, para leitura previsível em aplicativos externos.
- Regeneração: `node scripts/prepare-brand.mjs`, em ambiente com as dependências do projeto e Chromium do Playwright instalados. A rotina apenas redimensiona e codifica as imagens em canvas; não redesenha a marca.

O logotipo é servido localmente. Os atributos de largura e altura reservam o espaço da imagem antes do carregamento. A exibição usa proporção 2:1, texto alternativo e link para o início.

Validação em 14/10/2026: TypeScript e build de produção concluídos; 102 testes Playwright e 5 testes do gerador de SEO passaram. A suíte inclui 27 dimensões em Chromium, Firefox e WebKit, acessibilidade automatizada e verificações específicas da marca. Capturas inspecionadas em `docs/capturas/marca/`. A emulação não substitui testes em todos os aparelhos físicos.
