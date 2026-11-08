// Room filtering ONLY (F1, F2). Pure; never mutates the catalog.
import type { Room } from '../data/rooms.ts';

export type RoomFilter = {
  /** null = no capacity requirement */
  attendees: number | null;
  /** every item must be present in the room (F2); empty = no equipment requirement */
  equipment: readonly string[];
};

export function meetsCapacity(room: Room, attendees: number | null): boolean {
  return attendees === null || room.capacity >= attendees; // F1: >=
}

export function hasAllEquipment(room: Room, required: readonly string[]): boolean {
  return required.every((item) => room.equipment.includes(item)); // F2: ALL items
}

export function filterRooms(catalog: readonly Room[], filter: RoomFilter): Room[] {
  return catalog.filter(
    (r) => meetsCapacity(r, filter.attendees) && hasAllEquipment(r, filter.equipment),
  );
}
