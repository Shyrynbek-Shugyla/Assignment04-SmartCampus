// Display formatting ONLY.
import { MINUTE_MAX, MINUTE_MIN } from './availability.ts';
import { parseWholeNumber } from './validation.ts';

export function minutesToHHMM(minutes: number): string {
  if (!Number.isInteger(minutes) || minutes < MINUTE_MIN || minutes > MINUTE_MAX) return '--:--';
  const h = Math.floor(minutes / 60);
  const mm = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
}

/** HH:MM hint for a raw text field ('--:--' if it is not a whole number). */
export function hintFor(raw: string): string {
  const n = parseWholeNumber(raw);
  return n === null ? '--:--' : minutesToHHMM(n);
}
