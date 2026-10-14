# Ativar avaliações no Google Sites

O componente usa Google Apps Script e uma planilha privada do proprietário. Nenhum servidor Node.js é necessário na hospedagem. Esta sessão não tem navegador Google autenticado nem ferramenta de implantação de Apps Script: a autorização da conta e a implantação precisam ser feitas pelo proprietário. Até isso acontecer, a prévia mostra os campos, mas mantém o envio desativado e nunca afirma que uma avaliação foi recebida.

## Publicar o componente

1. Abra https://script.google.com/ e crie um projeto chamado **Avaliações Mello & Mosna**.
2. Substitua o conteúdo de `Code.gs` pelo arquivo `Code.gs` desta pasta.
3. No botão **+**, escolha **HTML**, use o nome **Avaliacoes** (sem acento) e cole o conteúdo de `Avaliacoes.html` desta pasta. Esse arquivo já inclui Bootstrap 5.3.8; não use o arquivo `.template.html` no editor.
4. Nas configurações do projeto, habilite a exibição de `appsscript.json`. Substitua seu conteúdo pelo arquivo correspondente desta pasta.
5. Salve, selecione a função **configurar_** na barra do editor e clique em **Executar**. Autorize o acesso à sua conta Google. A função cria uma planilha privada, configura os cabeçalhos e as opções de aprovação. Executar novamente reutiliza a mesma planilha. O link fica no registro da execução.
6. Clique em **Implantar → Nova implantação → Aplicativo da Web**. Escolha **Executar como: Eu** e **Quem pode acessar: Qualquer pessoa**, se disponível na política da conta. Autorize e copie a URL terminada em `/exec` (a URL `/dev` não é a implantação pública).
7. No Google Sites, escolha **Inserir → Incorporar → URL**, cole essa URL e ajuste a altura para mostrar o formulário. Publique a alteração no Google Sites. Confira o envio em uma janela anônima.

Não publique a planilha na Web e não conceda acesso aos visitantes. Somente o aplicativo da Web recebe acesso público; ele expõe apenas as avaliações aprovadas.

## Aprovar ou recusar

Abra a planilha privada criada na etapa 5. Cada envio novo terá **PENDENTE** na coluna **I — Status**.

- **APROVADO:** o nome, cidade, nota e comentário poderão aparecer no componente.
- **RECUSADO:** o conteúdo fica fora da exibição pública.
- **PENDENTE:** continua aguardando análise.

Para retirar uma avaliação já publicada, mude o status para **RECUSADO**. A alteração será refletida quando o componente for carregado novamente. Os e-mails nunca são enviados para a lista pública. Apenas a conta proprietária e os editores que ela autorizar na planilha podem moderar; não existe função pública para aprovar.

## Atualizar também este projeto local

Cole a URL `/exec` em `src/reviews.config.json`, no campo `webAppUrl`. Execute o build novamente. A seção de avaliações passará a carregar o componente real em vez da prévia sem armazenamento.

O Google Sites não importa diretamente a pasta `dist/` de um projeto React/Vite. Este pacote incorpora o componente de avaliações ao Google Sites. A publicação das demais seções do site precisa seguir o fluxo escolhido para o site completo.

## Funcionamento e verificação

- Gravação real na planilha, com validação no servidor e consentimento obrigatório.
- Nota inteira de 1 a 5, comentário de 10 a 1.500 caracteres e e-mail privado.
- Status fixado como PENDENTE no servidor, mesmo se alguém tentar enviar outro status.
- Bloqueio contra envios simultâneos, repetição recente pelo mesmo e-mail e duplicação de uma tentativa reenviada.
- Conteúdo tratado como texto no navegador e proteção contra fórmulas inseridas na planilha.
- A lista pública limita a exibição às 30 avaliações aprovadas mais recentes por ordem de recebimento, sem e-mail ou IDs internos.
- Confirmação de recebimento somente depois que o servidor confirmar a gravação. Em falhas, os campos são mantidos.
- Os testes locais usam um simulador dos serviços Google para executar o código `Code.gs`. A autorização, as permissões e a gravação na conta real só podem ser verificadas depois da implantação. Não foram criadas avaliações fictícias na sua conta.

Para alterar o visual, edite `Avaliacoes.template.html` e gere novo build. O build produz `Avaliacoes.html` e `public/reviews-preview.html`. Para atualizar um aplicativo já publicado, substitua o HTML no Apps Script e crie uma nova versão da implantação existente.

Referências oficiais: [incorporar Apps Script no Google Sites](https://developers.google.com/apps-script/guides/web#embed_your_web_app_in_google_sites) e [comunicação entre formulário e servidor](https://developers.google.com/apps-script/guides/html/communication).
