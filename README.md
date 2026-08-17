# Sports Squad Constraint Checker

A compact single-screen application for checking a manually selected futsal
squad against a fixed roster and a defined set of composition rules.

## Purpose and scope

The application lets a student organiser select any roster players, inspect
live counts and rule states, and explicitly validate the current squad. It
reports every applicable violation in a deterministic order.

It validates the user's selection only. It does not recommend, rank, generate,
optimise, or automatically correct squads.

## Technology stack

- Vite
- React
- JavaScript
- Plain CSS
- Vitest
- React Testing Library, jest-dom, user-event, and jsdom

The application is entirely client-side. It has no backend, database,
authentication, routing, global state library, or external API.

## Architecture

```text
Fixed roster
    -> selectedIds
    -> validateSquad(roster, selectedIds)
    -> counts, rule states, ordered violations, status
    -> React UI
```

`selectedIds` is the primary mutable business state. The fixed roster is static
configuration, and `validateSquad()` is a pure JavaScript function kept separate
from React. Counts, rule states, violations, and status are derived rather than
stored, which prevents stale or duplicated business state.

## Running locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Running tests

```bash
npm test
```

The suite includes static-fixture tests, focused domain tests, and React
interaction tests.

## Production build

```bash
npm run build
```

## Validation rules

A valid squad must have:

- Exactly 7 distinct selected players.
- Exactly 1 goalkeeper.
- At least 2 defenders.
- At least 2 forwards.
- No unavailable selected player.
- No more than 4 players from either cohort.

Utility players count toward squad size and cohort totals, but not toward the
defender or forward minimums. Unknown or repeated player references produce
`INVALID_SELECTION_REFERENCE` instead of a partial rule evaluation.

## Required demonstrations

1. **Valid baseline:** S01-S07 produces `VALID`, with position counts 1/2/2/2
   and cohort counts YEAR_2 = 4 and YEAR_3 = 3.
2. **S07 replaced by S08:** produces `INVALID` with exactly
   `PLAYER_UNAVAILABLE: S08`, followed by
   `COHORT_LIMIT_EXCEEDED: YEAR_2 has 5, maximum 4`.
3. **Six-player case:** deselecting only S07 produces exactly
   `SQUAD_SIZE_MUST_BE_7`.
4. **Reset:** restores S01-S07, the baseline counts and rule states, and clears
   the previous explicit verdict.

## Project structure

```text
src/
  data/roster.js            Fixed roster and built-in selection
  domain/validateSquad.js   Pure validation and ordered violations
  components/               Focused presentation components
  App.jsx                   Selection state and UI coordination
  app.css                   Single-screen presentation
tests/
  roster.test.js            Static fixture contract
  validateSquad.test.js     Domain behavior and edge cases
  App.test.jsx              User-visible React interactions
docs/                       Source requirements and design documentation
```
