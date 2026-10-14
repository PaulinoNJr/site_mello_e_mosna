# Recursos e referência

Atualização de SEO: os textos de abertura e contato foram adaptados para busca local; foram acrescentadas perguntas frequentes. As fontes usadas no navegador agora são WOFF2 latino/latino estendido obtidas da mesma família no Google Fonts. A fotografia tem derivações WebP em 600/900 px. Os arquivos de origem foram preservados. O compartilhamento usa `public/assets/compartilhamento.png`, regenerado com a nova arte oficial transparente sobre fundo azul. Veja `docs/SEO.md` e `docs/MARCA.md` para a implementação atual.

Consulta: 14/10/2026. Página pública: https://dainty-launch-pixel-flow.base44.app/.

Foram lidos apenas o HTML de entrada e os recursos JS/CSS por ele vinculados. Não houve exploração de rotas ocultas, uso de credenciais, envio de formulário ou chamadas a endpoints de escrita.

| Recurso | Origem e utilização |
| --- | --- |
| Conteúdo, hierarquia e classes | `/assets/index-BZ6aB1F_.js`, recurso público vinculado pelo HTML da referência. Reimplementação própria; nenhum SDK Base44 incorporado. |
| Tokens e tipografia | `/assets/index-7ihiCz7i.css`. Montserrat para corpo e títulos, pesos 400–800 utilizados; cores em HSL e gradiente dourado confirmados no CSS. |
| Fotografia | https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80, copiada para `public/assets/escritorio.jpg`. Fotografia de banco utilizada pelo original; não foi verificado se retrata instalações reais da empresa. Uso somente em `#sobre`, cover centralizado, altura 400/520 px. Licença: https://unsplash.com/license. |
| Montserrat | Google Fonts, arquivos TTF de `fonts.gstatic.com`, armazenados em `public/assets/fonts/`. Licença SIL Open Font License incluída em `OFL.txt`, obtida do repositório oficial https://github.com/google/fonts/tree/main/ofl/montserrat. |
| Ícones | `lucide-react`, licença ISC incluída no pacote. Os nomes dos ícones foram identificados no bundle público (Car, House, Building2, Heart, Bike etc.). MessageCircle representa WhatsApp como no original, sem inserir marca gráfica nova. |
| Marca e favicon | Artes transparentes fornecidas pelo proprietário em `public/assets/`, sem redesenho. Cabeçalho e rodapé usam WebP; compartilhamento e SEO usam PNG. O favicon e o ícone Apple usam o novo monograma. Veja `MARCA.md`. |

Os recursos baixados para `.reference/` são evidência local ignorada pelo Git e não entram no build. `scripts/extract-reference.py` registra a extração do conteúdo visível para `src/data.json`; não precisa ser executado para instalar, testar ou compilar o projeto. O runtime só utiliza os dados locais já gerados.

## Medidas extraídas dos arquivos públicos e conferidas com getComputedStyle

As medidas do navegador estão em `capturas/referencia/measurements.json`, coletadas em Chromium nas cinco dimensões pedidas. Todas as requisições diferentes de GET/HEAD foram bloqueadas. O menu móvel original foi aberto e seu link de contato acionado; não foi submetido formulário nem acessado WhatsApp.

- Header: 80 px; bloco da marca: 40 × 40 px; Shield: 20 × 20 px.
- Container: largura máxima 1.280 px; padding 24 px, passando a 40 px em 1.024 px.
- Hero: container máximo 1.024 px; padding vertical 128/64 px no mobile e 176/96 px no desktop.
- H1: Montserrat 800, 36/48/72 px, altura de linha 1,1 em 36 px e 1 em 48/72 px (confirmado no navegador), tracking -0,025 em, caixa alta.
- H2: 30/48 px, peso 800, caixa alta; texto dos diferenciais em caixa normal.
- Navegação: 14 px, peso 500; campos: 16 px, padding 12/16 px.
- Seções: padding vertical 80/112 px; cards de seguros: padding 24 px e gap 16/24 px.
- Grade: duas colunas por padrão, três em 640 px, quatro em 1.024 px; a última linha mantém alinhamento à esquerda.
- `--radius: .25rem` e `rounded-sm: calc(var(--radius) - 4px)` resultam em cantos retos na escala padrão de 16 px. Não foi assumido arredondamento de 2 ou 4 px.
- Fundo `hsl(216 65% 11%)`, card `hsl(216 55% 15%)`, texto branco com opacidades, borda `hsl(216 35% 24%)`, destaque `hsl(39 48% 56%)`, gradiente `135deg, #c59f59, #e0c285`.

## Diferenças deliberadas

- Título da aba: `Mello & Mosna | Corretora de Seguros`, em vez de `MeuSite Digital`.
- Favicon local; sem selo “Edit with Base44”, telemetria, SDK, autenticação ou scripts administrativos.
- Formulário demonstrativo com aviso e confirmação explícitos. A leitura estática mostrou chamada do original a `entities.Contact.create`; isso não comprova funcionamento nem autoriza seu uso.
- Labels associados por `htmlFor`, foco visível, skip link e menu com `aria-expanded`, fechamento por Escape e retorno de foco.
- Em larguras de 1.024–1.279 px os ícones sociais do header são omitidos e os gaps diminuem para evitar colisões. As redes continuam no hero e rodapé. Essa adaptação não foi validada visualmente no original.
- Fontes e fotografia locais para evitar dependências remotas durante a navegação.
- Correção de overflow: a referência apresentou overflow horizontal em telas estreitas na inspeção atual, incluindo campos do formulário. A réplica limita a largura dos elementos, quebra o endereço de e-mail e permite quebra de títulos de cards para atender ao briefing sem alterar o conteúdo.
