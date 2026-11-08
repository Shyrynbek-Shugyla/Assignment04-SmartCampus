# Assignment #04 – Smart Campus Room Availability Checker

Student: Shirinbek Shugyla · ID 24B032116 · Software Engineering, Fall 2026

## Contents

| Path | What it is |
|---|---|
| `initial/python_booking_rules/` | Assignment #03 Python rules + 26 tests |
| `initial/web_prototype/` | Assignment #03 React/TypeScript prototype (initial version) |
| `final/` | Final version: 5 rooms, capacity/equipment filters, refactored modules, tests |
| `test_results.txt` | Actual commands and outputs |
| `REPORT.pdf` | Analysis, diagrams, refactoring decisions, quality comparison |
| `AI_APPENDIX.pdf` | AI-use record, reflection |
| `diagrams/` | before/after diagrams (PNG) |

## Requirements

Node.js **22.18 or newer** (tests run TypeScript directly; on 22.6–22.17 add `--experimental-strip-types` to the test command) and npm. Python 3 only for the baseline tests.

## Setup and run

Gmail renames: `tailwind.config.js.txt`, `postcss.config.js.txt`, `eslint.config.js.txt` → remove the trailing `.txt`.

```bash
cd final
npm install
npm run dev          # open the printed local URL
```

## Tests

```bash
cd final
npm test             # 34 tests: AC1-AC5 regression, F1-F5, integration, old-vs-new equivalence
npm run test:ui      # renders App.tsx and checks the page structure (needs npm install first)
npm run demo         # prints the demonstration scenarios
npm run typecheck    # TypeScript check
npm run build        # production build

# baseline (initial Python version)
cd ../initial/python_booking_rules && python3 -m unittest test_booking
```

## Notes

* `final/tests/baseline/initial_availability.ts` is a verbatim copy of the initial rules, used as a test oracle.
* Fictional data only. No login, payments, live APIs or database.
