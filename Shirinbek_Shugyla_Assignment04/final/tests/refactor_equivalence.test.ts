// Differential test: the refactored code must behave exactly like the initial code.
import test from 'node:test';
import assert from 'node:assert/strict';
import { canBook as newCanBook } from '../src/lib/availability.ts';
import { validateStart, validateEnd, validateNow } from '../src/lib/validation.ts';
import { minutesToHHMM } from '../src/lib/format.ts';
import * as old from './baseline/initial_availability.ts';

test('canBook: identical available flag AND reason for 3,456 generated inputs', () => {
  const existing = [{ start: 600, end: 660 }, { start: 720, end: 780 }];
  const values = [-1, 0, 1, 539, 540, 541, 599, 600, 601, 659, 660, 661, 719, 720, 721, 780, 781, 840, 841, 1319, 1320, 1439, 1440, 1441];
  let n = 0;
  for (const blocked of [false, true])
    for (const now of [0, 540, 1439])
      for (const s of values)
        for (const e of values) {
          assert.deepEqual(newCanBook(s, e, now, blocked, existing), old.canBook(s, e, now, blocked, existing), `s=${s} e=${e} now=${now} blocked=${blocked}`);
          n++;
        }
  assert.equal(n, 3456);
});

test('validators: identical results/messages for representative text inputs', () => {
  const samples = ['', '  ', 'abc', '12.5', '1e3', '-1', '0', '1', '540', '1440', '1441', ' 700 ', '+5'];
  for (const raw of samples) {
    assert.deepEqual(validateStart(raw), old.validateStart(raw), `start "${raw}"`);
    assert.deepEqual(validateNow(raw), old.validateNow(raw), `now "${raw}"`);
    for (const start of [null, 0, 700, 1440]) assert.deepEqual(validateEnd(raw, start), old.validateEnd(raw, start), `end "${raw}" start ${start}`);
  }
});

test('minutesToHHMM: identical for the whole valid range and 24:00 fix kept', () => {
  for (let m = -2; m <= 1442; m++) assert.equal(minutesToHHMM(m), old.minutesToHHMM(m), `m=${m}`);
  assert.equal(minutesToHHMM(1440), '24:00');
  assert.equal(minutesToHHMM(-1), '--:--');
});
