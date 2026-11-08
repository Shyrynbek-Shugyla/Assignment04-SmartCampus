// VERBATIM COPY of src/lib/availability.ts from the INITIAL version (Assignment #3 Bolt export). Do not edit.
export type Booking = {
  start: number;
  end: number;
};

export type AvailabilityResult = {
  available: boolean;
  reason: string;
};

export type FieldError =
  | { ok: true }
  | { ok: false; message: string };

export const MINUTE_MIN = 0;
export const MINUTE_MAX = 1440;
export const MAX_DURATION = 120;

export function isEmpty(value: string): boolean {
  return value.trim() === '';
}

export function isWholeNumber(value: string): boolean {
  return /^-?\d+$/.test(value.trim());
}

export function validateStart(raw: string): FieldError {
  if (isEmpty(raw)) return { ok: false, message: 'Start is required.' };
  if (!isWholeNumber(raw)) return { ok: false, message: 'Start must be a whole number.' };
  const n = Number(raw);
  if (!Number.isInteger(n) || n < MINUTE_MIN || n > MINUTE_MAX)
    return { ok: false, message: 'Start must be a whole number from 0 to 1440.' };
  return { ok: true };
}

export function validateEnd(raw: string, start: number | null): FieldError {
  if (isEmpty(raw)) return { ok: false, message: 'End is required.' };
  if (!isWholeNumber(raw)) return { ok: false, message: 'End must be a whole number.' };
  const n = Number(raw);
  if (!Number.isInteger(n) || n < MINUTE_MIN || n > MINUTE_MAX)
    return { ok: false, message: 'End must be a whole number from 0 to 1440.' };
  if (start !== null && n <= start)
    return { ok: false, message: 'End must be later than start.' };
  return { ok: true };
}

export function validateNow(raw: string): FieldError {
  if (isEmpty(raw)) return { ok: false, message: 'Now is required.' };
  if (!isWholeNumber(raw)) return { ok: false, message: 'Now must be a whole number.' };
  const n = Number(raw);
  if (!Number.isInteger(n) || n < MINUTE_MIN || n > MINUTE_MAX)
    return { ok: false, message: 'Now must be a whole number from 0 to 1440.' };
  return { ok: true };
}

function overlaps(a: Booking, start: number, end: number): boolean {
  return start < a.end && a.start < end;
}

export function canBook(
  start: number,
  end: number,
  now: number,
  blocked: boolean,
  existing: Booking[]
): AvailabilityResult {
  if (blocked) {
    return { available: false, reason: 'This room is blocked and cannot be booked.' };
  }
  if (!(start >= MINUTE_MIN && end <= MINUTE_MAX && start < end)) {
    return { available: false, reason: 'Time range is invalid.' };
  }
  if (!(start > now)) {
    return { available: false, reason: 'Start must be strictly after now.' };
  }
  const duration = end - start;
  if (duration > MAX_DURATION) {
    return {
      available: false,
      reason: `Duration is ${duration} minutes; the maximum allowed is ${MAX_DURATION}.`,
    };
  }
  const conflict = existing.find((b) => overlaps(b, start, end));
  if (conflict) {
    return {
      available: false,
      reason: `Overlaps an existing booking from ${conflict.start} to ${conflict.end}.`,
    };
  }
  return { available: true, reason: 'Room is available for the requested time.' };
}

export function minutesToHHMM(minutes: number): string {
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 1440) return '--:--';
  const h = Math.floor(minutes / 60);
  const mm = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
}
