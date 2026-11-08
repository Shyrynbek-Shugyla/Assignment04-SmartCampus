import type { Booking } from '../lib/availability.ts';

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Booking[];
};

/** Fixed "current time" shown as the default (09:00). */
export const DEFAULT_NOW = 540;

/** All equipment items a user can require. Every room's list is a subset. */
export const EQUIPMENT_OPTIONS: string[] = [
  'Projector',
  'Whiteboard',
  'Microphone',
  'Video conferencing',
  'Computers',
];

/** Fictional catalog. Each room owns its bookings (minutes after midnight). */
export const rooms: Room[] = [
  {
    id: 'R1',
    name: 'R1 — Library Study Room',
    capacity: 6,
    equipment: ['Whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'R2',
    name: 'R2 — Lab (Blocked)',
    capacity: 20,
    equipment: ['Projector', 'Whiteboard', 'Computers'],
    blocked: true,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'R3',
    name: 'R3 — Seminar Room',
    capacity: 30,
    equipment: ['Projector', 'Whiteboard', 'Microphone'],
    blocked: false,
    bookings: [
      { start: 600, end: 660 },
      { start: 720, end: 780 },
    ],
  },
  {
    id: 'R4',
    name: 'R4 — Collaboration Pod',
    capacity: 4,
    equipment: ['Video conferencing'],
    blocked: false,
    bookings: [{ start: 840, end: 900 }],
  },
  {
    id: 'R5',
    name: 'R5 — Lecture Hall',
    capacity: 120,
    equipment: ['Projector', 'Microphone', 'Video conferencing'],
    blocked: false,
    bookings: [{ start: 660, end: 780 }],
  },
];
