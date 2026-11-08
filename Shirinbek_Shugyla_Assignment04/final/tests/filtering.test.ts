// New requirements F1-F5 (room catalog + filtering) and catalog integrity.
import test from 'node:test';
import assert from 'node:assert/strict';
import { rooms, EQUIPMENT_OPTIONS } from '../src/data/rooms.ts';
import { filterRooms } from '../src/lib/filtering.ts';
import { buildViewModel, type FormState } from '../src/lib/searchController.ts';

const ids = (list: { id: string }[]) => list.map((r) => r.id);
const base: FormState = {
  roomId: 'R1', startRaw: '700', endRaw: '760', nowRaw: '540',
  attendeesRaw: '', equipment: [], submitted: true,
};

test('catalog: at least 4 rooms, each with id, name, capacity, equipment, blocked, bookings', () => {
  assert.ok(rooms.length >= 4);
  for (const r of rooms) {
    assert.equal(typeof r.id, 'string');
    assert.equal(typeof r.name, 'string');
    assert.ok(Number.isInteger(r.capacity) && r.capacity > 0);
    assert.ok(Array.isArray(r.equipment));
    assert.equal(typeof r.blocked, 'boolean');
    assert.ok(Array.isArray(r.bookings));
    for (const e of r.equipment) assert.ok(EQUIPMENT_OPTIONS.includes(e), `${r.id}: unknown equipment ${e}`);
  }
  assert.equal(new Set(ids(rooms)).size, rooms.length, 'room ids must be unique');
});

test('F1 capacity: exact capacity matches, one more attendee does not', () => {
  assert.deepEqual(ids(filterRooms(rooms, { attendees: 6, equipment: [] })).includes('R1'), true); // R1 capacity 6
  assert.deepEqual(ids(filterRooms(rooms, { attendees: 7, equipment: [] })).includes('R1'), false);
  assert.deepEqual(ids(filterRooms(rooms, { attendees: 120, equipment: [] })), ['R5']);
  assert.deepEqual(ids(filterRooms(rooms, { attendees: 121, equipment: [] })), []);
});

test('F2 equipment: room must contain ALL selected items (not just one)', () => {
  assert.deepEqual(ids(filterRooms(rooms, { attendees: null, equipment: ['Projector'] })), ['R2', 'R3', 'R5']);
  assert.deepEqual(ids(filterRooms(rooms, { attendees: null, equipment: ['Projector', 'Microphone'] })), ['R3', 'R5']);
  assert.deepEqual(ids(filterRooms(rooms, { attendees: null, equipment: ['Projector', 'Video conferencing', 'Whiteboard'] })), []);
});

test('F1+F2 combined: both filters must hold', () => {
  assert.deepEqual(ids(filterRooms(rooms, { attendees: 25, equipment: ['Microphone'] })), ['R3', 'R5']);
  assert.deepEqual(ids(filterRooms(rooms, { attendees: 100, equipment: ['Whiteboard'] })), []);
});

test('filtering does not mutate the catalog', () => {
  const before = JSON.stringify(rooms);
  filterRooms(rooms, { attendees: 10, equipment: ['Projector'] });
  assert.equal(JSON.stringify(rooms), before);
});

test('F3 blocked room is never reported as available (even for a free slot)', () => {
  const vm = buildViewModel({ ...base, roomId: 'R2', startRaw: '700', endRaw: '760' }, rooms);
  assert.equal(vm.selectedRoom?.id, 'R2');
  assert.equal(vm.result?.available, false);
  assert.match(vm.result!.reason, /blocked/);
});

test('F4 empty state when no room matches, and no result is produced', () => {
  const vm = buildViewModel({ ...base, attendeesRaw: '500' }, rooms);
  assert.equal(vm.emptyState, true);
  assert.equal(vm.selectedRoom, null);
  assert.equal(vm.result, null);
  assert.deepEqual(vm.matchingRooms, []);
});

test('F5 switching room refreshes the result using THAT room\'s bookings', () => {
  const r1 = buildViewModel({ ...base, roomId: 'R1', startRaw: '700', endRaw: '760' }, rooms);
  const r3 = buildViewModel({ ...base, roomId: 'R3', startRaw: '700', endRaw: '760' }, rooms);
  assert.equal(r1.result?.available, true); // R1 only booked 600-660
  assert.equal(r3.result?.available, false); // R3 has 720-780
  assert.match(r3.result!.reason, /720 to 780/);
});

test('F5 if the filter removes the selected room, the check never falls back to an unfiltered room', () => {
  const vm = buildViewModel({ ...base, roomId: 'R1', attendeesRaw: '25' }, rooms); // R1 holds 6
  assert.deepEqual(ids(vm.matchingRooms), ['R3', 'R5']);
  assert.equal(vm.selectedRoom?.id, 'R3');
  assert.notEqual(vm.selectedRoom?.id, 'R1');
});
