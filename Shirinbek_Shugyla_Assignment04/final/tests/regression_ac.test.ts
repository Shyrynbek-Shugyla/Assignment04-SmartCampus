// Regression tests for AC1-AC5: the same cases run against the INITIAL and the FINAL canBook.
import test from 'node:test';
import assert from 'node:assert/strict';
import { canBook as finalCanBook } from '../src/lib/availability.ts';
import { canBook as initialCanBook } from './baseline/initial_availability.ts';

type B = { start: number; end: number };
const R1: B[] = [{ start: 600, end: 660 }]; // now=540, one booking 600-660

const impls = [
  ['initial', initialCanBook],
  ['final', finalCanBook],
] as const;

for (const [name, canBook] of impls) {
  const ok = (s: number, e: number, existing: B[] = R1, blocked = false, now = 540) =>
    canBook(s, e, now, blocked, existing).available;

  test(`[${name}] AC4 touching intervals are NOT overlap (660-720 and 540-... edge)`, () => {
    assert.equal(ok(660, 720), true); // starts exactly where booking ends
    assert.equal(ok(541, 600), true); // ends exactly where booking starts
  });
  test(`[${name}] AC4 overlap is rejected (partial, containing, inside, duplicate)`, () => {
    assert.equal(ok(630, 690), false);
    assert.equal(ok(590, 670), false);
    assert.equal(ok(610, 650), false);
    assert.equal(ok(600, 660), false);
  });
  test(`[${name}] AC2 boundary: exactly 120 minutes allowed, 121 rejected`, () => {
    assert.equal(ok(720, 840), true);
    assert.equal(ok(720, 841), false);
  });
  test(`[${name}] AC1 start must be strictly after now (start == now rejected)`, () => {
    assert.equal(ok(540, 570), false);
    assert.equal(ok(539, 570), false);
    assert.equal(ok(541, 570), true);
  });
  test(`[${name}] AC1 day bounds: end 1440 allowed (120 min ending at midnight), 1441 and reversed/zero rejected`, () => {
    assert.equal(ok(1320, 1440), true);
    assert.equal(ok(1320, 1441), false);
    assert.equal(ok(720, 660), false);
    assert.equal(ok(720, 720), false);
    assert.equal(ok(-1, 30, [], false, -5), false); // start below 0 is invalid even if after now
  });
  test(`[${name}] AC3 blocked room rejects every request`, () => {
    assert.equal(ok(660, 720, R1, true), false);
    assert.equal(ok(700, 760, [], true), false);
  });
  test(`[${name}] AC4 several bookings, unsorted list, gap between two`, () => {
    const many: B[] = [{ start: 720, end: 780 }, { start: 600, end: 660 }]; // unsorted
    assert.equal(ok(660, 720, many), true); // exactly fills the gap
    assert.equal(ok(650, 700, many), false);
  });
  test(`[${name}] AC5 input is never mutated`, () => {
    const existing: B[] = [{ start: 720, end: 780 }, { start: 600, end: 660 }];
    const snapshot = JSON.parse(JSON.stringify(existing));
    canBook(660, 720, 540, false, existing);
    canBook(650, 700, 540, false, existing);
    assert.deepEqual(existing, snapshot);
  });
}
