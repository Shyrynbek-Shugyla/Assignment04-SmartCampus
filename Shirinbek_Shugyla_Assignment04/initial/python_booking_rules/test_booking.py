import unittest

from booking import can_book


class TestCanBook(unittest.TestCase):
    def setUp(self):
        self.now = 540
        self.blocked = False
        self.existing = [(600, 660)]

    def test_t01_touching_after(self):
        self.assertIs(
            can_book(660, 720, self.now, self.blocked, self.existing), True
        )

    def test_t02_overlap(self):
        self.assertIs(
            can_book(630, 690, self.now, self.blocked, self.existing), False
        )

    def test_t03_blocked(self):
        self.assertIs(
            can_book(660, 720, self.now, True, self.existing), False
        )

    def test_t04_exactly_120_minutes(self):
        self.assertIs(
            can_book(720, 840, self.now, self.blocked, self.existing), True
        )

    def test_t05_121_minutes(self):
        self.assertIs(
            can_book(720, 841, self.now, self.blocked, self.existing), False
        )

    def test_t06_starts_now(self):
        self.assertIs(
            can_book(540, 570, self.now, self.blocked, self.existing), False
        )

    def test_t07_reversed_times(self):
        self.assertIs(
            can_book(720, 660, self.now, self.blocked, self.existing), False
        )

    def test_t08_equal_times(self):
        self.assertIs(
            can_book(720, 720, self.now, self.blocked, self.existing), False
        )

    def test_t09_start_zero(self):
        self.assertIs(can_book(0, 30, 0, self.blocked, []), False)

    def test_t10_start_below_zero(self):
        self.assertIs(can_book(-1, 30, 0, self.blocked, []), False)

    def test_t11_end_at_1440(self):
        self.assertIs(
            can_book(1380, 1440, self.now, self.blocked, self.existing), True
        )

    def test_t12_end_above_1440(self):
        self.assertIs(
            can_book(1380, 1441, self.now, self.blocked, self.existing), False
        )

    def test_t13_start_at_1440(self):
        self.assertIs(
            can_book(1440, 1441, self.now, self.blocked, []), False
        )

    def test_t14_touching_before(self):
        self.assertIs(
            can_book(570, 600, self.now, self.blocked, self.existing), True
        )

    def test_t15_gap_between_bookings(self):
        existing = [(600, 660), (720, 780), (900, 960)]
        self.assertIs(
            can_book(660, 720, self.now, self.blocked, existing), True
        )

    def test_t16_overlap_with_second_booking(self):
        existing = [(600, 660), (790, 850), (900, 960)]
        self.assertIs(
            can_book(780, 810, self.now, self.blocked, existing), False
        )

    def test_t17_empty_existing(self):
        self.assertIs(
            can_book(600, 660, self.now, self.blocked, []), True
        )

    def test_t18_one_minute_after_now_touching_before(self):
        self.assertIs(
            can_book(541, 600, self.now, self.blocked, self.existing), True
        )

    def test_t19_120_minutes_ending_at_1440(self):
        self.assertIs(
            can_book(1320, 1440, self.now, self.blocked, self.existing), True
        )

    def test_t20_unsorted_existing(self):
        existing = [(720, 780), (600, 660)]
        self.assertIs(
            can_book(650, 700, self.now, self.blocked, existing), False
        )

    def test_n01_no_mutation_on_true(self):
        before = self.existing.copy()
        result = can_book(
            660, 720, self.now, self.blocked, self.existing
        )
        self.assertIs(result, True)
        self.assertEqual(self.existing, before)

    def test_n02_no_mutation_on_false(self):
        before = self.existing.copy()
        result = can_book(
            630, 690, self.now, self.blocked, self.existing
        )
        self.assertIs(result, False)
        self.assertEqual(self.existing, before)


if __name__ == "__main__":
    unittest.main()

class TestReviewGaps(unittest.TestCase):
    """Cases added by hand after the AI review (stage C)."""

    def test_t21_start_before_now(self):
        self.assertIs(can_book(539, 570, 540, False, []), False)

    def test_t22_request_contains_booking(self):
        self.assertIs(can_book(590, 670, 540, False, [(600, 660)]), False)

    def test_t23_request_inside_booking(self):
        self.assertIs(can_book(610, 650, 540, False, [(600, 660)]), False)

    def test_t24_exact_duplicate(self):
        self.assertIs(can_book(600, 660, 540, False, [(600, 660)]), False)
