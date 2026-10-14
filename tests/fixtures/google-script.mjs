import vm from 'node:vm';
import fs from 'node:fs';
import crypto from 'node:crypto';

export function createGoogleHarness() {
  const rows = [['ID','Recebido em','Nome','E-mail privado','Cidade','Nota','Comentário','Autorização','Status','Chave do envio']];
  const cache = new Map();
  const sheet = {
    getLastRow: () => rows.length,
    getRange(row, col, count = 1, columns = 1) {
      return {
        getDisplayValues: () => rows.slice(row - 1, row - 1 + count).map(values => values.slice(col - 1, col - 1 + columns).map(String)),
        createTextFinder: text => ({ matchEntireCell: () => ({ findNext: () => rows.slice(row - 1).some(values => values[col - 1] === text) ? {} : null }) }),
      };
    },
    appendRow: values => rows.push(values),
  };
  let locked = false;
  const context = vm.createContext({
    console,
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => 'private-sheet-id' }) },
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => sheet }), flush() {} },
    LockService: { getScriptLock: () => ({ tryLock: () => { locked = true; return true; }, releaseLock: () => { locked = false; } }) },
    CacheService: { getScriptCache: () => ({ get: key => cache.get(key), put: (key, value) => cache.set(key, value) }) },
    Utilities: { getUuid: () => crypto.randomUUID(), DigestAlgorithm: { SHA_256: 'sha256' },
      computeDigest: (_, value) => crypto.createHash('sha256').update(value).digest(), base64EncodeWebSafe: value => Buffer.from(value).toString('base64url') },
  });
  vm.runInContext(fs.readFileSync('google-sites/Code.gs', 'utf8'), context);
  return { rows, cache, context, get locked() { return locked; },
    submit: input => context.enviarAvaliacao(input), list: () => context.listarAprovadas() };
}
