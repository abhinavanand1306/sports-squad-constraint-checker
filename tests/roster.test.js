import { describe, expect, it } from 'vitest';
import { BUILT_IN_SELECTED_IDS, ROSTER } from '../src/data/roster.js';

const EXPECTED_ROSTER = [
  ['S01', 'Aditi Rao', 'GOALKEEPER', 'YEAR_2', 'AVAILABLE'],
  ['S02', 'Bilal Khan', 'DEFENDER', 'YEAR_2', 'AVAILABLE'],
  ['S03', 'Chitra Nair', 'DEFENDER', 'YEAR_3', 'AVAILABLE'],
  ['S04', 'Deepak Shah', 'FORWARD', 'YEAR_2', 'AVAILABLE'],
  ['S05', 'Esha Roy', 'FORWARD', 'YEAR_3', 'AVAILABLE'],
  ['S06', 'Farhan Das', 'UTILITY', 'YEAR_2', 'AVAILABLE'],
  ['S07', 'Gita Menon', 'UTILITY', 'YEAR_3', 'AVAILABLE'],
  ['S08', 'Harish Patel', 'FORWARD', 'YEAR_2', 'UNAVAILABLE'],
  ['S09', 'Imani Joseph', 'GOALKEEPER', 'YEAR_3', 'AVAILABLE'],
];

describe('static squad data', () => {
  it('matches the fixed nine-player roster in source order', () => {
    expect(
      ROSTER.map(({ id, student, position, cohort, availability }) => [
        id,
        student,
        position,
        cohort,
        availability,
      ]),
    ).toEqual(EXPECTED_ROSTER);
  });

  it('uses S01 through S07 as the built-in selection', () => {
    expect(BUILT_IN_SELECTED_IDS).toEqual([
      'S01',
      'S02',
      'S03',
      'S04',
      'S05',
      'S06',
      'S07',
    ]);
  });

  it('exposes the roster and built-in selection as immutable fixtures', () => {
    expect(Object.isFrozen(ROSTER)).toBe(true);
    expect(ROSTER.every(Object.isFrozen)).toBe(true);
    expect(Object.isFrozen(BUILT_IN_SELECTED_IDS)).toBe(true);
  });
});

