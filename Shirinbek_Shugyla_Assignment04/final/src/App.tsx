import { useMemo, useState } from 'react';
import { Clock, MapPin, SearchX, Timer } from 'lucide-react';
import FieldInput from '@/components/FieldInput';
import ResultCard from '@/components/ResultCard';
import RoomFilters from '@/components/RoomFilters';
import { DEFAULT_NOW, EQUIPMENT_OPTIONS, rooms } from '@/data/rooms';
import { hintFor } from '@/lib/format';
import { buildViewModel, type FormState } from '@/lib/searchController';

export default function App() {
  const [roomId, setRoomId] = useState<string>(rooms[0].id);
  const [startRaw, setStartRaw] = useState('');
  const [endRaw, setEndRaw] = useState('');
  const [nowRaw, setNowRaw] = useState(String(DEFAULT_NOW));
  const [attendeesRaw, setAttendeesRaw] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const form: FormState = { roomId, startRaw, endRaw, nowRaw, attendeesRaw, equipment, submitted };
  // All rules (filtering, validation, availability) live in lib/; the UI only renders the view model.
  const vm = useMemo(
    () => buildViewModel(form, rooms),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roomId, startRaw, endRaw, nowRaw, attendeesRaw, equipment, submitted],
  );

  function toggleEquipment(item: string) {
    setEquipment((cur) => (cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item]));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-100 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-300/40">
            <MapPin className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-purple-900">Campus Room Availability</h1>
          <p className="mt-1 text-sm text-purple-700/80">
            Check whether a room is free for your requested time.
          </p>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="rounded-3xl border border-pink-200/70 bg-white/80 p-5 shadow-xl shadow-purple-200/30 backdrop-blur"
        >
          <RoomFilters
            attendeesRaw={attendeesRaw}
            onAttendeesChange={setAttendeesRaw}
            attendeesError={vm.errors.attendees}
            equipmentOptions={EQUIPMENT_OPTIONS}
            selectedEquipment={equipment}
            onToggleEquipment={toggleEquipment}
          />

          <label htmlFor="room" className="mb-1 mt-4 block text-sm font-medium text-purple-900">
            Room
          </label>
          {vm.emptyState ? (
            <div
              role="status"
              data-testid="empty-state"
              className="flex items-start gap-3 rounded-xl border border-purple-200 bg-purple-50 p-3 text-sm text-purple-800"
            >
              <SearchX className="mt-0.5 h-4 w-4 shrink-0" />
              No rooms match these requirements. Try fewer attendees or less equipment.
            </div>
          ) : (
            <select
              id="room"
              value={vm.selectedRoom?.id ?? ''}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full rounded-xl border border-pink-200 bg-white px-3 py-2 text-sm text-purple-900 shadow-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
            >
              {vm.matchingRooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} · {r.capacity} seats
                </option>
              ))}
            </select>
          )}

          <div className="mt-4 grid grid-cols-1 gap-4">
            <FieldInput
              label="Start (minutes after midnight)"
              hint={hintFor(startRaw)}
              value={startRaw}
              onChange={setStartRaw}
              error={vm.errors.start}
              icon={<Timer className="h-4 w-4" />}
              submitted={submitted}
            />
            <FieldInput
              label="End (minutes after midnight)"
              hint={hintFor(endRaw)}
              value={endRaw}
              onChange={setEndRaw}
              error={vm.errors.end}
              icon={<Clock className="h-4 w-4" />}
              submitted={submitted}
            />
            <FieldInput
              label="Now (minutes after midnight)"
              hint={hintFor(nowRaw)}
              value={nowRaw}
              onChange={setNowRaw}
              error={vm.errors.now}
              icon={<Clock className="h-4 w-4" />}
              submitted={submitted}
            />
          </div>

          <button
            type="submit"
            disabled={vm.emptyState || (submitted && vm.formInvalid)}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-300/40 transition hover:from-pink-600 hover:to-purple-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Check Availability
          </button>
        </form>

        {vm.result && <ResultCard available={vm.result.available} reason={vm.result.reason} />}
      </div>
    </div>
  );
}
