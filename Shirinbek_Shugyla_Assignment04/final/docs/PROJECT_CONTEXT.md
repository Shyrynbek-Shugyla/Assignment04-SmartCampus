# Project context (given to the AI assistant)

**Product:** Smart Campus Room Availability Checker. A one-page tool that only *checks* availability (no booking button). Fictional data, fixed default "now" = 540 (09:00). No login, payments, live APIs or database. No new packages.

## Repository map (final version)

```
src/data/rooms.ts            Room type, 5 fictional rooms, EQUIPMENT_OPTIONS, DEFAULT_NOW
src/lib/availability.ts      canBook (AC1-AC5), overlaps, constants          - rules only
src/lib/validation.ts        validateMinuteField, validateStart/End/Now, validateAttendees, parseWholeNumber
src/lib/filtering.ts         meetsCapacity (F1), hasAllEquipment (F2), filterRooms
src/lib/format.ts            minutesToHHMM, hintFor                           - display only
src/lib/searchController.ts  buildViewModel(form, catalog) -> what the screen shows
src/components/*.tsx         FieldInput, ResultCard, RoomFilters
src/App.tsx                  state + layout
tests/                       node:test files, baseline/ (verbatim initial rules), ui_smoke.mjs, demo_scenarios.ts
```

## Acceptance criteria (must stay true)

* AC1 `0 <= start < end <= 1440` and `start > now` strictly.
* AC2 duration <= 120 minutes (120 allowed, 121 rejected).
* AC3 a blocked room rejects every request.
* AC4 reject overlap with existing bookings; touching endpoints are not overlap.
* AC5 clear Available/Unavailable result; checking never modifies bookings.
* AC6 plain per-field validation messages, separate from the result; works at 375 px.

## New requirements

* F1 capacity >= attendees. F2 room has ALL selected equipment. F3 blocked room is never reported available.
* F4 clear empty state when no room matches. F5 changing the room refreshes the result using that room's bookings.

## Working rules

Small changes, one at a time; run tests after each; never change rule order or messages without a failing test that justifies it.
