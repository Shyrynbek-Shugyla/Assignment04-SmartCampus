// Booking/availability rules ONLY. No validation of text, no formatting, no UI.
export type Booking = {
  start: number;
  end: number;
};

export type AvailabilityResult = {
  available: boolean;
  reason: string;
};

export const MINUTE_MIN = 0;
export const MINUTE_MAX = 1440;
export const MAX_DURATION = 120;

export function overlaps(a: Booking, start: number, end: number): boolean {
  return start < a.end && a.start < end;
}

/** Rule order (unchanged since Assignment #3): AC3, AC1, AC1(now), AC2, AC4. Never mutates inputs (AC5). */
export function canBook(
  start: number,
  end: number,
  now: number,
  blocked: boolean,
  existing: readonly Booking[],
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
