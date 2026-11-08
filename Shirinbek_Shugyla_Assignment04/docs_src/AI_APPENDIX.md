---
title: "Software Engineering – Assignment #04: AI Evidence Appendix"
author: "Shirinbek Shugyla · ID 24B032116"
date: "8 November 2026"
---

**AI assistant used:** Claude (Sonnet 5.5) in claude.ai, one conversation, 8 November 2026. No other AI tool was used for this assignment.

# 1. Task 6 – AI reflection

I gave Claude the assignment brief, my Assignment #03 Python and React code and my earlier AI-evidence file, and asked it to work step by step. From these it produced a repository map, the acceptance criteria and the constraints (no login, no database, no new packages), which I kept in one file, `final/docs/PROJECT_CONTEXT.md`.

Useful suggestions: the maintainability-risk list backed by grep counts, a view-model function that makes the filters testable without a browser, and a verbatim copy of the old rules used as a test oracle. Incorrect or rejected: it proposed Vitest, React Testing Library and jsdom, which I rejected because they add packages the brief avoids; it claimed "3,600+" test inputs when the real number is 3,456, which a failing test exposed; and its first UI-check script failed twice (two copies of React, then a broken icon stub) before it worked.

I personally verified: **[I ran `npm install`, `npm test`, `npm run typecheck` and `npm run build`, opened the page at 375 px, and pasted the results into `test_results.txt`.]**

Tests drove my decisions: the 3,456-input comparison let me merge three validators and slim `App.tsx` without fear of changing behaviour, and the F5 tests justified removing the `?? rooms[0]` fallback.

Next I would add browser-level tests (typing and clicking), change the `Now` range from 0–1440 to 0–1439 as a deliberate requirement change, and share one rule specification between the Python and TypeScript versions.

# 2. AI-use record

| # | Tool / date | Prompt summary | Output used | Problems found | Changes made | Verification |
|---|---|---|---|---|---|---|
| 1 | Claude, 8 Nov 2026 | Exact text: *"help me to do this asssignment explain what to do and what files i nned to attathed to passs this assignment to teacher \ and lets do this step by step"* (with the assignment PDF) | Task breakdown, list of files to submit, submission rules (email address, subject, deadline) | none found | – | Compared against the PDF pages "Required deliverables" and "Submission details" |
| 2 | Claude, 8 Nov 2026 | Uploaded `A3_code.zip`, `A3_prototype.zip`, `AI_Evidence_assignment3.pdf` | Reading of the initial code; risk list R1–R6; prioritised plan | none | – | Re-ran Python tests (26/26); grep counts for R1, R2, R5; read `App.tsx` for R3 |
| 3 | Claude, 8 Nov 2026 | Implement room catalog, filters and refactoring in small modules | `rooms.ts`, `filtering.ts`, `validation.ts`, `format.ts`, `searchController.ts`, three components, new `App.tsx` | Test tooling: wrong input count (3,600 vs 3,456); UI-check script used two React copies, then a stub for icons built with a Proxy that esbuild could not read | Count corrected; React marked external; stub rewritten with explicit names | `node --test` 34/34; `tsc --strict` on logic modules; render check passes |
| 4 | Claude, 8 Nov 2026 | Tests, demo scenarios, measurements, diagrams, report, README | Test files, `demo_scenarios.ts`, tables in `REPORT`, Graphviz diagrams | A first assemble script stopped because the output folder rejects symbolic links | UI check was run from a working copy with identical files (verified with `diff -rq`) | Output copied unedited into `test_results.txt` |

**Known gaps in AI verification (not hidden):** the AI sandbox had no internet, so `npm install`, `npm run build`, ESLint and a TypeScript check of the React components were **not** run by the AI; the UI render check used a stub instead of the real icon library. These are listed as items to run on my own machine in section E of `test_results.txt`.

# 3. Screenshots of the AI conversation

*(Insert screenshots of the Claude conversation here, in the same style as Assignment #03.)*
