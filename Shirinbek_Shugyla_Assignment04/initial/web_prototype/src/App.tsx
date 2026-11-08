import { useMemo, useState } from 'react';
import { CalendarCheck, CalendarX, Clock, MapPin, Timer } from 'lucide-react';
import {
  canBook,
  minutesToHHMM,
  validateEnd,
  validateNow,
  validateStart,
  type Booking,
  type FieldError,
} from '@/lib/availability';
import { DEFAULT_NOW, rooms } from '@/data/rooms';

function fieldErrorToMessage(e: FieldError): string | null {
  return e.ok ? null : e.message;
}

function ResultCard({
  available,
  reason,
}: {
  available: boolean;
  reason: string;
}) {
  if (available) {
    return (
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-50 to-fuchsia-50 p-4 shadow-sm">
        <div className="rounded-xl bg-pink-500 p-2 text-white shadow-md shadow-pink-300/50">
          <CalendarCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-semibold text-pink-700">Available</p>
          <p className="text-sm text-pink-600/90">{reason}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 p-4 shadow-sm">
      <div className="rounded-xl bg-purple-600 p-2 text-white shadow-md shadow-purple-300/50">
        <CalendarX className="h-5 w-5" />
      </div>
      <div>
        <p className="text-base font-semibold text-purple-700">Unavailable</p>
        <p className="text-sm text-purple-600/90">{reason}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState<string>(rooms[0].id);
  const [startRaw, setStartRaw] = useState<string>('');
  const [endRaw, setEndRaw] = useState<string>('');
  const [nowRaw, setNowRaw] = useState<string>(String(DEFAULT_NOW));
  const [submitted, setSubmitted] = useState<boolean>(false);

  const startNum = useMemo<number | null>(() => {
    if (!/^-?\d+$/.test(startRaw.trim())) return null;
    return Number(startRaw);
  }, [startRaw]);

  const startErr = fieldErrorToMessage(validateStart(startRaw));
  const endErr = fieldErrorToMessage(validateEnd(endRaw, startNum));
  const nowErr = fieldErrorToMessage(validateNow(nowRaw));

  const formInvalid = !!(startErr || endErr || nowErr);

  const result = useMemo(() => {
    if (!submitted || formInvalid) return null;
    if (startNum === null) return null;
    const endNum = Number(endRaw);
    const nowNum = Number(nowRaw);
    const room = rooms.find((r) => r.id === roomId) ?? rooms[0];
    return canBook(
      startNum,
      endNum,
      nowNum,
      room.blocked,
      room.bookings as Booking[]
    );
  }, [submitted, formInvalid, startNum, endRaw, nowRaw, roomId]);

  function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const startHint = startNum !== null ? minutesToHHMM(startNum) : '--:--';
  const endHint = (() => {
    if (!/^-?\d+$/.test(endRaw.trim())) return '--:--';
    return minutesToHHMM(Number(endRaw));
  })();
  const nowHint = (() => {
    if (!/^-?\d+$/.test(nowRaw.trim())) return '--:--';
    return minutesToHHMM(Number(nowRaw));
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-100 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-300/40">
            <MapPin className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-purple-900">
            Campus Room Availability
          </h1>
          <p className="mt-1 text-sm text-purple-700/80">
            Check whether a room is free for your requested time.
          </p>
        </header>

        <form
          onSubmit={handleCheck}
          className="rounded-3xl border border-pink-200/70 bg-white/80 p-5 shadow-xl shadow-purple-200/30 backdrop-blur"
        >
          <label className="mb-1 block text-sm font-medium text-purple-900">
            Room
          </label>
          <select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full rounded-xl border border-pink-200 bg-white px-3 py-2 text-sm text-purple-900 shadow-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
          >
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <FieldInput
              label="Start (minutes after midnight)"
              hint={startHint}
              value={startRaw}
              onChange={setStartRaw}
              error={startErr}
              icon={<Timer className="h-4 w-4" />}
              submitted={submitted}
            />
            <FieldInput
              label="End (minutes after midnight)"
              hint={endHint}
              value={endRaw}
              onChange={setEndRaw}
              error={endErr}
              icon={<Clock className="h-4 w-4" />}
              submitted={submitted}
            />
            <FieldInput
              label="Now (minutes after midnight)"
              hint={nowHint}
              value={nowRaw}
              onChange={setNowRaw}
              error={nowErr}
              icon={<Clock className="h-4 w-4" />}
              submitted={submitted}
            />
          </div>

          <button
            type="submit"
            disabled={submitted && formInvalid}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-300/40 transition hover:from-pink-600 hover:to-purple-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Check Availability
          </button>
        </form>

        {result && <ResultCard available={result.available} reason={result.reason} />}
      </div>
    </div>
  );
}

function FieldInput({
  label,
  hint,
  value,
  onChange,
  error,
  icon,
  submitted,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  error: string | null;
  icon: React.ReactNode;
  submitted: boolean;
}) {
  const showError = submitted && !!error;
  return (
    <div>
      <label className="mb-1 flex items-center justify-between text-sm font-medium text-purple-900">
        <span className="flex items-center gap-1.5 text-purple-700">{icon}{label}</span>
        <span className="text-xs font-normal text-pink-500">{hint}</span>
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          'w-full rounded-xl border bg-white px-3 py-2 text-sm text-purple-900 shadow-sm outline-none focus:ring-2',
          showError
            ? 'border-purple-300 focus:border-purple-400 focus:ring-purple-200'
            : 'border-pink-200 focus:border-pink-400 focus:ring-pink-200',
        ].join(' ')}
      />
      {showError && (
        <p className="mt-1 text-xs text-purple-600">{error}</p>
      )}
    </div>
  );
}
