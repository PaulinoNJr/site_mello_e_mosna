/* Google Apps Script V8. Moderation is available ONLY in the owner's private sheet.
 * Functions ending in _ cannot be invoked through google.script.run.
 */
const REVIEW_HEADERS = ['ID', 'Recebido em', 'Nome', 'E-mail privado', 'Cidade', 'Nota', 'Comentário', 'Autorização', 'Status', 'Chave do envio'];

function configurar_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('REVIEWS_SPREADSHEET_ID');
  const book = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.create('Mello & Mosna — Avaliações para aprovação');
  const sheet = book.getSheetByName('Avaliações') || book.getSheets()[0];
  sheet.setName('Avaliações');
  if (sheet.getLastRow() === 0) sheet.appendRow(REVIEW_HEADERS);
  if (sheet.getRange(1, 1, 1, 10).getDisplayValues()[0].join('|') !== REVIEW_HEADERS.join('|')) throw new Error('Cabeçalhos incompatíveis. Nenhum dado foi alterado.');
  props.setProperty('REVIEWS_SPREADSHEET_ID', book.getId());
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#eeeeee');
  sheet.setColumnWidth(3, 180); sheet.setColumnWidth(4, 230); sheet.setColumnWidth(5, 160);
  sheet.setColumnWidth(7, 430); sheet.setColumnWidth(9, 150);
  sheet.getRange('G:G').setWrap(true);
  sheet.getRange('I2:I').setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(['PENDENTE', 'APROVADO', 'RECUSADO'], true).setAllowInvalid(false).build());
  if (!sheet.getFilter()) sheet.getRange(1, 1, sheet.getMaxRows(), 10).createFilter();
  console.log('Planilha privada para moderação: ' + book.getUrl());
  return book.getUrl();
}

function folha_() {
  const id = PropertiesService.getScriptProperties().getProperty('REVIEWS_SPREADSHEET_ID');
  if (!id) throw new Error('As avaliações ainda não estão disponíveis. Tente novamente mais tarde.');
  return SpreadsheetApp.openById(id).getSheetByName('Avaliações');
}

function doGet() {
  // No private sheet ID, e-mail, or moderation method is sent to the visitor.
  return HtmlService.createHtmlOutputFromFile('Avaliacoes').setTitle('Avaliações — Mello & Mosna')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function validar_(input) {
  if (!input || typeof input !== 'object' || input.website) throw new Error('Não foi possível enviar a avaliação.');
  const text = (key, min, max) => {
    const value = typeof input[key] === 'string' ? input[key].trim() : '';
    if (value.length < min || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new Error('Confira os campos da avaliação.');
    return value;
  };
  const result = { name: text('name', 2, 100), email: text('email', 3, 254), city: text('city', 0, 80), message: text('message', 10, 1500), requestId: text('requestId', 36, 36), rating: Number(input.rating) };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email) || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(result.requestId) ||
      !Number.isInteger(result.rating) || result.rating < 1 || result.rating > 5 || input.consent !== true) throw new Error('Informe uma nota de 1 a 5 e autorize a publicação.');
  return result;
}

function textoSeguro_(text) {
  // Keep submitted text literal: never allow it to become a spreadsheet formula.
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function enviarAvaliacao(input) {
  const review = validar_(input);
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new Error('O atendimento está ocupado. Tente enviar novamente em instantes.');
  try {
    const sheet = folha_();
    // A retry after a lost response must not create a second submission.
    if (sheet.getLastRow() > 1 && sheet.getRange(2, 10, sheet.getLastRow() - 1, 1)
      .createTextFinder(review.requestId).matchEntireCell(true).findNext()) return { status: 'PENDENTE' };
    const cache = CacheService.getScriptCache();
    const key = 'review:' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, review.email.toLowerCase()));
    if (cache.get(key)) throw new Error('Você já enviou uma avaliação recentemente. Aguarde alguns minutos para enviar outra.');
    sheet.appendRow([Utilities.getUuid(), new Date(), textoSeguro_(review.name), textoSeguro_(review.email),
      textoSeguro_(review.city), review.rating, textoSeguro_(review.message), 'SIM', 'PENDENTE', review.requestId]);
    SpreadsheetApp.flush();
    cache.put(key, '1', 600);
    return { status: 'PENDENTE' };
  } finally { lock.releaseLock(); }
}

function listarAprovadas() {
  const sheet = folha_();
  if (sheet.getLastRow() < 2) return [];
  // Explicit allowlist: private e-mail, internal IDs and unapproved rows never leave the server.
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, 10).getDisplayValues()
    .filter(row => row[8] === 'APROVADO' && row[7] === 'SIM' && Number.isInteger(Number(row[5])) && Number(row[5]) >= 1 && Number(row[5]) <= 5)
    .slice(-30).reverse().map(row => ({ name: row[2], city: row[4], rating: Number(row[5]), message: row[6] }));
}
