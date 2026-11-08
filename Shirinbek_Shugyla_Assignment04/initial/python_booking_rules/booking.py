def can_book(
    start: int,
    end: int,
    now: int,
    blocked: bool,
    existing: list[tuple[int, int]],
) -> bool:
    """Check whether a booking is allowed without modifying any input."""
    # AC3: A blocked room rejects every request.
    if blocked:
        return False

    # AC1: Require valid day bounds and a start strictly after now.
    if not (0 <= start < end <= 1440 and start > now):
        return False

    # AC2: Allow durations up to and including 120 minutes.
    if end - start > 120:
        return False

    # AC4: Reject overlap; touching endpoints are allowed.
    for booked_start, booked_end in existing:
        if start < booked_end and booked_start < end:
            return False

    # AC5: Return only Boolean literals; inputs are read only.
    return True