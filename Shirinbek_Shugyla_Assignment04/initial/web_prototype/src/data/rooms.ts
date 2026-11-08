import type { Booking } from '@/lib/availability';

export type Room = {
  id: string;
  name: string;
  blocked: boolean;
  bookings: Booking[];
};

export const DEFAULT_NOW = 540;

export const rooms: Room[] = [
  {
    id: 'R1',
    name: 'R1 — Library Study Room',
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'R2',
    name: 'R2 — Lab (Blocked)',
    blocked: true,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'R3',
    name: 'R3 — Seminar Room',
    blocked: false,
    bookings: [
      { start: 600, end: 660 },
      { start: 720, end: 780 },
    ],
  },
];
