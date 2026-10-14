# Avaliações moderadas — validação de 14/10/2026

As avaliações publicadas e o formulário ficam em cartões separados, com a lista acima do formulário em todas as larguras. Os cartões de avaliações usam até três colunas no computador e uma no celular. A separação foi verificada em 390 e 1.280 px; os sete testes focados de avaliações, Bootstrap e SEO passaram após o ajuste.

Os três depoimentos da referência foram removidos de `src/data.json` e do componente público. O extrator da referência também deixou de recuperá-los. O menu agora usa “Avaliações”; a âncora `#depoimentos` continua funcionando para preservar links existentes.

O componente para Google Sites está em `google-sites/`, com instruções em `GUIA.md`. Os arquivos para copiar no editor estão reunidos em `avaliacoes-google-sites.zip`. O Apps Script cria uma planilha privada para o proprietário, grava novos envios como PENDENTE e só retorna registros com Status APROVADO e autorização SIM. O endpoint público não retorna e-mails ou identificadores internos. A aprovação ocorre pela conta Google que administra a planilha; não existe função pública para aprovar.

## Verificações concluídas

- TypeScript e build de produção concluídos.
- 5 testes do gerador de SEO e 4 testes das regras do Apps Script passaram.
- Os 105 cenários de navegador passaram ao longo da validação, incluindo 27 dimensões em Chromium, Firefox e WebKit. A última execução focada reuniu 14 testes aprovados após corrigir o deslocamento do destino Contato durante o carregamento do formulário incorporado.
- Testes do novo formulário: remoção dos depoimentos antigos, bloqueio do envio sem integração, persistência pendente, aprovação, retirada da publicação, e-mail privado e conteúdo HTML exibido como texto.
- Validação no servidor: nota inteira de 1 a 5, consentimento obrigatório, limites dos campos, proteção contra fórmulas na planilha, limitação de repetição e reenvio sem duplicação.
- Verificação automatizada de acessibilidade no formulário em 280 px, além das verificações existentes no site.
- Inspeção visual do formulário em computador e celular. As cinco opções de nota ficam na mesma linha. A barra móvel de contato se esconde enquanto o formulário incorporado está em edição.
- Capturas em `docs/capturas/avaliacoes/`.

## Ativação ainda necessária

Não há navegador Google autenticado nem ferramenta de implantação de Apps Script nesta sessão. A autorização da conta e a implantação não foram executadas. Nenhuma planilha de produção ou avaliação fictícia foi criada na conta do usuário.

Os testes do servidor executam o arquivo `Code.gs` em um simulador dos serviços Google. Isso valida as regras, mas não substitui o teste de gravação e permissões na conta real. A gravação real depende de seguir `google-sites/GUIA.md` e configurar a URL `/exec` em `src/reviews.config.json`. Até a configuração, o envio fica desativado com aviso visível; não há confirmação falsa de recebimento.
