import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createGoogleHarness } from '../tests/fixtures/google-script.mjs';

const input = changes => ({ name: 'Pessoa de Teste', email: 'cliente@example.com', city: 'Campinas',
  rating: 4, message: 'O atendimento foi muito atencioso.', consent: true, website: '', requestId: randomUUID(), ...changes });

test('submission is pending regardless of caller status, and only explicit approval publishes', () => {
  const app = createGoogleHarness();
  assert.equal(app.submit(input({ status: 'APROVADO' })).status, 'PENDENTE');
  assert.equal(app.rows[1][8], 'PENDENTE'); assert.equal(app.list().length, 0);
  app.rows[1][8] = 'APROVADO';
  const published = app.list();
  assert.equal(published.length, 1); assert.equal(published[0].rating, 4);
  assert.deepEqual(Object.keys(published[0]).sort(), ['city','message','name','rating']);
  assert.doesNotMatch(JSON.stringify(published), /cliente@example.com|private-sheet-id/);
  app.rows[1][8] = 'RECUSADO'; assert.equal(app.list().length, 0);
  assert.equal(app.locked, false);
});

test('consent, email, rating, length and bot trap are validated on the server', () => {
  const app = createGoogleHarness();
  for (const change of [{ consent: false }, { consent: 'true' }, { rating: 0 }, { rating: 6 }, { rating: 4.5 },
    { email: 'invalido' }, { message: 'curto' }, { message: 'x'.repeat(1501) }, { name: 'a' }, { website: 'spam' }, { requestId: '=IMPORTXML()' }]) {
    assert.throws(() => app.submit(input(change)));
  }
  assert.equal(app.rows.length, 1);
});

test('retry is idempotent and independent repeat submissions are rate limited', () => {
  const app = createGoogleHarness(), values = input();
  app.submit(values); app.submit(values); assert.equal(app.rows.length, 2);
  assert.throws(() => app.submit(input()), /recentemente/);
  assert.equal(app.locked, false);
});

test('spreadsheet formula injection remains literal and unconsented rows cannot be published', () => {
  const app = createGoogleHarness();
  app.submit(input({ name: '=IMPORTXML("url")', city: '@teste', message: '+IMPORTDATA("https://example.com")' }));
  assert.equal(app.rows[1][2][0], "'"); assert.equal(app.rows[1][4][0], "'"); assert.equal(app.rows[1][6][0], "'");
  app.rows[1][8] = 'APROVADO'; app.rows[1][7] = 'NÃO'; assert.equal(app.list().length, 0);
});
