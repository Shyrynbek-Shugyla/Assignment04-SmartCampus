// Prints the demonstration scenarios required by Task 2 (real output of the real code). Run: npm run demo
import { rooms } from '../src/data/rooms.ts';
import { buildViewModel, type FormState } from '../src/lib/searchController.ts';

const base: FormState = { roomId: 'R1', startRaw: '', endRaw: '', nowRaw: '540', attendeesRaw: '', equipment: [], submitted: true };
function show(title: string, f: Partial<FormState>) {
  const vm = buildViewModel({ ...base, ...f }, rooms);
  const list = vm.matchingRooms.map((r) => r.id).join(',') || '(none)';
  const res = vm.emptyState ? 'EMPTY STATE: no rooms match'
    : vm.result ? `${vm.result.available ? 'AVAILABLE' : 'UNAVAILABLE'} - ${vm.result.reason}`
    : `no result (errors: ${Object.values(vm.errors).filter(Boolean).join(' | ') || 'none'})`;
  console.log(`${title}\n   rooms shown: ${list}; room used: ${vm.selectedRoom?.id ?? '-'}\n   => ${res}\n`);
}
show('S1 filter success: 25 attendees + Microphone', { attendeesRaw: '25', equipment: ['Microphone'], roomId: 'R3', startRaw: '660', endRaw: '720' });
show('S2 filter failure: 500 attendees', { attendeesRaw: '500' });
show('S3 filter failure: Projector + Video conferencing + Whiteboard', { equipment: ['Projector', 'Video conferencing', 'Whiteboard'] });
show('S4 room switching, step 1: R1, 700-760', { roomId: 'R1', startRaw: '700', endRaw: '760' });
show('S5 room switching, step 2: same request, now R3', { roomId: 'R3', startRaw: '700', endRaw: '760' });
show('S6 blocked room R2 with a free slot', { roomId: 'R2', startRaw: '700', endRaw: '760' });
show('S7 original rule AC2: 121 minutes in R1', { roomId: 'R1', startRaw: '720', endRaw: '841' });
show('S8 original rule AC4: touching (660-720 after booking 600-660)', { roomId: 'R1', startRaw: '660', endRaw: '720' });
show('S9 original rule AC4: overlap (630-690)', { roomId: 'R1', startRaw: '630', endRaw: '690' });
show('S10 original rule AC1: start == now', { roomId: 'R1', startRaw: '540', endRaw: '570' });
show('S11 AC6 validation: empty start, text end', { startRaw: '', endRaw: 'abc' });
