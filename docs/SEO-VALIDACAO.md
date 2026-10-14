# Validação de SEO — 14/10/2026

Atualização posterior: a interface passou a usar Bootstrap 5.3.8 e React Bootstrap 2.10.10. O HTML pré-renderizado e os arquivos de SEO foram preservados e testados novamente. O relatório desta evolução está em `BOOTSTRAP.md`; os tamanhos e capturas abaixo correspondem à etapa anterior.

## Resultado

TypeScript e o build com pré-renderização passaram. Cinco testes do gerador de SEO e nove testes de navegador passaram. Não houve submissão a Google, publicação, verificação de domínio ou teste de resultados enriquecidos em ferramenta externa.

O build final com o domínio oficial contém **49.260 bytes de HTML**, incluindo o conteúdo da página na primeira resposta. O tamanho informado inicialmente pelo Vite corresponde ao template antes da inserção do HTML renderizado. O resultado final está em `dist/`.

## Comandos executados

```powershell
powershell -NoProfile -File scripts/local.ps1 -Task test
powershell -NoProfile -File scripts/local.ps1 -Task build
```

O comando de testes executa `node --test scripts/seo.test.mjs`, TypeScript, build cliente, build SSR e Playwright com servidores de desenvolvimento e preview de produção. Os testes de SEO também foram repetidos após tornar explícita a exigência de `indexable: true`; todos os cinco passaram novamente.

## Cobertura

| Verificação | Resultado |
| --- | --- |
| Domínio HTTPS de teste gera canonical, sitemap e URLs sociais consistentes | Passou, teste isolado com domínio reservado `seguros.example`, nunca publicado |
| Ausência de domínio não inventa canonical/sitemap e produz noindex | Passou |
| Homologação com indexação desativada fica fora do sitemap | Passou |
| Configurações com HTTP, credenciais, subpasta, parâmetros, hash e localhost são rejeitadas | Passou |
| Escape de atributos e proteção do JSON-LD contra fechamento de script | Passou |
| HTML de produção sem JavaScript apresenta um H1, 17 cards, quatro FAQs, metadados e Organization JSON-LD | Passou |
| FAQ pode ser aberta mesmo sem JavaScript | Passou |
| Navegador usa fotografia WebP e fontes WOFF2, sem requisições aos TTF | Passou |
| Hidratação do HTML estático preserva conteúdo e ativa menu móvel, sem erros de console/JavaScript | Passou |
| Formulário: validação, demonstração, nenhum envio de rede, rejeição sintética e preservação de dados no erro | Passou |
| Navegação por âncoras e reload, 17 cards em ordem, 19 opções e destinos comerciais | Passou |
| 1440×900, 1280×800, 768×1024, 390×844, 360×800: colunas corretas, foto, console, menu e ausência de overflow | Passou |

As capturas atuais estão em `capturas/seo/` (página completa e hero nos cinco tamanhos, estado do servidor de desenvolvimento). Os testes adicionais verificaram o HTML e a hidratação no preview do build de produção, inclusive com JavaScript desativado.

## Estado do domínio

O usuário informou `mellomosnaseguros.com.br`. A origem oficial está configurada com HTTPS e sem www. O novo build registra:

```json
{
  "indexable": true,
  "siteUrl": "https://mellomosnaseguros.com.br/",
  "htmlPrerendered": true,
  "sitemap": true
}
```

O HTML de produção agora usa `index, follow, max-image-preview:large`, canonical `https://mellomosnaseguros.com.br/` e URLs absolutas de compartilhamento e JSON-LD na mesma origem. `sitemap.xml` contém somente a home e `robots.txt` aponta para `https://mellomosnaseguros.com.br/sitemap.xml`. O template do servidor de desenvolvimento continua em noindex; os arquivos de produção são os gerados em `dist/`. Publicação, DNS/HTTPS e verificação no Search Console continuam pendentes.

Após configurar o domínio, os cinco testes de SEO, TypeScript, os dois builds e os nove testes de navegador passaram novamente. O teste do HTML de produção percorreu o cenário indexável, verificando canonical e a URL correspondente no sitemap. Os arquivos finais foram copiados para `dist/` nesta pasta e conferidos diretamente.

## Limites

Ainda não foram verificados HTTPS, redirecionamentos, status 404, cache e compressão em hospedagem real. O arquivo Nginx é exemplo, não configuração aplicada. Não há resultados de Lighthouse, PageSpeed Insights, Core Web Vitals de campo, Google Search Console ou posições de busca. A redução de tamanho de assets é medida em bytes dos arquivos, não representa uma pontuação de desempenho.

Endereço comercial, perfil do Google, alegações de experiência/certificação/parcerias e autenticidade dos depoimentos continuam dependendo de confirmação da empresa. O schema não contém endereço, horários, geo, preços ou avaliações inventadas. Os resultados de indexação e ranqueamento dependem da publicação e de avaliação contínua após o lançamento; não foram prometidas posições.
