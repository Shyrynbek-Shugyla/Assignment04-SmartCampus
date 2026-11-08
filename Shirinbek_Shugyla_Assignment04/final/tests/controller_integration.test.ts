// Integration: raw form text -> validation -> filtering -> availability -> view model.
import test from 'node:test';
import assert from 'node:assert/strict';
import { rooms } from '../src/data/rooms.ts';
import { buildViewModel, type FormState } from '../src/lib/searchController.ts';

const form = (o: Partial<FormState>): FormState => ({
  roomId: 'R1', startRaw: '', endRaw: '', nowRaw: '540',
  attendeesRaw: '', equipment: [], submitted: true, ...o,
});

test('integration: successful flow (R5, 100 people, projector, 11:00-12:30 is booked -> unavailable; 13:00-14:00 free)', () => {
  const busy = buildViewModel(form({ roomId: 'R5', attendeesRaw: '100', equipment: ['Projector'], startRaw: '700', endRaw: '760' }), rooms);
  assert.equal(busy.result?.available, false);
  const free = buildViewModel(form({ roomId: 'R5', attendeesRaw: '100', equipment: ['Projector'], startRaw: '780', endRaw: '840' }), rooms);
  assert.equal(free.result?.available, true); // 780 touches booking end 780 -> allowed
});

test('integration: no result before Check is pressed', () => {
  const vm = buildViewModel(form({ submitted: false, startRaw: '700', endRaw: '760' }), rooms);
  assert.equal(vm.result, null);
});

test('integration (AC6): validation errors are plain and kept separate from the result', () => {
  const vm = buildViewModel(form({ startRaw: '', endRaw: 'abc', nowRaw: '540' }), rooms);
  assert.equal(vm.errors.start, 'Start is required.');
  assert.equal(vm.errors.end, 'End must be a whole number.');
  assert.equal(vm.formInvalid, true);
  assert.equal(vm.result, null);
});

test('integration (AC6): out of range and end-not-after-start messages', () => {
  assert.equal(buildViewModel(form({ startRaw: '1500', endRaw: '1600' }), rooms).errors.start, 'Start must be a whole number from 0 to 1440.');
  assert.equal(buildViewModel(form({ startRaw: '700', endRaw: '700' }), rooms).errors.end, 'End must be later than start.');
});

test('integration: invalid attendees value is reported and does not crash filtering', () => {
  const vm = buildViewModel(form({ attendeesRaw: '0', startRaw: '700', endRaw: '760' }), rooms);
  assert.match(vm.errors.attendees!, /whole number of 1 or more/);
  assert.equal(vm.result, null);
  assert.equal(vm.matchingRooms.length, rooms.length); // invalid text = no capacity filter
});

test('integration: building a view model never changes room bookings (AC5 at catalog level)', () => {
  const before = JSON.stringify(rooms);
  buildViewModel(form({ roomId: 'R3', startRaw: '660', endRaw: '720' }), rooms);
  assert.equal(JSON.stringify(rooms), before);
});
