// Text-field validation ONLY. The whole-number pattern lives here and nowhere else.
import { MINUTE_MAX, MINUTE_MIN } from './availability.ts';

export type FieldError = { ok: true } | { ok: false; message: string };

const WHOLE_NUMBER = /^-?\d+$/;

export function isEmpty(value: string): boolean {
  return value.trim() === '';
}

export function isWholeNumber(value: string): boolean {
  return WHOLE_NUMBER.test(value.trim());
}

/** Returns the number if `raw` is a whole number, otherwise null. */
export function parseWholeNumber(raw: string): number | null {
  return isWholeNumber(raw) ? Number(raw) : null;
}

/** Validates a minutes-after-midnight field. Messages are identical to the initial version. */
export function validateMinuteField(
  label: 'Start' | 'End' | 'Now',
  raw: string,
  mustBeAfter: number | null = null,
): FieldError {
  if (isEmpty(raw)) return { ok: false, message: `${label} is required.` };
  if (!isWholeNumber(raw)) return { ok: false, message: `${label} must be a whole number.` };
  const n = Number(raw);
  if (n < MINUTE_MIN || n > MINUTE_MAX)
    return { ok: false, message: `${label} must be a whole number from 0 to 1440.` };
  if (mustBeAfter !== null && n <= mustBeAfter)
    return { ok: false, message: `${label} must be later than start.` };
  return { ok: true };
}

export const validateStart = (raw: string): FieldError => validateMinuteField('Start', raw);
export const validateEnd = (raw: string, start: number | null): FieldError =>
  validateMinuteField('End', raw, start);
export const validateNow = (raw: string): FieldError => validateMinuteField('Now', raw);

/** Optional attendee count: empty = no capacity filter, otherwise a whole number >= 1. */
export function validateAttendees(raw: string): FieldError {
  if (isEmpty(raw)) return { ok: true };
  if (!isWholeNumber(raw) || Number(raw) < 1)
    return { ok: false, message: 'Attendees must be a whole number of 1 or more.' };
  return { ok: true };
}

export function errorMessage(e: FieldError): string | null {
  return e.ok ? null : e.message;
}
