// Turns raw form text into everything the screen needs. No React: fully testable in plain Node.
import type { Room } from '../data/rooms.ts';
import { canBook, type AvailabilityResult } from './availability.ts';
import { filterRooms } from './filtering.ts';
import {
  errorMessage,
  parseWholeNumber,
  validateAttendees,
  validateEnd,
  validateNow,
  validateStart,
} from './validation.ts';

export type FormState = {
  roomId: string;
  startRaw: string;
  endRaw: string;
  nowRaw: string;
  attendeesRaw: string;
  equipment: readonly string[];
  submitted: boolean;
};

export type ViewModel = {
  matchingRooms: Room[];
  /** F4: true when the filters match no room */
  emptyState: boolean;
  /** The room actually used for the check; null when no room matches */
  selectedRoom: Room | null;
  errors: { start: string | null; end: string | null; now: string | null; attendees: string | null };
  formInvalid: boolean;
  /** null until Check is pressed, or while the form is invalid or no room matches */
  result: AvailabilityResult | null;
};

export function buildViewModel(form: FormState, catalog: readonly Room[]): ViewModel {
  const attendeesErr = errorMessage(validateAttendees(form.attendeesRaw));
  const attendees = attendeesErr || form.attendeesRaw.trim() === '' ? null : Number(form.attendeesRaw);
  const matchingRooms = filterRooms(catalog, { attendees, equipment: form.equipment });

  // F5: the chosen room must come from the filtered list. If it dropped out, fall back to
  // the first matching room (never to an unfiltered room); with no match there is no room.
  const selectedRoom = matchingRooms.find((r) => r.id === form.roomId) ?? matchingRooms[0] ?? null;

  const start = parseWholeNumber(form.startRaw);
  const errors = {
    start: errorMessage(validateStart(form.startRaw)),
    end: errorMessage(validateEnd(form.endRaw, start)),
    now: errorMessage(validateNow(form.nowRaw)),
    attendees: attendeesErr,
  };
  const formInvalid = Object.values(errors).some((e) => e !== null);

  let result: AvailabilityResult | null = null;
  if (form.submitted && !formInvalid && selectedRoom !== null && start !== null) {
    result = canBook(
      start,
      Number(form.endRaw),
      Number(form.nowRaw),
      selectedRoom.blocked,
      selectedRoom.bookings,
    );
  }

  return {
    matchingRooms,
    emptyState: matchingRooms.length === 0,
    selectedRoom,
    errors,
    formInvalid,
    result,
  };
}
